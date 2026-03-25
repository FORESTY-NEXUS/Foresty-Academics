import nodemailer from "nodemailer";

let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === "true"
    : port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error("SMTP_USER and SMTP_PASS are required to send email");
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  return cachedTransporter;
}

export async function sendOtpEmail({ to, otp }) {
  const transporter = getTransporter();
  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;
  const fromName = process.env.SMTP_FROM_NAME || "Foresty Nexus";

  const subject = "Your Forestry Nexus OTP Code";
  const text = `Your OTP code is ${otp}. It expires in 10 minutes.`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #0f172a;">
      <h2 style="margin: 0 0 8px; color: #065f46;">Foresty Nexus</h2>
      <p style="margin: 0 0 12px;">Your OTP code is:</p>
      <div style="display: inline-block; font-size: 24px; letter-spacing: 6px; font-weight: 700; padding: 10px 14px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px;">
        ${otp}
      </div>
      <p style="margin: 12px 0 0; font-size: 12px; color: #475569;">
        This code expires in 10 minutes. If you didn't request this, you can ignore this email.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `${fromName} <${fromEmail}>`,
    to,
    subject,
    text,
    html,
  });
}
