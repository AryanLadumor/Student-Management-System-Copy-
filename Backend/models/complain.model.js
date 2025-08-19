// models/complain.model.js
import mongoose from "mongoose";

const complainSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Resolved", "Rejected"],
      default: "Pending",
    },
    response: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Complain =  mongoose.model("Complain", complainSchema);
export default Complain
