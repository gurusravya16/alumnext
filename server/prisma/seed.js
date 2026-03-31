import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log(
      "⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set — skipping admin seed."
    );
    return;
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
