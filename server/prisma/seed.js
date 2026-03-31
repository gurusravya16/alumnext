import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error(
      "❌ ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required.\n" +
      "   Set them in your .env file or pass them inline:\n" +
      '   ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="secure123" npm run seed'
    );
    process.exit(1);
  }

  console.log(`Seeding Super Admin: ${adminEmail}...`);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("✅ Admin account already exists. Skipping.");
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
      status: "APPROVED",
      bio: "System Administrator",
    },
  });

  console.log(`✅ Super Admin created: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
