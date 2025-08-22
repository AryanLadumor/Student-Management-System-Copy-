import Student from '../models/student.model.js';
import Teacher from '../models/teacher.model.js';
import httpStatus from 'http-status';
import mongoose from 'mongoose';


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


// --- EFFICIENT FILTERING LOGIC ---
const getFilteredAttendance = async (baseMatch, queryParams, page, limit) => {
    const { classId, subjectId, date } = queryParams;

    const pipeline = [
        { $match: baseMatch },
        { $unwind: "$attendance" },
    ];

    const filterMatch = {};
    if (classId) filterMatch.classname = new mongoose.Types.ObjectId(classId);
    if (subjectId) filterMatch['attendance.subject'] = new mongoose.Types.ObjectId(subjectId);
    if (date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        filterMatch['attendance.date'] = { $gte: startDate, $lt: endDate };
    }

    if (Object.keys(filterMatch).length > 0) {
        pipeline.push({ $match: filterMatch });
    }
    
    pipeline.push({ $sort: { 'attendance.date': -1 } });
    
    // Count total documents for pagination
    const countPipeline = [...pipeline, { $count: 'total' }];
    const totalResult = await Student.aggregate(countPipeline);
    const totalRecords = totalResult.length > 0 ? totalResult[0].total : 0;

    // Add pagination and lookups
    pipeline.push({ $skip: (page - 1) * limit });
    pipeline.push({ $limit: limit });
    pipeline.push(
        { $lookup: { from: 'classes', localField: 'classname', foreignField: '_id', as: 'classDetails' } },
        { $lookup: { from: 'subjects', localField: 'attendance.subject', foreignField: '_id', as: 'subjectDetails' } },
        { $unwind: '$classDetails' },
        { $unwind: '$subjectDetails' },
        {
            $project: {
                _id: '$attendance._id',
                studentName: '$name',
                rollNumber: '$rollnumber',
                className: '$classDetails.classname',
                subjectName: '$subjectDetails.subjectname',
                date: '$attendance.date',
                status: '$attendance.status',
            }
        }
    );

    const records = await Student.aggregate(pipeline);
    const hasMore = totalRecords > page * limit;

    return { records, hasMore };
}


export const getAdminAttendance = async (req, res) => {
    try {
        const { adminId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = 30; // Records per page
        
        const { records, hasMore } = await getFilteredAttendance(
            { admin: new mongoose.Types.ObjectId(adminId) },
            req.query, page, limit
        );

        res.status(httpStatus.OK).json({ records, hasMore });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'Server error', error: error.message });
    }
};

export const getTeacherAttendance = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const teacher = await Teacher.findById(teacherId).select('teaches');
        if (!teacher) {
            return res.status(httpStatus.NOT_FOUND).json({ msg: 'Teacher not found.' });
        }
        
        const subjectIds = teacher.teaches.map(t => t.subject);
        const page = parseInt(req.query.page) || 1;
        const limit = 30; // Records per page

        const { records, hasMore } = await getFilteredAttendance(
            { 'attendance.subject': { $in: subjectIds } },
            req.query, page, limit
        );
        
        res.status(httpStatus.OK).json({ records, hasMore });

    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'Server error', error: error.message });
    }
};