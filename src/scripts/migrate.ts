import { db } from '../lib/db';
// import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import readline from 'readline';
import { CertificateData } from './types';

async function parseSqlFile(filePath: string) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const records = [];

  for await (const line of rl) {
    if (!line.trim()) continue;

    // Ищем строки с данными в формате (val1, val2, ...)
    const dataMatches = line.matchAll(/\(([^)]+)\)/g);
    
    for (const match of dataMatches) {
      const valuesStr = match[1];
      
      // Улучшенный парсинг значений с учетом кавычек и NULL
      const values = valuesStr.split(/,(?=(?:[^']*'[^']*')*[^']*$)/)
        .map(v => {
          const val = v.trim();
          if (val === 'NULL') return null;
          // Удаляем окружающие кавычки если они есть
          return val.startsWith("'") && val.endsWith("'") 
            ? val.slice(1, -1) 
            : val;
        });

      if (values.length !== 7) {
        console.warn(`Skipping malformed row: ${valuesStr}`);
        continue;
      }

      // Преобразование типов данных
      const record = {
        oldId: values[0] ? parseInt(values[0]) : null,
        fullName: values[1] || '',
        createdAt: new Date(values[2] || new Date()),
        code: values[3],
        courseName: values[4] || '',
        format: values[5],
        hours: values[6] ? parseFloat(values[6].replace(',', '.')) : null
      };

      records.push(record);
    }
  }

  return records;
}

async function main() {
  try {
    const sqlPath = '/app/src/scripts/data.sql';
    console.log(`Processing SQL file at: ${sqlPath}`);
    
    const records = await parseSqlFile(sqlPath);
    console.log(`Found ${records.length} valid records to import`);

    const batchSize = 100;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      
      await db.$transaction(
        batch.map(record => {
          const data: CertificateData = {
            fullName: record.fullName,
            courseName: record.courseName,
            hours: record.hours,
            format: record.format ?? undefined,
            code: record.code ?? undefined,
            oldId: record.oldId ?? undefined,
            createdAt: record.createdAt,
            updatedAt: new Date(),
            background: "default.jpg"
          };
          
          return db.certificate.create({ data });
        })
      );
      
      console.log(`Processed batch ${i / batchSize + 1}`);
    }

    console.log(`Successfully imported ${records.length} records`);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main().catch(e => {
  console.error('Unhandled error:', e);
  process.exit(1);
});