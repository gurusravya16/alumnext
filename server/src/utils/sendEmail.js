import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  family: 4,
  connectionTimeout: 60000,
  greetingTimeout: 60000,
  socketTimeout: 60000,

});

export async function sendEmail({ to, subject, text, html }) {
  try {
    console.log("[SMTP MAILER ACTIVE]");

    const info = await transporter.sendMail({
      from:
        process.env.SMTP_FROM ||
        '"AlumNext T&P Cell" <tnpcell.alumnext@gmail.com>',
      to,
      subject,
      text,
      html: html || `<p>${text || ""}</p>`,
    });

    console.log("[EMAIL SUCCESS]", info.messageId);

    return info;
  } catch (err) {
    console.error("[EMAIL ERROR]", err);

    return {
      success: false,
      error: err.message,
    };
  }
}
