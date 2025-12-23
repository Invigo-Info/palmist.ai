import fs from 'fs'
import path from 'path'

export const DEFAULT_SIGNUPS = { count: 28700212, emails: [] }

const KV_KEY = 'signups'
const kvUrl = process.env.KV_REST_API_URL
const kvToken = process.env.KV_REST_API_TOKEN

const BASE_DATA_DIR = process.env.VERCEL ? '/tmp/palmist-data' : path.join(process.cwd(), 'data')
const DATA_FILE = path.join(BASE_DATA_DIR, 'signups.json')

function normalizeSignups(data = {}) {
  const emails = Array.isArray(data.emails) ? data.emails.filter(Boolean) : []

  const rawCount = Number(data.count)
  const hasValidCount = Number.isFinite(rawCount)
  const baseline = DEFAULT_SIGNUPS.count + emails.length

  return {
    count: hasValidCount ? Math.max(rawCount, baseline) : baseline,
    emails
  }
}

function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

function readFromFile() {
  ensureDataDir()
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8')
      return normalizeSignups(JSON.parse(data))
    }
  } catch (error) {
    console.error('Error reading signups locally:', error)
  }
  return normalizeSignups(DEFAULT_SIGNUPS)
}

function writeToFile(data) {
  try {
    ensureDataDir()
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error saving signups locally:', error)
  }
}

async function readFromKV() {
  if (!kvUrl || !kvToken) return null

  try {
    const response = await fetch(`${kvUrl}/get/${KV_KEY}`, {
      headers: {
        Authorization: `Bearer ${kvToken}`
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`KV read failed with status ${response.status}`)
    }

    const payload = await response.json()
    if (!payload?.result) return null

    return normalizeSignups(JSON.parse(payload.result))
  } catch (error) {
    console.error('KV read failed:', error)
    return null
  }
}

async function writeToKV(data) {
  if (!kvUrl || !kvToken) return false

  try {
    const encoded = encodeURIComponent(JSON.stringify(data))
    const response = await fetch(`${kvUrl}/set/${KV_KEY}/${encoded}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kvToken}`
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`KV write failed with status ${response.status}`)
    }

    return true
  } catch (error) {
    console.error('KV write failed:', error)
    return false
  }
}

export async function getSignups() {
  const kvData = await readFromKV()
  if (kvData) {
    writeToFile(kvData)
    return kvData
  }

  return readFromFile()
}

export async function saveSignups(signups) {
  const normalized = normalizeSignups(signups)

  const savedToKV = await writeToKV(normalized)
  if (!savedToKV) {
    writeToFile(normalized)
  } else {
    writeToFile(normalized)
  }

  return normalized
}
