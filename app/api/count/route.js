import { NextResponse } from 'next/server'
import { getSignups, getDefaultCount } from '../signupsStore'

// Disable caching for this route - always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const signups = await getSignups()

    const response = NextResponse.json({
      count: signups.count,
      totalEmails: signups.emails.length
    })

    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response
  } catch (error) {
    console.error('Count error:', error)
    return NextResponse.json(
      { error: 'Failed to get count', count: getDefaultCount() },
      { status: 500 }
    )
  }
}
