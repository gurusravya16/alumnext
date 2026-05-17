import nodemailer from "nodemailer";

/**
 * Send an email via nodemailer (Brevo SMTP relay or via Env).
 * Uses standard connection parameters sequentially only when invoked—no startup blocking.
 */
export async function sendEmail({ to, subject, text, html }) {
  try {
    let transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Production: Generically bind to Brevo or available SMTP instance via ENV
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465, 
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 15000, 
      });
    } else {
      // Development: Ethereal test account
      console.warn("[Email] ⚠️ WARNING: SMTP credentials missing. Falling back to Ethereal mock.");
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const smtpFrom = process.env.SMTP_FROM || '"AlumNext" <tnpcell.alumnext@gmail.com>';
    
    console.log("[BREVO TRANSPORT ACTIVE] Attempting deployment mail route...");
    
    const info = await transporter.sendMail({
      from: smtpFrom,
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`,
    });

    console.log(`[Email Delivery] ✅ Successfully Sent to ${to} — MessageId: ${info.messageId}`);
    
    // Log preview URL if test env
    if (!process.env.SMTP_HOST) {
        console.log(`[Email] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return info;

  } catch (err) {
    console.error(`[Email Delivery] ❌ ERROR: Delivery to ${to} failed.`);
    console.error(`   Code Context: ${err.code} | ${err.message}`);
    throw err; // Allowing caller architectures to decide if they need to catch this or not
  }
}

