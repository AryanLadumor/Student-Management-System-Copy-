import Class from "../models/class.model.js";
// Create a new class
const createClass = async (req, res) => {
  try {
    const { classname, admin } = req.body;

    if (!classname || !admin)
      return res.status(400).json({ message: "Class name and admin ID are required" });

    // Check for duplicate class name under the same admin
    const existingClass = await Class.findOne({ classname,  admin });

    if (existingClass)
      return res.status(409).json({ message: "This class name already exists for the admin" });

    const newClass = new Class({ classname, admin });
    const savedClass = await newClass.save();

    res.status(201).json({msg:`${savedClass.classname} Class Created` , savedClass});
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all classes for a given admin
const listClasses = async (req, res) => {
  try {
    const { id } = req.params; // adminID

    const classes = await Class.find({ admin:id });

    if (!classes.length)
      return res.status(404).json({ message: "No classes found for this admin" });

    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get details of a single class by class ID
 const getClassDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const CurrClass = await Class.findById(id).populate("admin" ,"name");

    if (!CurrClass)
      return res.status(404).json({ message: "Class not found" });

    res.status(200).json(CurrClass);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const { classname } = req.body;

        // --- THIS IS THE FIX ---
        // Check if another class with the same name already exists
        const existingClass = await Class.findOne({ classname, _id: { $ne: id } });
        if (existingClass) {
            return res.status(409).json({ message: "This class name already exists." });
        }
        // --- END OF FIX ---

        const updatedClass = await Class.findByIdAndUpdate(id, { classname }, { new: true });
        if (!updatedClass) {
            return res.status(404).json({ message: "Class not found" });
        }
        res.status(200).json({ msg: "Class updated successfully", class: updatedClass });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const deleteClass = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedClass = await Class.findByIdAndDelete(id);
        if (!deletedClass) {
            return res.status(404).json({ message: "Class not found" });
        }
        res.status(200).json({ msg: "Class deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export { createClass, listClasses, getClassDetail, updateClass, deleteClass };