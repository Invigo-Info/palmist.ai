import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Path to store signup data
const DATA_FILE = path.join(process.cwd(), 'data', 'signups.json')

// Read signups from file
function getSignups() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading signups:', error)
  }
  // Default starting count (similar to original site)
  return { count: 28700212, emails: [] }
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
