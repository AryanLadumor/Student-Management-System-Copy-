// controllers/complain.controller.js
import Complain from '../models/complain.model.js';
import httpStatus from 'http-status';

// STUDENT creates a complaint
export const createComplain = async (req, res) => {
  try {
    const { title, message, student, admin } = req.body;

    if (!title || !message || !student || !admin) {
      return res.status(httpStatus.BAD_REQUEST).json({ msg: "All fields are required" });
    }

    const newComplain = new Complain({ title, message, student, admin });
    const saved = await newComplain.save();

    res.status(httpStatus.CREATED).json(saved);
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Server error", error: err });
  }
};

// ADMIN views all complaints for their school
export const getComplainsForAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    const complains = await Complain.find({ admin: adminId })
      .populate('student', 'name rollnumber')
      .sort({ createdAt: -1 });

    if (!complains.length) {
      return res.status(httpStatus.NOT_FOUND).json({ msg: "No complaints found" });
    }

    res.json(complains);
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Server error", error: err });
  }
};

// STUDENT views their own complaints
export const getComplainsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const complains = await Complain.find({ student: studentId }).sort({ createdAt: -1 });

    if (!complains.length) {
      return res.status(httpStatus.NOT_FOUND).json({ msg: "You have not submitted any complaints yet." });
    }

    res.json(complains);
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Server error", error: err });
  }
};


// ADMIN updates status and adds response
export const updateComplainStatus = async (req, res) => {
  try {
    const { complainId } = req.params;
    const { status, response } = req.body;

    const updated = await Complain.findByIdAndUpdate(
      complainId,
      { status, response },
      { new: true }
    );

    if (!updated) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "Complain not found" });
    }

    res.json({ msg: "Updated successfully", complain: updated });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error", error: err });
  }
};

const deleteComplain = async (req, res) => {
    try {
        const { complainId } = req.params;
        const deletedComplain = await Complain.findByIdAndDelete(complainId);
        if (!deletedComplain) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "Complain not found" });
        }
        res.json({ msg: "Deleted successfully" });
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error", error: err });
    }
};

export { deleteComplain };