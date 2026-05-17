import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, text, html }) {
  try {
    console.log("[BREVO TRANSPORT ACTIVE]");

    const info = await transporter.sendMail({
      from:
        process.env.SMTP_FROM ||
        '"AlumNext T&P Cell" <tnpcell.alumnext@gmail.com>',
      to,
      subject,
      text,
      html: html || `<p>${text || ""}</p>`,
    });

    console.log(`[EMAIL SUCCESS] ${info.messageId}`);

    return info;
  } catch (err) {
    console.error("[EMAIL ERROR]", err);
    throw err;
  }
}
