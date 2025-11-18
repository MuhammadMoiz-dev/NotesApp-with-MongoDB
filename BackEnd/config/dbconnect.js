import mongoose from "mongoose";

async function connnectDB() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB Connected ✔");
  } catch (error) {
    console.error("MongoDB Error ❌:", error.message);
  }
}

export default connnectDB;
