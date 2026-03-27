import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import bcrypt from "bcryptjs";

// GET /api/settings
export async function getSettings(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { settings: true, isActive: true, email: true }
    });
    if (!user) throw new AppError("User not found", 404);
    
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

// PUT /api/settings
export async function updateSettings(req, res, next) {
  try {
    const { settings, email, password } = req.body;
    let updateData = { settings };
    
    if (email) {
      updateData.email = email;
    }
    
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: { id: true, name: true, email: true, settings: true, isActive: true }
    });
    
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/settings/deactivate
export async function deactivateAccount(req, res, next) {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { isActive: false }
    });
    
    res.status(200).json({ success: true, message: "Account deactivated" });
  } catch (err) {
    next(err);
  }
}
