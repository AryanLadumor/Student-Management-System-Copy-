import mongoose from 'mongoose'
const connectDB = async () => {
  try {
    console.log('MONGO_URI:', process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // stop app on failure
  }
};
export default connectDB;