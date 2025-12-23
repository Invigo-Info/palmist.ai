import { NextResponse } from 'next/server'
import { getSignups, DEFAULT_SIGNUPS } from '../signupsStore'

export async function GET() {
  try {
    const signups = await getSignups()
    
    return NextResponse.json({
      count: signups.count,
      totalEmails: signups.emails.length
    })
  } catch (error) {
    console.error('Count error:', error)
    return NextResponse.json(
      { error: 'Failed to get count', count: DEFAULT_SIGNUPS.count },
      { status: 500 }
    )
  }
}
