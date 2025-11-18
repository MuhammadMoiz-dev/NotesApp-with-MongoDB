import mongoose from "mongoose";

const NotesSchema = new mongoose.Schema(
    {
        Note: { 
            type: String, 
            required: true,
            trim: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("Notes", NotesSchema);