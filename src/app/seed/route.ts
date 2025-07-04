import { NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function GET() {
  return new Promise((resolve) => {
    exec('npx ts-node prisma/seed.ts', (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        resolve(NextResponse.json({ error: 'Ошибка выполнения seed' }, { status: 500 }));
      } else {
        console.log(stdout);
        resolve(NextResponse.json({ success: true }));
      }
    });
  });
}