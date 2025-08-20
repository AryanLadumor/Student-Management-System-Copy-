import Subject from '../models/subject.model.js';
import httpStatus from "http-status"

// CREATE SINGLE SUBJECT
export const createSubject = async (req, res) => {
  try {
    const { subjectname, subjectcode, sessions, adminId } = req.body;

    if(!subjectname || !subjectcode || !sessions){
        return res.status(httpStatus.BAD_REQUEST).json({ m: 'Please provide All Subject details' });
    }

    const existing = await Subject.findOne({
      subjectcode,
      admin: adminId,
    });

    if (existing) {
      return res.status(400).json({ message: 'Subject code already exists.' });
    }

    const newSubject = new Subject({
      subjectname,
      subjectcode,
      sessions,
      admin: adminId,
    });

    const savedSubject = await newSubject.save();
    res.status(201).json(savedSubject);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


// GET ALL SUBJECTS FOR ADMIN
export const allSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ admin: req.params.adminId })
      .populate("teacher","name")

    if (!subjects.length) {
      return res.status(404).json({ message: 'No subjects found' });
    }

    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// GET SUBJECTS BY CLASS
export const classSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ classname: req.params.classId });

    if (!subjects.length) return res.status(404).json({ msg: 'No subjects found' });

    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


// GET A SINGLE SUBJECT DETAIL
export const getSubjectDetail = async (req, res) => {
  try {
    // --- FIX STARTS HERE ---
    // The .populate('classname', 'classname') has been removed because
    // the 'classname' field no longer exists in the Subject schema.
    const subject = await Subject.findById(req.params.subjectId)
      .populate('teacher', 'name');
    // --- FIX ENDS HERE ---
      
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

const updateSubject = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const { subjectname, subjectcode, sessions } = req.body;
        const updatedSubject = await Subject.findByIdAndUpdate(subjectId, { subjectname, subjectcode, sessions }, { new: true });
        if (!updatedSubject) {
            return res.status(404).json({ message: "Subject not found" });
        }
        res.status(200).json({ msg: "Subject updated successfully", subject: updatedSubject });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// DELETE A SUBJECT
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.subjectId);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json({ message: 'Subject deleted successfully', subject });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// DELETE ALL SUBJECTS FOR AN ADMIN
export const deleteSubjects = async (req, res) => {
  try {
    await Subject.deleteMany({ admin: req.params.adminId });
    res.json({ message: 'All subjects deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// DELETE SUBJECTS BY CLASS
export const deleteSubjectsByClass = async (req, res) => {
  try {
    await Subject.deleteMany({ classname: req.params.classId });
    res.json({ message: 'Subjects deleted for class' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export { updateSubject };
