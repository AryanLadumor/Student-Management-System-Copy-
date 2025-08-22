import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Student from '../models/student.model.js';
import Subject from '../models/subject.model.js';
import Teacher from '../models/teacher.model.js';

dotenv.config();

const seedAttendance = async () => {
    await connectDB();

    try {
        console.log('Fetching students and teachers...');
        const students = await Student.find({});
        const teachers = await Teacher.find({}).populate('teaches.subject');

        if (students.length === 0 || teachers.length === 0) {
            console.log('No students or teachers found. Please seed them first.');
            mongoose.connection.close();
            return;
        }

        console.log('Clearing existing attendance data...');
        await Student.updateMany({}, { $set: { attendance: [] } });

        const academicYearStart = new Date('2023-08-01');
        const today = new Date();
        const attendanceRecords = [];

        for (const student of students) {
            const studentAttendance = [];
            const assignedSubjects = teachers.flatMap(teacher =>
                teacher.teaches
                    .filter(t => t.class.toString() === student.classname.toString())
                    .map(t => t.subject)
            );

            // Define student profiles for varied attendance
            const rand = Math.random();
            let attendancePercentage = 0.85; // Average student
            if (rand < 0.15) {
                attendancePercentage = 0.65; // At-risk student
            } else if (rand > 0.8) {
                attendancePercentage = 0.95; // Good student
            }

            for (let day = new Date(academicYearStart); day <= today; day.setDate(day.getDate() + 1)) {
                if (day.getDay() === 0 || day.getDay() === 6) continue; // Skip weekends

                for (const subject of assignedSubjects) {
                    let finalAttendance = attendancePercentage;

                    // Some students have a subject they struggle with
                    if (student.rollnumber % 7 === subject.subjectname.length % 5) {
                        finalAttendance = 0.5; // Lower attendance for this specific subject
                    }
                    
                    studentAttendance.push({
                        subject: subject._id,
                        date: new Date(day),
                        status: Math.random() < finalAttendance ? 'Present' : 'Absent',
                    });
                }
            }
            attendanceRecords.push({
                updateOne: {
                    filter: { _id: student._id },
                    update: { $set: { attendance: studentAttendance } },
                },
            });
        }
        
        console.log(`Generated attendance for ${students.length} students.`);
        if (attendanceRecords.length > 0) {
            console.log('Bulk inserting attendance records...');
            await Student.bulkWrite(attendanceRecords);
            console.log('✅ Attendance data seeded successfully!');
        }

    } catch (error) {
        console.error('❌ Error seeding attendance data:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedAttendance();