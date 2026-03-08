const express = require('express');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static('frontend'));

// Rate limiting - prevent brute-force attacks
const limiter = rateLimit({ windowMs: 60 * 1000, max: 30 });
app.use(limiter);

// In-memory store for CAPTCHAs
const store = new Map();

// Create new CAPTCHA challenge
app.post('/api/captcha/new', (req, res) => {
  const sessionId = req.cookies.sessionId || crypto.randomBytes(16).toString('hex');
  res.cookie('sessionId', sessionId, { httpOnly: true, sameSite: 'Strict' });

  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);
  const answer = num1 + num2;
  const token = crypto.randomBytes(24).toString('hex');
  const host = req.get('host');

  store.set(token, { answer: answer.toString(), host, expires: Date.now() + 5 * 60 * 1000 });
  res.json({ token, equation: `${num1} + ${num2} = ?` });
});

// Validate CAPTCHA
app.post('/api/login', (req, res) => {
  const { captchaToken, captchaResponse } = req.body;
  const origin = req.get('origin') || req.get('referer') || '';
  const expectedHost = req.get('host');

  const record = store.get(captchaToken);
  if (!record) return res.status(400).json({ ok: false, error: 'Invalid token' });
  if (record.expires < Date.now()) return res.status(400).json({ ok: false, error: 'Token expired' });

  if (!origin.includes(record.host)) {
    return res.status(403).json({ ok: false, error: 'Origin mismatch — possible phishing' });
  }

  if (captchaResponse !== record.answer) {
    return res.status(400).json({ ok: false, error: 'Captcha failed' });
  }

  store.delete(captchaToken);
  res.json({ ok: true, msg: 'Login accepted (demo)' });
});

app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));
