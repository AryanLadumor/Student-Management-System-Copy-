import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser';
import Student from '../models/student.model.js';
import connectDB from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

// This maps the subject names from your CSV to the ObjectIDs in your database.
const subjectMap = {
    'DM': '68a5bf586396aac671baa8b9',
    'PYTHON': '68a5bf586396aac671baa8ba',
    'TOC': '68a5bf586396aac671baa8bb',
    'COA': '68a5bf586396aac671baa8bc',
    'FSD': '68a5bf586396aac671baa8bd',
};

const seedExamResults = async () => {
    await connectDB();

    const results = [];
    const parser = fs.createReadStream('data/stumarks.csv').pipe(csv());

    console.log('Reading CSV file and preparing exam data...');

    for await (const row of parser) {
        const rollNumber = row['Roll Number'];
        if (rollNumber) {
            const studentResults = [];
            
            // Iterate over each subject and test
            for (const subject in subjectMap) {
                for (let i = 1; i <= 4; i++) {
                    const test = `T${i}`;
                    const marksKey = `${subject} ${test} Marks`;
                    let marksStr = row[marksKey] ? row[marksKey].trim() : '0';

                    // --- FIX STARTS HERE ---
                    // This logic now correctly handles empty strings and "AB" values,
                    // preventing the NaN error.
                    let marks = parseFloat(marksStr);
                    if (marksStr.toUpperCase() === 'AB' || isNaN(marks)) {
                        marks = 0;
                    }
                    // --- FIX ENDS HERE ---

                    studentResults.push({
                        subject: subjectMap[subject],
                        examType: test,
                        marks: marks,
                    });
                }
            }
            
            // Update the student with the exam results
            try {
                await Student.updateOne(
                    { rollnumber: rollNumber.trim() },
                    { $set: { examResult: studentResults } }
                );
            } catch (error) {
                console.error(`Failed to update marks for roll number ${rollNumber}:`, error);
            }
        }
    }

    console.log('✅ Exam results insertion process completed.');
    mongoose.connection.close();
};

seedExamResults();
