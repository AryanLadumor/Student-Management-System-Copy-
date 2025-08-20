import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import fs from 'fs';
import csv from 'csv-parser';
import Student from './models/student.model.js';
import connectDB from './config/db.js';

dotenv.config();

// --- Configuration ---
// This is the ID for the admin account these students will be associated with.
const ADMIN_ID = '68a4b101b537ccaaed55e11a';

// This maps the class names from your CSV to the ObjectIDs in your database.
const CLASS_MAP = {
    'B1': '68a4d1b278e4272e288f1658',
    'B2': '68a5b5e14dfcc1761422c508',
    'B3': '68a569876cbdec712ce65d2a',
    'B4': '68a5b5ba4dfcc1761422c4f3',
    'B5': '68a5b5c04dfcc1761422c4f7',
    'B6': '68a5b5c24dfcc1761422c4fa',
    'B7': '68a5b5c44dfcc1761422c4fd',
    'B8': '68a5b5c74dfcc1761422c500',
};

const seedStudents = async () => {
    await connectDB();

    const students = [];
    const parser = fs.createReadStream('stumarks.csv').pipe(csv());

    console.log('Reading CSV file and preparing student data...');

    for await (const row of parser) {
        const name = row['NAME'];
        const rollNumber = row['Roll Number'];
        const className = row['Class'];

        if (name && rollNumber && className) {
            // --- UPDATE STARTS HERE ---
            // The password is now the last 3 digits of the roll number.
            const password = rollNumber.slice(-3);
            // --- UPDATE ENDS HERE ---
            
            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            students.push({
                name: name.trim(),
                rollnumber: rollNumber.trim(),
                password: hashedPassword,
                classname: CLASS_MAP[className.trim()],
                admin: ADMIN_ID,
            });
        }
    }

    if (students.length > 0) {
        try {
            console.log('Deleting existing students...');
            await Student.deleteMany({});
            console.log('Inserting new students into the database...');
            await Student.insertMany(students);
            console.log(`✅ Successfully inserted ${students.length} students.`);
        } catch (error) {
            console.error('❌ Error inserting students:', error);
        }
    } else {
        console.log('No students found in the CSV file to insert.');
    }

    mongoose.connection.close();
};

seedStudents();
