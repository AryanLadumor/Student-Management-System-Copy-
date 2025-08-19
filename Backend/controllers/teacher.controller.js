import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"; // <-- Import JWT
import Teacher from '../models/teacher.model.js';


// REGISTER TEACHER
export const teacherRegister = async (req, res) => {
  const { name, email, password, admin, teaches } = req.body;

  if (!name || !email || !password || !admin || !Array.isArray(teaches) || teaches.length === 0) {
    return res.status(400).json({ msg: "Please provide all required fields including teaches" });
  }

  try {
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) return res.status(400).json({ message: 'Email already exists' });

    const hashedPass = await bcrypt.hash(password, 10);

    const teacher = new Teacher({
      name,
      email,
      password: hashedPass,
      admin,
      teaches, // [{class: classId, subject: subjectId}, ...]
    });

    const result = await teacher.save();
    result.password = undefined;

    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server Error', error: err });
  }
};

// LOGIN TEACHER
export const teacherLogIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
    return res.status(400).json({ msg: "Please provide all required fields" });
  }

    const teacher = await Teacher.findOne({ email })
      .populate("admin", "name")
      .populate("teaches.class", "classname")
      .populate("teaches.subject", "subjectname");

    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    const isValid = await bcrypt.compare(password, teacher.password);
    if (!isValid) return res.status(400).json({ message: 'Invalid password' });

    // Create JWT Token
    const token = jwt.sign(
      { id: teacher._id, role: teacher.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const teacherData = teacher.toObject();
    delete teacherData.password;

    res.json({
      msg: "Login successful",
      token, // <-- Send token in response
      teacher: teacherData
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};


// GET ALL TEACHERS FOR A Admin
export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ admin: req.params.adminId })
      .populate("teaches.class", "classname")
      .populate("teaches.subject", "subjectname");

    if (!teachers.length) return res.status(404).json({ message: 'No teachers found' });

    const sanitized = teachers.map(t => {
      const { password, ...rest } = t._doc;
      return rest;
    });

    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};


// GET A SINGLE TEACHER
export const getTeacherDetail = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.teacherId)
      .populate("admin", "name")
      .populate("teaches.class", "classname")
      .populate("teaches.subject", "subjectname");

    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    teacher.password = undefined;
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};


// UPDATE TEACHER CLASS
export const updateTeacherTeaches = async (req, res) => {
  const { teacherId, teaches } = req.body;

  //teast case remaning
  if (!Array.isArray(teaches) || teaches.length === 0) {
    return res.status(400).json({ message: "Invalid teaches array" });
  }

  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { teaches },
      { new: true }
    )
    .populate("teaches.class", "classname")
    .populate("teaches.subject", "subjectname");

    if (!updatedTeacher) return res.status(404).json({ message: 'Teacher not found' });

    updatedTeacher.password = undefined;
    res.json({ message: 'Teaching subjects updated', teacher: updatedTeacher });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};

export const deleteTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);
        if (!deletedTeacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        res.status(200).json({ message: "Teacher deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const updateTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { name, email } = req.body;

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { name, email },
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    updatedTeacher.password = undefined;
    res.json({ message: 'Teacher updated successfully', teacher: updatedTeacher });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};