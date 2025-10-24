import mongoose from 'mongoose'
export default async function connectDB() {
  const uri = process.env.MONGO_URI
  if (!uri) throw new Error('MONGO_URI not set in .env')
  try {
    await mongoose.connect(uri)
    console.log('✅ MongoDB connected')
  } catch (err) {
    console.error('❌ MongoDB connection error', err)
    throw err
  }
}
