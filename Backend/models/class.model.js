import mongoose from "mongoose"

const classSchema = new mongoose.Schema({
    classname: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
}, { timestamps: true });

const Class = mongoose.model("Class", classSchema);
export default Class




