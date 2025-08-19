import mongoose from "mongoose"

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: new Date()
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    },
  },
  { timestamps: true }
);

const Notice = mongoose.model("Notice" , noticeSchema)
export default Notice