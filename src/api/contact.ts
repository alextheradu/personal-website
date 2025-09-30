import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // Configure Zoho SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: 'cooldudev.super@gmail.com', // Your Zoho email
      pass: process.env.ZOHO_MAIL_PASS // Set this in your env
    }
  });

  try {
    await transporter.sendMail({
      from: 'cooldudev.super@gmail.com',
      to: 'cooldudev.super@gmail.com',
      subject: `Portfolio Contact: ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
