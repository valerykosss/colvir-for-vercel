import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { PDFPage, PDFFont } from 'pdf-lib';

// async function fetchCertificate(id: string, code: string | null) {
//   return code
//     ? await db.certificate.findFirst({
//         where: {
//           OR: [
//             { oldId: isNaN(Number(id)) ? undefined : Number(id), code },
//             { id },
//           ].filter(Boolean) as any,
//         },
//       })
//     : await db.certificate.findUnique({ where: { id } });
// }

async function fetchCertificate(id: string, code: string | null) {
  if (!code) {
    return await db.certificate.findUnique({ where: { id } });
  }

  const conditions = [];
  
  if (!isNaN(Number(id))) {
    conditions.push({ oldId: Number(id), code });
  }

  conditions.push({ id });

  return await db.certificate.findFirst({
    where: { OR: conditions },
  });
}


async function loadFont(pdfDoc: PDFDocument, fontUrl: string) {
  const fontResponse = await fetch(fontUrl);
  if (!fontResponse.ok) throw new Error(`Failed to load font: ${fontResponse.statusText}`);
  const fontBytes = await fontResponse.arrayBuffer();
  return await pdfDoc.embedFont(fontBytes);
}

async function loadBackground(pdfDoc: PDFDocument, backgroundUrl: string) {
  const response = await fetch(backgroundUrl, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Failed to fetch background image: ${response.statusText}`);
  const contentType = response.headers.get('content-type');
  if (!contentType?.startsWith('image/')) throw new Error(`Invalid content type: ${contentType}`);
  const bytes = await response.arrayBuffer();
  if (bytes.byteLength === 0 || bytes.byteLength > 5 * 1024 * 1024) throw new Error('Invalid image size');
  try {
    return await pdfDoc.embedJpg(bytes);
  } catch {
    return await pdfDoc.embedPng(bytes);
  }
}

function drawText(
  page: PDFPage,
  font: PDFFont,
  maxWidth: number,
  text: string,
  x: number,  // Позиция x уже определяет выравнивание
  y: number,
  size = 200,
  color = rgb(0.2, 0.2, 0.2),
  lineHeight?: number
) {
  const effectiveLineHeight = lineHeight || size * 1.2;
  let currentY = y;
  let remainingText = text;

  while (remainingText) {
    let fittingText = remainingText;
    let textWidth = font.widthOfTextAtSize(fittingText, size);

    while (textWidth > maxWidth && fittingText.length > 0) {
      const lastSpaceIndex = fittingText.lastIndexOf(' ');
      if (lastSpaceIndex === -1 || lastSpaceIndex === 0) {
        fittingText = fittingText.substring(0, fittingText.length - 1);
      } else {
        fittingText = fittingText.substring(0, lastSpaceIndex);
      }
      textWidth = font.widthOfTextAtSize(fittingText, size);
    }

    if (fittingText) {
      page.drawText(fittingText, {
        x,  // Выравнивание контролируется этим параметром
        y: currentY,
        size,
        font,
        color
      });

      remainingText = remainingText.substring(fittingText.length).trimStart();
      currentY -= effectiveLineHeight;
    } else {
      break;
    }
  }
}

async function generateQRCodeImage(pdfDoc: PDFDocument, url: string) {
  const qrDataUrl = await QRCode.toDataURL(url, { margin: 1 });
  const base64 = qrDataUrl.split(',')[1];
  const qrBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return await pdfDoc.embedPng(qrBytes.buffer);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const code = searchParams.get('code');

  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

  try {
    const certificate = await fetchCertificate(id, code);
    if (!certificate || !certificate.fullName || !certificate.courseName || !certificate.createdAt) {
      return NextResponse.json({ error: 'Certificate not found or incomplete' }, { status: 404 });
    }

    const formatDate = (dateInput: Date | string): string => {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  const formattedDate = formatDate(certificate.createdAt); 

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    console.log('NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? request.headers.get('origin');
    if (!baseUrl) throw new Error('Base URL is not defined');
    const fontUrl = new URL('/fonts/Roboto-Regular.ttf', baseUrl).toString();
    const customFont = await loadFont(pdfDoc, fontUrl);

    const backgroundUrl = `${baseUrl}/backgrounds/${certificate.background || 'default.jpg'}`;
    const backgroundImage = await loadBackground(pdfDoc, backgroundUrl);

    const page = pdfDoc.addPage([backgroundImage.width, backgroundImage.height]);
    page.drawImage(backgroundImage, { x: 0, y: 0, width: backgroundImage.width, height: backgroundImage.height });

    const { width } = page.getSize();
    const halfWidth = width / 2;
    const rightColumnX = halfWidth + 650; // Отступ 100pt от середины
    drawText(page, customFont, width, certificate.oldId ? `№: ${certificate.oldId}` : `№: ${certificate.id}`, 450, 5600, 450, rgb(0.2,0.2,0.2));
    const dateYPosition = 5600 - 250; // 450 (размер шрифта) + 50 (отступ)
    drawText(
      page,
      customFont,
      width,
      formattedDate,
      450,
      dateYPosition,
      150,
      rgb(0.2, 0.2, 0.2),
    );
    drawText(page, customFont, width, certificate.fullName, 430, 3900, 350, rgb(0.2,0.2,0.2));
    // drawText(page, customFont, halfWidth - 1000, `${certificate.courseName+' ('+certificate.hours || 0} ч.${certificate.format ? `, формат: ${certificate.format}` : '' + ')'}`, rightColumnX, 3900, 350, rgb(0.9,0.9,0.9), 'left');
    drawText(
      page,
      customFont,
      halfWidth - 1000,
      `${certificate.courseName} (${certificate.hours || 0} ч.${
        certificate.format ? `, формат: ${certificate.format}` : ''
      })`,
      rightColumnX,
      3900,
      350,
      rgb(0.9, 0.9, 0.9),
    );



    const certUrl = new URL('/certificate', baseUrl);
    certUrl.searchParams.set('id', certificate.id);
    if (certificate.code) certUrl.searchParams.set('code', certificate.code);

    const qrImage = await generateQRCodeImage(pdfDoc, certUrl.toString());
    const qrSize = 80;
    const qrLinkOffset = 100;

    page.drawImage(qrImage, { x: width - qrSize - qrLinkOffset, y: 100, width: qrSize, height: qrSize });

    const linkFontSize = 10;
    const linkText = certUrl.toString();
    const linkTextWidth = customFont.widthOfTextAtSize(linkText, linkFontSize);
    page.drawText(linkText, {
      x: width - qrSize - qrLinkOffset + (qrSize - linkTextWidth) / 2,
      y: 90,
      size: linkFontSize,
      font: customFont,
      color: rgb(0, 0, 0.6),
    });

    const pdfBytes = await pdfDoc.save();
    if (!pdfBytes || pdfBytes.length === 0) throw new Error('Generated PDF is empty');

    return new Response(pdfBytes as BufferSource, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
      },
    });
  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}