import bcrypt from "bcrypt";
import httpStatus from "http-status"

import Student from "../models/student.model.js";
import Admin from "../models/admin.model.js";

// Admin adds student
const registerStudent = async (req, res) => {
  try {
    const { name, rollnumber, password, classname, admin } = req.body;

    if (!name || !rollnumber || !password || !admin)
      return res.status(400).json({ msg: "All fields are required" });

    const existing = await Student.findOne({ rollnumber, admin });
    if (existing)
      return res.status(409).json({ msg: "Roll number already exists" });

    const hashedPass = await bcrypt.hash(password, 10);
    const student = new Student({
      name,
      rollnumber,
      password: hashedPass,
      classname,
      admin,
    });

    const saved = await student.save();
    saved.password = undefined;

    res.status(201).json({ msg: "Student registered Succefully", student: saved });
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const loginStudent = async (req, res) => {
  try {
    const { institutename, rollnumber, password } = req.body;

    if (!institutename || !rollnumber || !password) {
      return res.status(httpStatus.BAD_REQUEST).json({ msg: "All fields are required" });
    }

    // Step 1: Find the admin (institute) by name
    const admin = await Admin.findOne({ institutename });

    if (!admin) {
      return res.status(httpStatus.NOT_FOUND).json({ msg: "Institute not found" });
    }

    // Step 2: Find the student under this institute
    const student = await Student.findOne({ rollnumber, admin: admin._id });

    if (!student) {
      return res.status(httpStatus.NOT_FOUND).json({ msg: "Student not found under this institute" });
    }

    // Step 3: Compare password
    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(httpStatus.UNAUTHORIZED).json({ msg: "Invalid password" });
    }

    // Step 4: Return student info (excluding password)
    const studentData = student.toObject();
    delete studentData.password;

    return res.status(httpStatus.OK).json({
      msg: "Login successful",
      student: studentData,
    });

  } catch (error) {
    console.error(error)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      msg: "Server error during login",
      error: error.message,
    });
  }
};


const getAllStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const students = await Student.find({ admin: id }).populate("classname", "classname");
    res.status(200).json(students.map(s => ({ ...s._doc, password: undefined })));
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};




const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("admin", "institutename name")
      .populate("classname", "classname")


    if (!student) return res.status(404).json({ msg: "Student not found" });

    student.password = undefined;
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const markAttendance = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { subject, date, status } = req.body;
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ msg: "Student not found" });
        }
        student.attendance.push({ subject, date, status });
        await student.save();
        res.status(200).json({ msg: "Attendance marked successfully", student });
    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

const addExamResult = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { subject, examType, marks } = req.body;
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ msg: "Student not found" });
        }
        student.examResult.push({ subject, examType, marks });
        await student.save();
        res.status(200).json({ msg: "Result added successfully", student });
    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

export { registerStudent, loginStudent, getAllStudents, getStudentById, markAttendance, addExamResult };