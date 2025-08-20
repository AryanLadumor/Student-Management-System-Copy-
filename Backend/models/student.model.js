import mongoose from "mongoose"

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollnumber: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // This now refers to the batch, e.g., "B1", "B2"
  classname: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  role: {
    type: String,
    default: "Student",
  },
  examResult: [
    {
      subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
      examType: {
          type: String,
          enum: ["T1", "T2", "T3", "T4"],
      },
      marks: {
        type: Number,
        default: 0,
      },
    },
  ],
  attendance: [
    {
      subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
      date: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ["Present", "Absent"],
        required: true,
      },
    },
  ],
});

const Student = mongoose.model("Student" , studentSchema)
export default Student