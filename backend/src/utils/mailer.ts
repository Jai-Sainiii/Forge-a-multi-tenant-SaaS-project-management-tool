import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || "noreply@forge-tenant-saas.vercel.app";

export const sendOtpEmail = async (email: string, otp: string, purpose: 'signup' | 'reset') => {
  const subject = purpose === 'signup' 
    ? "Verify your Forge account" 
    : "Reset your Forge password";
    
  const bodyText = purpose === 'signup'
    ? `Welcome to Forge! Your email verification code is: ${otp}. This code is valid for 10 minutes.`
    : `You requested a password reset. Your OTP code is: ${otp}. This code is valid for 10 minutes.`;

  const htmlContent = `
    <div style="font-family: 'Inter', sans-serif; max-width: 440px; margin: 0 auto; padding: 32px; border: 1px solid #e4dfff; border-radius: 8px; background-color: #fcf8fb;">
      <h2 style="font-size: 24px; font-weight: 500; color: #251b72; margin-top: 0;">Forge</h2>
      <p style="font-size: 14px; color: #474551; line-height: 1.6;">
        ${purpose === 'signup' ? 'Confirm your email address to active your Forge account.' : 'Use the code below to reset your password.'}
      </p>
      <div style="background-color: #ffffff; border: 1px solid #c8c4d3; border-radius: 4px; padding: 16px; text-align: center; margin: 24px 0;">
        <span style="font-size: 32px; font-weight: 600; letter-spacing: 4px; color: #251b72;">${otp}</span>
      </div>
      <p style="font-size: 12px; color: #787582; line-height: 1.5; margin-bottom: 0;">
        This code is valid for 10 minutes. If you did not make this request, you can safely ignore this email.
      </p>
    </div>
  `;

  // Always log to console for development ease
  console.log(`\n==================================================`);
  console.log(`[MAILER] Sending OTP to: ${email}`);
  console.log(`[MAILER] OTP Code: ${otp}`);
  console.log(`[MAILER] Purpose: ${purpose}`);
  console.log(`==================================================\n`);

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log(`[MAILER] SMTP credentials not fully configured. Falling back to console logging.`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: SMTP_FROM,
      to: email,
      subject: subject,
      text: bodyText,
      html: htmlContent,
    });
    console.log(`[MAILER] Email successfully sent to ${email}`);
  } catch (error) {
    console.error(`[MAILER] Failed to send email via SMTP:`, error);
  }
};
