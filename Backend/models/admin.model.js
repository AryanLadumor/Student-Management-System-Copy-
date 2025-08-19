import mongoose from "mongoose"

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  hashedpassword: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "Admin",
  },
  institutename: {
    type: String,
    unique: true,
    required: true,
  },
});

const Admin = mongoose.model("Admin" , adminSchema)
export default Admin