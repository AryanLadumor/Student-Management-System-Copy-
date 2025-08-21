import Student from '../models/student.model.js';
import httpStatus from 'http-status';

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
                // Remove any existing attendance record for the same student, subject, and date
                student.attendance = student.attendance.filter(
                    (att) =>
                        att.subject.toString() !== subjectId ||
                        new Date(att.date).toDateString() !== new Date(date).toDateString()
                );

                // Add the new attendance record
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