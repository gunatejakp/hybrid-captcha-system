# Hybrid CAPTCHA System with Anti-Phishing Protection

A secure authentication system that combines multiple CAPTCHA techniques to prevent automated attacks and phishing.

## Features

✔ Text-based CAPTCHA  
✔ Image / Math CAPTCHA  
✔ Audio CAPTCHA  
✔ Anti-phishing domain verification  
✔ Rate limiting against bot attacks  
✔ Secure CAPTCHA tokens

## Architecture

User → Login Page → CAPTCHA Verification → Server Validation → Authentication

## Technologies Used

HTML  
CSS  
JavaScript  
Node.js  
Express.js  

## Security Features

• Domain watermarking  
• Origin validation  
• Token expiry  
• Rate limiting  
• Session protection

## How to Run

1. Install Node.js

2. Install dependencies

npm install express express-rate-limit cookie-parser

3. Start server

node server.js

4. Open browser

http://localhost:3000
