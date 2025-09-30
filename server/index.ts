import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import geoip from 'geoip-lite';

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 6001;
const ZOHO_USER = process.env.ZOHO_USER;
const ZOHO_PASS = process.env.ZOHO_PASS;
const CONTACT_TO = process.env.CONTACT_TO || ZOHO_USER;

if (!ZOHO_USER || !ZOHO_PASS) {
  // eslint-disable-next-line no-console
  console.warn('[contact-backend] Missing ZOHO_USER or ZOHO_PASS in environment. Email sending will fail until set.');
}

const app = express();
// Trust first proxy (e.g., when behind nginx/pm2 or hosting platforms) so rate limiting & IP logging work correctly
// If you have multiple proxies/CDN layers, adjust to a number or use a function.
app.set('trust proxy', 1);
app.use(express.json({ limit: '25kb' }));
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));

// Simple in-memory visit store (resets on restart). For persistence, swap to a DB.
type VisitRecord = {
  ip: string;
  country?: string | null;
  city?: string | null;
  region?: string | null;
  timezone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  firstSeen: number;
  lastSeen: number;
  hits: number;
  userAgent?: string;
};

const visits: Map<string, VisitRecord> = new Map();

app.use((req, _res, next) => {
  if (req.path.startsWith('/api/admin')) return next(); // avoid counting admin page/API calls
  const ip = req.ip || 'unknown';
  const now = Date.now();
  let rec = visits.get(ip);
  if (!rec) {
    const lookup = geoip.lookup(ip);
    rec = {
      ip,
      country: lookup?.country || null,
      city: (lookup as any)?.city || null,
      region: (lookup as any)?.region || null,
      timezone: (lookup as any)?.timezone || null,
      latitude: lookup?.ll ? lookup.ll[0] : null,
      longitude: lookup?.ll ? lookup.ll[1] : null,
      firstSeen: now,
      lastSeen: now,
      hits: 1,
      userAgent: req.get('user-agent') || undefined
    };
    visits.set(ip, rec);
  } else {
    rec.hits += 1;
    rec.lastSeen = now;
  }
  next();
});

const contactLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  // Defensive key generator: falls back if IP parsing fails
  keyGenerator: (req) => {
    const xff = (req.headers['x-forwarded-for'] as string | undefined) || '';
    let ipCandidate = req.ip || xff.split(',')[0].trim() || req.socket.remoteAddress || '';
    if (Array.isArray(ipCandidate)) ipCandidate = ipCandidate[0] || '';
    return typeof ipCandidate === 'string' ? ipCandidate : 'unknown';
  },
  handler: (req, res, _next, options) => {
    return res.status(options.statusCode || 429).json({
      error: 'Too many requests',
      message: 'You have reached the contact rate limit. Please wait a minute and try again.'
    });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'contact-backend', time: new Date().toISOString() });
});

app.get('/api/admin/visits', (_req, res) => {
  const data = Array.from(visits.values()).sort((a,b) => b.lastSeen - a.lastSeen);
  res.json({ totalUnique: data.length, totalHits: data.reduce((sum,v)=> sum+v.hits, 0), data });
});

app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, message } = req.body || {};
  
  // Detailed validation with specific error messages
  const errors: string[] = [];
  
  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('Name is required');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  } else if (name.trim().length > 50) {
    errors.push('Name must be less than 50 characters');
  }
  
  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push('Please provide a valid email address');
  } else if (email.trim().length > 180) {
    errors.push('Email address is too long');
  }
  
  if (!message || typeof message !== 'string' || !message.trim()) {
    errors.push('Message is required');
  } else if (message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  } else if (message.trim().length > 1000) {
    errors.push('Message must be less than 1000 characters');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors,
      message: errors.join('. ')
    });
  }

  if (!ZOHO_USER || !ZOHO_PASS) {
    return res.status(500).json({ 
      error: 'Email service not configured',
      message: 'The contact form is temporarily unavailable. Please try again later.'
    });
  }
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: { user: ZOHO_USER, pass: ZOHO_PASS },
  });
  
  try {
    // Enhanced email content
    const emailContent = `
New Contact Form Submission
=========================

Name: ${name.trim()}
Email: ${email.trim()}
Date: ${new Date().toLocaleString()}

Message:
${message.trim()}

--
Sent from your portfolio contact form
`;

    await transporter.sendMail({
      from: ZOHO_USER,
      to: CONTACT_TO,
      subject: `Portfolio Contact: ${name.trim()}`,
      replyTo: email.trim(),
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #6C63FF; padding-bottom: 10px;">New Contact Form Submission</h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name.trim()}</p>
            <p><strong>Email:</strong> <a href="mailto:${email.trim()}">${email.trim()}</a></p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Message:</h3>
            <div style="background: white; padding: 15px; border-left: 4px solid #6C63FF; margin: 10px 0;">
              ${message.trim().replace(/\n/g, '<br>')}
            </div>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            Sent from your portfolio contact form
          </p>
        </div>
      `
    });
    
    return res.json({ 
      success: true, 
      message: 'Message sent successfully'
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[contact-backend] sendMail failed', err);
    return res.status(500).json({ 
      error: 'Failed to send email',
      message: 'There was a problem sending your message. Please try again later or contact me directly.'
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`Contact backend listening on http://0.0.0.0:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`Access from network: http://<your-ip>:${PORT}`);
});
