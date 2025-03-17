// src/app/api/check-analysis-limit/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { getSubscription } from '@/lib/db';

// Helper function to get user's analysis key for the day
const getUserAnalysisKey = (userId: string) => {
  const date = new Date().toISOString().split('T')[0];
  return `analysis:${userId}:${date}`;
};

// Check current limit
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check subscription first
    const subscription = await getSubscription(userId);
    const planName = subscription?.planName?.toLowerCase() || 'basic';

    // If user has premium plan, always allow
    if (planName.includes('professional') || planName.includes('clinical')) {
      return NextResponse.json({
        allowed: true,
        remaining: -1,
        total: -1,
        planName
      });
    }

    // For basic plan, check rate limit
    const key = getUserAnalysisKey(userId);
    const count = await redis.get<number>(key) || 0;
    const limit = 5;

    await redis.set('keepalive', new Date().toISOString());

    return NextResponse.json({
      allowed: count < limit,
      remaining: Math.max(0, limit - count),
      total: count,
      planName
    });

  } catch (error) {
    console.error('Error checking analysis limit:', error);
    return NextResponse.json(
      { error: 'Failed to check analysis limit' },
      { status: 500 }
    );
  }
}

// Increment and check limit
export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check subscription
    const subscription = await getSubscription(userId);
    const planName = subscription?.planName?.toLowerCase() || 'basic';

    // If premium plan, don't increment counter
    if (planName.includes('professional') || planName.includes('clinical')) {
      return NextResponse.json({
        allowed: true,
        remaining: -1,
        total: -1,
        planName
      });
    }

    // For basic plan, increment and check
    const key = getUserAnalysisKey(userId);
    const count = await redis.get<number>(key) || 0;
    const limit = 5;

    if (count >= limit) {
      return NextResponse.json({
        allowed: false,
        remaining: 0,
        total: count,
        planName,
        error: 'Daily analysis limit reached'
      }, { status: 429 });
    }

    // Increment counter
    await redis.incr(key);
    
    // Set expiry for end of day UTC
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    const ttlInSeconds = Math.floor((tomorrow.getTime() - Date.now()) / 1000);
    await redis.expire(key, ttlInSeconds);

    // Return updated counts
    return NextResponse.json({
      allowed: true,
      remaining: Math.max(0, limit - (count + 1)),
      total: count + 1,
      planName
    });

  } catch (error) {
    console.error('Error incrementing analysis count:', error);
    return NextResponse.json(
      { error: 'Failed to increment analysis count' },
      { status: 500 }
    );
  }
}