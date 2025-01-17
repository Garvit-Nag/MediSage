import { Redis } from '@upstash/redis'

if (!process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error('UPSTASH_REDIS_REST_URL is not defined')
}

if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('UPSTASH_REDIS_REST_TOKEN is not defined')
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// Helper function to get analysis count key for a user
export const getUserAnalysisKey = (userId: string) => {
  const date = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  return `analysis:${userId}:${date}`
}

// Check if user has reached their daily limit
export async function checkAnalysisLimit(userId: string): Promise<{
  allowed: boolean
  remaining: number
  total: number
}> {
  const key = getUserAnalysisKey(userId)
  const count = await redis.get<number>(key) || 0
  const limit = 5 // Basic plan limit

  return {
    allowed: count < limit,
    remaining: Math.max(0, limit - count),
    total: count
  }
}

// Increment user's analysis count
export async function incrementAnalysisCount(userId: string): Promise<void> {
  const key = getUserAnalysisKey(userId)
  await redis.incr(key)
  // Set expiry for end of day UTC
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setUTCHours(0, 0, 0, 0)
  const ttlInSeconds = Math.floor((tomorrow.getTime() - Date.now()) / 1000)
  await redis.expire(key, ttlInSeconds)
}