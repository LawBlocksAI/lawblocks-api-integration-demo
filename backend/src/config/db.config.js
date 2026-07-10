import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const MONGO_URI =
      process.env.MONGO_URI || "mongodb://localhost:27017/doc_sign_test";
    
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB: ${conn.connection.name}`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
