import bcrypt from "bcrypt";
import httpStatus from "http-status";
import jwt from "jsonwebtoken"; // <-- Import JWT

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

    res
      .status(201)
      .json({ msg: "Student registered Succefully", student: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const loginStudent = async (req, res) => {
  try {
    const { institutename, rollnumber, password } = req.body;

    if (!institutename || !rollnumber || !password) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "All fields are required" });
    }

    const admin = await Admin.findOne({ institutename });
    if (!admin) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "Institute not found" });
    }

    const student = await Student.findOne({ rollnumber, admin: admin._id })
      .populate("classname", "classname")
      .populate("admin", "institutename");

    if (!student) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "Student not found under this institute" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ msg: "Invalid password" });
    }

    // Create JWT Token
    const token = jwt.sign(
      { id: student._id, role: student.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const studentData = student.toObject();
    delete studentData.password;

    return res.status(httpStatus.OK).json({
      msg: "Login successful",
      token, // <-- Send token in response
      student: studentData,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      msg: "Server error during login",
      error: error.message,
    });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const students = await Student.find({ admin: id }).populate(
      "classname",
      "classname"
    );
    res
      .status(200)
      .json(students.map((s) => ({ ...s._doc, password: undefined })));
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const getStudentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const students = await Student.find({ classname: classId }).select(
      "-password"
    ); // Find students by classname and exclude password

    if (!students.length) {
      return res.status(404).json({ msg: "No students found for this class" });
    }
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("admin", "institutename name")
      .populate("classname", "classname");

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

const deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ msg: "Student not found" });
    }
    res.status(200).json({ msg: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rollnumber, classname } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, rollnumber, classname },
      { new: true } // This option returns the updated document
    ).populate("classname", "classname");

    if (!updatedStudent) {
      return res.status(404).json({ msg: "Student not found" });
    }

    // Don't send the password back
    updatedStudent.password = undefined;

    res
      .status(200)
      .json({ msg: "Student updated successfully", student: updatedStudent });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const getExamResults = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId).populate({
      path: "examResult.subject",
      select: "subjectname subjectcode", // Also fetching subject code
    });

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    res.status(200).json(student.examResult);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const getStudentsWithResults = async (req, res) => {
  try {
    const { adminId } = req.params;
    const students = await Student.find({ admin: adminId })
      .populate({
        path: "examResult.subject",
        select: "subjectname",
      })
      .populate("classname", "classname");

    if (!students) {
      return res.status(404).json({ msg: "No students found" });
    }

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const updateStudentMarks = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { examResults } = req.body; // Expecting an array of results

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    // Update the examResult array
    student.examResult = examResults;
    await student.save();

    res.status(200).json({ msg: "Marks updated successfully", student });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export {
  registerStudent,
  loginStudent,
  getAllStudents,
  getStudentById,
  markAttendance,
  addExamResult,
  deleteStudent,
  updateStudent,
  getStudentsByClass,
  getExamResults,
  updateStudentMarks,
  getStudentsWithResults,
};
