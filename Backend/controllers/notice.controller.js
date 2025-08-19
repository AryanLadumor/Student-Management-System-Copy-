import Notice from '../models/notice.model.js';
import httpStatus from "http-status"

// Create a new notice
const createNotice = async (req, res) => {
  try {
    const { title, details, date, admin } = req.body;

    if (!title || !details || !admin) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Missing required fields" });
    }

    const notice = new Notice({ title, details, date, admin });
    const result = await notice.save();
    res.status(httpStatus.CREATED).json(result);
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error", error: err });
  }
};

// Get all notices for a specific admin
const getNoticesByAdmin = async (req, res) => {
  try {
    const notices = await Notice.find({ admin: req.params.adminId }).sort({ createdAt: -1 });

    if (!notices.length) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "No notices found" });
    }

    res.json(notices);
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error", error: err });
  }
};

// Update a specific notice
const updateNotice = async (req, res) => {
  try {
    const updated = await Notice.findByIdAndUpdate(req.params.noticeId, req.body, { new: true });

    if (!updated) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "Notice not found" });
    }

    res.json({ message: "Notice updated successfully", notice: updated });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error", error: err });
  }
};

// Delete a specific notice
//API = Test Remaning
const deleteNotice = async (req, res) => {
  try {
    const deleted = await Notice.findByIdAndDelete(req.params.noticeId);

    if (!deleted) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "Notice not found" });
    }

    res.json({ message: "Notice deleted successfully", notice: deleted });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error", error: err });
  }
};

// Delete all notices by admin
const deleteAllNoticesByAdmin = async (req, res) => {
  try {
    const result = await Notice.deleteMany({ admin: req.params.adminId });

    if (result.deletedCount === 0) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "No notices found to delete" });
    }

    res.json({ message: "All notices deleted", deletedCount: result.deletedCount });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error", error: err });
  }
};

export {
  createNotice,
  getNoticesByAdmin,
  updateNotice,
  deleteNotice,
  deleteAllNoticesByAdmin,
};
