import 'dotenv/config';
console.log('DATABASE_URL:', process.env.DATABASE_URL);
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { db } from '../src/lib/db';
import { hash } from 'bcryptjs';

async function parseSqlFile(filePath: string) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const records = [];

  for await (const line of rl) {
    if (!line.trim()) continue;

    const dataMatches = line.matchAll(/\(([^)]+)\)/g);

    for (const match of dataMatches) {
      const valuesStr = match[1];

      const values = valuesStr.split(/,(?=(?:[^']*'[^']*')*[^']*$)/).map((v) => {
        const val = v.trim();
        if (val === 'NULL') return null;
        return val.startsWith("'") && val.endsWith("'")
          ? val.slice(1, -1)
          : val;
      });

      if (values.length !== 7) {
        console.warn(`Skipping malformed row: ${valuesStr}`);
        continue;
      }

      records.push({
        oldId: values[0] ? parseInt(values[0]) : null,
        fullName: values[1] || '',
        createdAt: new Date(values[2] || new Date()),
        code: values[3],
        courseName: values[4] || '',
        format: values[5],
        hours: values[6] ? parseFloat(values[6].replace(',', '.')) : null,
      });
    }
  }

  return records;
}

async function seedCertificates() {
  const sqlPath = path.join(__dirname, 'data.sql'); // prisma/data.sql
  const records = await parseSqlFile(sqlPath);

  console.log(`Importing ${records.length} certificates...`);

  const batchSize = 100;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    await db.$transaction(
      batch.map((r) =>
        db.certificate.create({
          data: {
            fullName: r.fullName,
            courseName: r.courseName,
            hours: r.hours,
            format: r.format ?? undefined,
            code: r.code ?? undefined,
            oldId: r.oldId ?? undefined,
            createdAt: r.createdAt,
            updatedAt: new Date(),
            background: 'default.jpg',
          },
        })
      )
    );
    console.log(`Package ${i / batchSize + 1} uploaded`);
  }

  console.log(`Imported ${records.length} certificates`);
}

async function createAdmin() {
  const login = 'colvir';
  const password = await hash('colvir123', 10);

  await db.user.upsert({
    where: { login },
    update: {},
    create: {
      login,
      password,
      role: 'ADMIN',
    },
  });

  console.log(`Admin "${login}" created`);
}

async function main() {
  await seedCertificates();
  await createAdmin();
}

main()
  .catch((e) => {
    console.error('Error in seed.ts:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });