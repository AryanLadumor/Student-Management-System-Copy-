import Admin from "../models/admin.model.js";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const adminRegister = async (req, res) => {
  try {
    const { name, email, password, institutename } = req.body;

    // Check for missing required fields
    if (!name || !email || !password || !institutename) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Please fill all required fields." });
    }

    // Check if admin already exists by email or institution
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { institutename }],
    });

    // Condition when admin is already in database
    if (existingAdmin) {
      if (existingAdmin.email === email) {
        return res
          .status(httpStatus.CONFLICT)
          .json({ msg: "Email already exists." });
      } else if (existingAdmin.institutename === institutename) {
        return res
          .status(httpStatus.CONFLICT)
          .json({ msg: "Institution name already exists." });
      }
    }

    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = new Admin({
      name,
      email,
      hashedpassword: hashedPassword,
      institutename,
    });
    //Saving the admi to database
    const result = await admin.save();

    const token = jwt.sign(
      { id: admin._id, role: "admin",name:admin.name,email:admin.email,institutename:admin.institutename },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    //sending response for successfully registeredAdmin
    return res.status(httpStatus.CREATED).json({
      msg: "Admin registered successfully.",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        institutionName: admin.institutename,
      },
      token,
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server error. Please try again later." });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "Please provide both email and password." });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(404)
        .json({ msg: "Admin not found. Please register first." });
    }

    // Comparing password
    const isMatch = await bcrypt.compare(password, admin.hashedpassword);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials." });
    }

   const token = jwt.sign(
            { id: admin._id, role: 'admin',name:admin.name,email:admin.email,institutename:admin.institutename },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

    // Success response with token
    return res.status(200).json({
      msg: "Login successful.",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        institutionName: admin.institutename,
      },
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ msg: "Server error. Please try again later." });
  }
};

const adminDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Use findById for clarity and correctness
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ msg: "Admin not found." });
    }

    return res.status(200).json(admin);

  } catch (error) {
    console.error("Error fetching admin details:", error);
    return res
      .status(500)
      .json({ msg: "Server error. Please try again later." });
  }
};

const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, institutename } = req.body;
        const updatedAdmin = await Admin.findByIdAndUpdate(id, { name, email, institutename }, { new: true });
        if (!updatedAdmin) {
            return res.status(404).json({ msg: "Admin not found" });
        }
        res.status(200).json({ msg: "Admin updated successfully", admin: updatedAdmin });
    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAdmin = await Admin.findByIdAndDelete(id);
        if (!deletedAdmin) {
            return res.status(404).json({ msg: "Admin not found" });
        }
        res.status(200).json({ msg: "Admin deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

export { adminRegister, adminLogin,adminDetails, updateAdmin, deleteAdmin };