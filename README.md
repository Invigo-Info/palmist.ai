# 🖐️ AI Palm Reader - Next.js Clone

A beautiful, mystical landing page for an AI-powered palm reading service, inspired by palmist.ai.

![AI Palm Reader](https://framerusercontent.com/images/2AdjhgGSRqD2VZDKSrMJb5N9Q6E.jpg?scale-down-to=512)

## ✨ Features

- **Stunning Cosmic Design** - Dark mystical theme with animated stars, floating orbs, and golden accents
- **Email Signup System** - Collects user emails and sends beautiful welcome emails
- **Live Signup Counter** - Automatically increments and persists across sessions
- **Admin Notifications** - Receive email notifications when someone signs up
- **Responsive Design** - Looks great on all devices
- **Image Carousel** - Smooth infinite scrolling showcase of palm images

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Email (Important!)

Copy the environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your email credentials:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL="AI Palm Reader <your-email@gmail.com>"
ADMIN_EMAIL=your-inbox@gmail.com
```

**For Gmail users:**
1. Enable 2-Factor Authentication on your Google Account
2. Go to Security > 2-Step Verification > App passwords
3. Generate a new app password for "Mail"
4. Use that app password (not your regular password)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
palmist-clone/
├── app/
│   ├── api/
│   │   ├── signup/
│   │   │   └── route.js      # Email signup & notification API
│   │   └── count/
│   │       └── route.js      # Signup counter API
│   ├── globals.css           # Mystical styling
│   ├── layout.js             # Root layout with fonts
│   └── page.js               # Main landing page
├── data/
│   └── signups.json          # Persisted signup data (auto-created)
├── .env.example              # Environment template
├── .env.local                # Your credentials (create this)
├── next.config.js            # Next.js configuration
├── package.json
└── README.md
```

## 🎨 Customization

### Change Starting Count
Edit the default count in `app/api/signup/route.js` and `app/api/count/route.js`:

```javascript
return { count: 28700212, emails: [] } // Change this number
```

### Modify Email Templates
Customize the welcome email and admin notification in `app/api/signup/route.js`.

### Update Styling
All styles are in `app/globals.css`. Key variables:

```css
:root {
  --primary-purple: #1a0a2e;
  --accent-gold: #d4af37;
  --mystic-pink: #ff6b9d;
  /* ... */
}
```

## 🛠️ Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Important Notes

- The `data/signups.json` file stores signup data locally
- For production, consider using a database (MongoDB, PostgreSQL, etc.)
- Ensure environment variables are set in your hosting platform

## 📧 Email Providers

### Gmail (Default)
Use the SMTP values above with an App Password.

### Other Providers
Edit `app/api/signup/route.js` to use different SMTP settings:

```javascript
const emailConfig = {
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
}
```

## 🙏 Credits

- Design inspired by [palmist.ai](https://www.palmist.ai)
- Built with [Next.js](https://nextjs.org/)
- Email powered by [Nodemailer](https://nodemailer.com/)

## 📄 License

MIT License - Feel free to use for your own projects!
