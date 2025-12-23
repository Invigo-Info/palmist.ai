import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DEFAULT_SIGNUPS = { count: 28700212, emails: [] }

function normalizeSignups(data = {}) {
  const emails = Array.isArray(data.emails)
    ? data.emails.filter(Boolean)
    : []

  const rawCount = Number(data.count)
  const hasValidCount = Number.isFinite(rawCount)
  const baseline = DEFAULT_SIGNUPS.count + emails.length

  return {
    count: hasValidCount ? Math.max(rawCount, baseline) : baseline,
    emails
  }
}

// Use /tmp on serverless platforms (like Vercel) where the repo is read-only
const BASE_DATA_DIR = process.env.VERCEL ? '/tmp/palmist-data' : path.join(process.cwd(), 'data')
const DATA_FILE = path.join(BASE_DATA_DIR, 'signups.json')

function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Read signups from file
function getSignups() {
  ensureDataDir()
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8')
      return normalizeSignups(JSON.parse(data))
    }
  } catch (error) {
    console.error('Error reading signups:', error)
  }
  // Default starting count (similar to original site)
  return normalizeSignups(DEFAULT_SIGNUPS)
}

export async function GET() {
  try {
    const signups = getSignups()
    
    return NextResponse.json({
      count: signups.count,
      totalEmails: signups.emails.length
    })
  } catch (error) {
    console.error('Count error:', error)
    return NextResponse.json(
      { error: 'Failed to get count', count: 28700212 },
      { status: 500 }
    )
  }
}
