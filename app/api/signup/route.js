import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

const DEFAULT_SIGNUPS = { count: 28700212, emails: [] }

// Use /tmp on serverless platforms (like Vercel) where the repo is read-only
const BASE_DATA_DIR = process.env.VERCEL ? '/tmp/palmist-data' : path.join(process.cwd(), 'data')
const DATA_FILE = path.join(BASE_DATA_DIR, 'signups.json')

function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

function getSignups() {
  ensureDataDir()
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading signups:', error)
  }
  return { ...DEFAULT_SIGNUPS }
}

function saveSignups(data) {
  try {
    ensureDataDir()
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    // On serverless, writes may fail; log and continue without blocking signup
    console.error('Error saving signups (non-blocking):', error)
  }
}

const smtpHost = process.env.SMTP_HOST
const smtpPort = Number(process.env.SMTP_PORT) || 587
const smtpUser = process.env.SMTP_USER
const smtpPass = process.env.SMTP_PASS
const smtpSecureEnv = process.env.SMTP_SECURE
const adminEmail = process.env.ADMIN_EMAIL || 'keshav.amanile@gmail.com'
const fromAddress = process.env.FROM_EMAIL || smtpUser || 'Palmist AI <no-reply@example.com>'

function getTransporter() {
  if (!smtpHost || !smtpUser || !smtpPass) {
    return null
  }

  const secure = smtpSecureEnv ? smtpSecureEnv === 'true' : smtpPort === 465

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  })
}

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()
    const signups = getSignups()

    if (signups.emails.includes(normalizedEmail)) {
      return NextResponse.json(
        { error: 'This email is already registered', count: signups.count },
        { status: 400 }
      )
    }

    signups.emails.push(normalizedEmail)
    signups.count += 1
    saveSignups(signups)

    let emailStatus = 'skipped'

    try {
      const transporter = getTransporter()

      if (!transporter) {
        console.warn('SMTP not configured. Skipping notification emails.')
      } else {
        await Promise.all([
          transporter.sendMail({
            from: fromAddress,
            to: normalizedEmail,
            subject: 'Welcome to AI Palm Reader',
            html: `
              <div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:0 auto;padding:32px 24px;line-height:1.6;background:#fdfdfb;color:#0c0c0c;">
                <p style="font-size:18px;font-weight:600;margin:0 0 12px;">Welcome aboard!</p>
                <p style="margin:0 0 12px;">Thanks for joining AI Palm Reader. You'll be first to get palm-reading insights as we roll them out.</p>
                <p style="margin:0 0 12px;">We'll email you when your reading is ready. Stay tuned.</p>
                <p style="margin:18px 0 0;font-size:14px;color:#6b7280;">AI Palm Reader Team</p>
              </div>
            `
          }),
          transporter.sendMail({
            from: fromAddress,
            to: adminEmail,
            subject: `New Submission: ${normalizedEmail}`,
            html: `
              <div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px 20px;line-height:1.5;background:#ffffff;color:#111827;border:1px solid #e5e7eb;border-radius:12px;">
                <p style="font-size:18px;font-weight:600;margin:0 0 12px;">You've just received a new submission.</p>
                <p style="margin:0 0 8px;"><strong>Email:</strong> ${normalizedEmail}</p>
                <p style="margin:0 0 8px;"><strong>Total signups:</strong> ${signups.count.toLocaleString()}</p>
                <p style="margin:0;color:#6b7280;font-size:13px;">${new Date().toISOString()}</p>
              </div>
            `
          })
        ])
        emailStatus = 'sent'
        console.log('Emails sent via SMTP')
      }
    } catch (emailError) {
      emailStatus = 'failed'
      console.error('Email sending failed:', emailError?.response?.data || emailError.message)
    }

    return NextResponse.json({
      success: true,
      message: emailStatus === 'sent'
        ? 'Successfully signed up! Check your inbox.'
        : 'Signup saved. Email notifications were skipped.',
      emailStatus,
      count: signups.count
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Failed to process signup. Please try again.' },
      { status: 500 }
    )
  }
}
