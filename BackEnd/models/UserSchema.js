import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true, lowercase: true },
    Password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
