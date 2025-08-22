import Student from '../models/student.model.js';
import Teacher from '../models/teacher.model.js';
import httpStatus from 'http-status';

// --- Existing Functions (markAttendance, getAttendance) remain the same ---

export const markAttendance = async (req, res) => {
    const { attendanceData, subjectId, date } = req.body;

    if (!attendanceData || !subjectId || !date) {
        return res.status(httpStatus.BAD_REQUEST).json({ msg: 'Missing required fields' });
    }

    try {
        for (const record of attendanceData) {
            const { studentId, status } = record;
            const student = await Student.findById(studentId);

            if (student) {
                student.attendance = student.attendance.filter(
                    (att) =>
                        att.subject.toString() !== subjectId ||
                        new Date(att.date).toDateString() !== new Date(date).toDateString()
                );
                student.attendance.push({ subject: subjectId, date, status });
                await student.save();
            }
        }
        res.status(httpStatus.OK).json({ msg: 'Attendance marked successfully' });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'Server error', error: error.message });
    }
};

export const getAttendance = async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findById(studentId).populate('attendance.subject', 'subjectname');
        if (!student) {
            return res.status(httpStatus.NOT_FOUND).json({ msg: 'Student not found' });
        }
        res.status(httpStatus.OK).json(student.attendance);
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'Server error', error: error.message });
    }
};


// --- NEW FUNCTIONS START HERE ---

// For Admin: Get all attendance records for the institution
export const getAdminAttendance = async (req, res) => {
    try {
        const { adminId } = req.params;
        const students = await Student.find({ admin: adminId })
            .populate('classname', 'classname')
            .populate('attendance.subject', 'subjectname')
            .select('name rollnumber classname attendance');

        if (!students) {
            return res.status(httpStatus.NOT_FOUND).json({ msg: 'No students found for this admin.' });
        }

        // Flatten the data for easier consumption on the frontend
        const attendanceRecords = students.flatMap(student =>
            student.attendance.map(record => ({
                studentName: student.name,
                rollNumber: student.rollnumber,
                className: student.classname.classname,
                subjectName: record.subject ? record.subject.subjectname : 'N/A',
                date: record.date,
                status: record.status,
                _id: record._id
            }))
        ).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by most recent date

        res.status(httpStatus.OK).json(attendanceRecords);
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'Server error', error: error.message });
    }
};

// For Teacher: Get attendance records for their specific classes/subjects
export const getTeacherAttendance = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const teacher = await Teacher.findById(teacherId).select('teaches');

        if (!teacher) {
            return res.status(httpStatus.NOT_FOUND).json({ msg: 'Teacher not found.' });
        }

        const subjectIds = teacher.teaches.map(t => t.subject);

        const students = await Student.find({ 'attendance.subject': { $in: subjectIds } })
            .populate('classname', 'classname')
            .populate('attendance.subject', 'subjectname')
            .select('name rollnumber classname attendance');

        const filteredRecords = students.flatMap(student =>
            student.attendance
                .filter(record => record.subject && subjectIds.some(subId => subId.equals(record.subject._id)))
                .map(record => ({
                    studentName: student.name,
                    rollNumber: student.rollnumber,
                    className: student.classname.classname,
                    subjectName: record.subject.subjectname,
                    date: record.date,
                    status: record.status,
                    _id: record._id
                }))
        ).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by most recent date

        res.status(httpStatus.OK).json(filteredRecords);
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'Server error', error: error.message });
    }
};
