import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'signups.json')

function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
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
  return { count: 28700212, emails: [] }
}

function saveSignups(data) {
  ensureDataDir()
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

const smtpHost = process.env.SMTP_HOST
const smtpPort = Number(process.env.SMTP_PORT) || 587
const smtpUser = process.env.SMTP_USER
const smtpPass = process.env.SMTP_PASS
const smtpSecureEnv = process.env.SMTP_SECURE
const adminEmail = process.env.ADMIN_EMAIL || 'john.mayer0206@gmail.com'
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

    const signups = getSignups()

    if (signups.emails.includes(email.toLowerCase())) {
      return NextResponse.json(
        { error: 'This email is already registered', count: signups.count },
        { status: 400 }
      )
    }

    signups.emails.push(email.toLowerCase())
    signups.count += 1
    saveSignups(signups)

    try {
      const transporter = getTransporter()

      if (!transporter) {
        return NextResponse.json(
          { error: 'Email service not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS on the server.' },
          { status: 500 }
        )
      }

      await Promise.all([
        transporter.sendMail({
          from: fromAddress,
          to: email,
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
          subject: `New Submission: ${email}`,
          html: `
            <div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px 20px;line-height:1.5;background:#ffffff;color:#111827;border:1px solid #e5e7eb;border-radius:12px;">
              <p style="font-size:18px;font-weight:600;margin:0 0 12px;">You’ve just received a new submission.</p>
              <p style="margin:0 0 8px;"><strong>Email:</strong> ${email}</p>
              <p style="margin:0 0 8px;"><strong>Total signups:</strong> ${signups.count.toLocaleString()}</p>
              <p style="margin:0;color:#6b7280;font-size:13px;">${new Date().toISOString()}</p>
            </div>
          `
        })
      ])
      console.log('Emails sent via SMTP')
    } catch (emailError) {
      console.error('Email sending failed:', emailError?.response?.data || emailError.message)
      return NextResponse.json(
        { error: 'Failed to send email', detail: emailError?.response?.data || emailError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully signed up!',
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
