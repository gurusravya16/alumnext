import fetch from "node-fetch";

export async function sendEmail({ to, subject, text, html }) {
  try {
    console.log("[BREVO API ACTIVE]");

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "AlumNext T&P Cell",
          email: "tnpcell.alumnext@gmail.com",
        },
        to: [{ email: to }],
        subject,
        htmlContent: html || `<p>${text || ""}</p>`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[BREVO API ERROR]", data);

      return {
        success: false,
        error: data,
      };
    }

    console.log("[EMAIL SUCCESS]", data);

    return data;
  } catch (err) {
    console.error("[EMAIL ERROR]", err.message);

    return {
      success: false,
      error: err.message,
    };
  }
}
