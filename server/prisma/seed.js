import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Admin account...");
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@alumnext.com" }
  });

  if (existingAdmin) {
    console.log("Admin account already exists.");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@alumnext.com",
      password: hashedPassword,
      role: "ADMIN",
      status: "APPROVED",
      bio: "System Administrator",
    }
  });

  console.log("Admin account created:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
