import mongoose from "mongoose"

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "Teacher",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    teaches: [
      {
        class: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Class",
          required: true,
        },
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Teacher = mongoose.model("Teacher" , teacherSchema)
export default Teacher

