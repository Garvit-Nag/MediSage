/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import clientPromise from './mongodb';


interface Subscription {
  userId: string;
  planName: string;
  status: string;
  subscriptionId?: string;
  customerId?: string;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function getSubscription(userId: string) {
  const client = await clientPromise;
  const db = client.db('medisage');
  return db.collection('subscriptions').findOne({ userId });
}

export async function createInitialSubscription(userId: string) {
  const client = await clientPromise;
  const db = client.db('medisage');
  
  // Check if subscription already exists
  const existingSub = await getSubscription(userId);
  if (existingSub) {
    return existingSub;
  }

  // Create new basic subscription
  const subscription: Subscription = {
    userId,
    planName: 'basic',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await db.collection('subscriptions').insertOne(subscription);
  return subscription;
}

export async function deleteSubscription(userId: string) {
    const client = await clientPromise;
    const db = client.db('medisage');
    
    // First get the existing subscription
    const oldSubscription = await getSubscription(userId);
    
    // Store it in history if it exists
    if (oldSubscription) {
      await db.collection('subscription_history').insertOne({
        ...oldSubscription,
        endedAt: new Date(),
        deletedAt: new Date()
      });
    }
    
    // Delete the current subscription
    return db.collection('subscriptions').deleteOne({ userId });
  }

export async function updateSubscription(userId: string, subscriptionData: any) {
  console.log("Updating subscription for user:", userId); // Add this
  console.log("Subscription data:", subscriptionData);
  const client = await clientPromise;
  const db = client.db('medisage');

  try {
    await db.command({ ping: 1 });
    console.log("MongoDB connected successfully"); // Add this
  } catch (error) {
    console.error("MongoDB connection error:", error); // Add this
  }
  
  // Store the old subscription in history
  const oldSubscription = await getSubscription(userId);
  console.log("Existing subscription:", oldSubscription);
  if (oldSubscription) {
    // Only archive if the subscription is actually changing
    if (oldSubscription.subscriptionId !== subscriptionData.subscriptionId) {
      // Remove _id to avoid duplicate key errors
      const { _id: _removedId, ...subscriptionWithoutId } = oldSubscription;
      await db.collection('subscription_history').insertOne({
        ...subscriptionWithoutId,
        endedAt: new Date()
      });
    }
  }

  // Update current subscription
  const result = await db.collection('subscriptions').updateOne(
    { userId },
    { 
      $set: { 
        ...subscriptionData,
        updatedAt: new Date() 
      } 
    },
    { upsert: true }
  );
  
  console.log("Update result:", result);
  return result;
} 

export async function testMongoConnection() {
    try {
      const client = await clientPromise;
      await client.db('medisage').command({ ping: 1 });
      console.log("MongoDB connection test successful");
      return true;
    } catch (error) {
      console.error("MongoDB connection test failed:", error);
      return false;
    }
  }
