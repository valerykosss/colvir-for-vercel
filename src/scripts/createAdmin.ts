//docker compose exec app npx ts-node --compiler-options '{"module":"commonjs"}' /app/src/scripts/createAdmin.ts

import { db } from "./../lib/db";
import { hash } from "bcryptjs";

async function main() {
  const login = "colvir";
  const password = await hash("colvir123", 10);

  await db.user.upsert({
    where: { login },
    update: {},
    create: {
      login,
      password,
      role: "ADMIN",
    },
  });

  console.log("Admin user created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });