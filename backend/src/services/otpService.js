import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { prisma } from '../config/prisma.js';

// Setup Nodemailer transporter with SMTP or Ethereal/Local fallback
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && pass && pass !== 'app_password_placeholder') {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Fallback testing transporter (renders simulated university delivery)
  return {
    sendMail: async (mailOptions) => {
      console.log(`\n======================================================`);
      console.log(`📧 [BUP OFFICIAL EMAIL DISPATCH SIMULATOR]`);
      console.log(`To:      ${mailOptions.to}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log(`Body:    ${mailOptions.text || mailOptions.html}`);
      console.log(`======================================================\n`);
      return { messageId: `bup-sim-${Date.now()}` };
    },
  };
};

const transporter = createTransporter();

/**
 * Generate, store hashed OTP, and deliver to user's email
 */
export const issueOtp = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Invalidate any previous unused OTPs for this email
  await prisma.otpRecord.updateMany({
    where: { email: normalizedEmail, isUsed: false },
    data: { isUsed: true },
  });

  // Generate 6-digit secure numeric OTP
  const rawOtp = crypto.randomInt(100000, 999999).toString();
  const salt = await bcrypt.genSalt(10);
  const otpHash = await bcrypt.hash(rawOtp, salt);

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

  // Save to MySQL
  await prisma.otpRecord.create({
    data: {
      email: normalizedEmail,
      otpHash,
      expiresAt,
      isUsed: false,
    },
  });

  // Deliver Email
  const from = process.env.SMTP_FROM || 'BUP Social <no-reply@bup.edu.bd>';
  const subject = 'Your BUP Social Account Verification Code';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #15803d; margin: 0;">Bangladesh University of Professionals</h2>
        <p style="color: #64748b; font-size: 13px; margin: 4px 0;">BUP Social (BUPSoCo) Authentication Service</p>
      </div>
      <p style="font-size: 14px; color: #1e293b;">Dear BUPian,</p>
      <p style="font-size: 14px; color: #1e293b;">Your single-use verification code to authenticate your BUP Social profile is:</p>
      <div style="background: #f0fdf4; border: 2px dashed #16a34a; border-radius: 8px; text-align: center; padding: 14px; margin: 20px 0;">
        <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #15803d;">${rawOtp}</span>
      </div>
      <p style="font-size: 12px; color: #64748b;">This OTP is valid for <strong>5 minutes</strong>. If you did not request this verification, please ignore this email or report to the department security officer.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center;">BUP Social Platform • Mirpur Cantonment, Dhaka-1216</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from,
      to: normalizedEmail,
      subject,
      html,
      text: `Your BUP Social verification code is ${rawOtp}. Valid for 5 minutes.`,
    });
  } catch (err) {
    console.error('SMTP Delivery Warning:', err.message);
  }

  return {
    rawOtp, // Provided for instant demo evaluation
    expiresAt,
  };
};

/**
 * Verify submitted OTP against hashed record in MySQL
 */
export const verifySubmittedOtp = async (email, candidateOtp) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Find latest active OTP record for this email
  const record = await prisma.otpRecord.findFirst({
    where: {
      email: normalizedEmail,
      isUsed: false,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!record) {
    throw new Error('No active OTP found. Please request a new verification code.');
  }

  if (new Date() > record.expiresAt) {
    await prisma.otpRecord.update({
      where: { id: record.id },
      data: { isUsed: true },
    });
    throw new Error('This verification code has expired (5 minute limit). Please request a new code.');
  }

  if (record.attempts >= 5) {
    await prisma.otpRecord.update({
      where: { id: record.id },
      data: { isUsed: true },
    });
    throw new Error('Maximum verification attempts exceeded. Please request a new code.');
  }

  // Increment attempts
  await prisma.otpRecord.update({
    where: { id: record.id },
    data: { attempts: record.attempts + 1 },
  });

  const isMatch = await bcrypt.compare(candidateOtp.trim(), record.otpHash);
  if (!isMatch) {
    throw new Error('Invalid verification code. Please check and try again.');
  }

  // Mark as used
  await prisma.otpRecord.update({
    where: { id: record.id },
    data: { isUsed: true },
  });

  return true;
};
