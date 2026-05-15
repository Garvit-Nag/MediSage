import { redis } from '@/lib/redis'
import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await redis.set('__ping__', Date.now(), { ex: 60 * 60 * 24 * 7 })

    const client = await clientPromise
    await client.db().command({ ping: 1 })

    return NextResponse.json({ ok: true, ts: new Date().toISOString() })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
