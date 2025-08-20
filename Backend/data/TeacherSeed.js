import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Teacher from './models/teacher.model.js';
import connectDB from './config/db.js';

dotenv.config();

const classMap = {
    'B1': '68a4d1b278e4272e288f1658',
    'B2': '68a5b5e14dfcc1761422c508',
    'B3': '68a569876cbdec712ce65d2a',
    'B4': '68a5b5ba4dfcc1761422c4f3',
    'B5': '68a5b5c04dfcc1761422c4f7',
    'B6': '68a5b5c24dfcc1761422c4fa',
    'B7': '68a5b5c44dfcc1761422c4fd',
    'B8': '68a5b5c74dfcc1761422c500',
};

const subjectMap = {
    'DM': '68a5bf586396aac671baa8b9',
    'PYTHON': '68a5bf586396aac671baa8ba',
    'TOC': '68a5bf586396aac671baa8bb',
    'COA': '68a5bf586396aac671baa8bc',
    'FSD': '68a5bf586396aac671baa8bd',
};

const adminId = '68a4b101b537ccaaed55e11a';

const teacherAssignments = [
    { teacher: 'MSS', class: 'B1', subject: 'DM' },
    { teacher: 'VHA', class: 'B1', subject: 'PYTHON' },
    { teacher: 'PDO', class: 'B1', subject: 'TOC' },
    { teacher: 'VBY', class: 'B1', subject: 'COA' },
    { teacher: 'PSP', class: 'B1', subject: 'FSD' },
    { teacher: 'TAT', class: 'B2', subject: 'PYTHON' },
    { teacher: 'DDP', class: 'B2', subject: 'DM' },
    { teacher: 'SSD', class: 'B2', subject: 'COA' },
    { teacher: 'DPS', class: 'B2', subject: 'TOC' },
    { teacher: 'NAS', class: 'B2', subject: 'FSD' },
    { teacher: 'PDO', class: 'B3', subject: 'TOC' },
    { teacher: 'BNS', class: 'B3', subject: 'DM' },
    { teacher: 'VHA', class: 'B3', subject: 'PYTHON' },
    { teacher: 'PSP', class: 'B3', subject: 'FSD' },
    { teacher: 'VBY', class: 'B3', subject: 'COA' },
    { teacher: 'DPS', class: 'B4', subject: 'TOC' },
    { teacher: 'DDP', class: 'B4', subject: 'DM' },
    { teacher: 'TAT', class: 'B4', subject: 'PYTHON' },
    { teacher: 'NAS', class: 'B4', subject: 'FSD' },
    { teacher: 'SSD', class: 'B4', subject: 'COA' },
    { teacher: 'MSS', class: 'B5', subject: 'DM' },
    { teacher: 'PDO', class: 'B5', subject: 'TOC' },
    { teacher: 'PSP', class: 'B5', subject: 'FSD' },
    { teacher: 'VBY', class: 'B5', subject: 'COA' },
    { teacher: 'DVP', class: 'B5', subject: 'PYTHON' },
    { teacher: 'NAS', class: 'B6', subject: 'FSD' },
    { teacher: 'SSD', class: 'B6', subject: 'COA' },
    { teacher: 'FRT', class: 'B6', subject: 'DM' },
    { teacher: 'DPS', class: 'B6', subject: 'TOC' },
    { teacher: 'VHA', class: 'B6', subject: 'PYTHON' },
    { teacher: 'PBZ', class: 'B7', subject: 'FSD' },
    { teacher: 'VBY', class: 'B7', subject: 'COA' },
    { teacher: 'MSS', class: 'B7', subject: 'DM' },
    { teacher: 'PDO', class: 'B7', subject: 'TOC' },
    { teacher: 'DVP', class: 'B7', subject: 'PYTHON' },
    { teacher: 'MJT', class: 'B8', subject: 'FSD' },
    { teacher: 'DDP', class: 'B8', subject: 'DM' },
    { teacher: 'SSD', class: 'B8', subject: 'COA' },
    { teacher: 'DPS', class: 'B8', subject: 'TOC' },
    { teacher: 'TAT', class: 'B8', subject: 'PYTHON' },
];

const seedDB = async () => {
    await connectDB();
    await Teacher.deleteMany({});

    const teachersToCreate = {};

    for (const assignment of teacherAssignments) {
        const shortForm = assignment.teacher;

        if (!teachersToCreate[shortForm]) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(shortForm.toLowerCase(), salt);

            teachersToCreate[shortForm] = {
                name: shortForm.toUpperCase(),
                email: `${shortForm.toLowerCase()}@gmail.com`,
                password: hashedPassword,
                admin: adminId,
                teaches: [],
            };
        }

        teachersToCreate[shortForm].teaches.push({
            class: classMap[assignment.class],
            subject: subjectMap[assignment.subject],
        });
    }

    await Teacher.insertMany(Object.values(teachersToCreate));
    console.log('Database seeded with teachers!');
};

seedDB().then(() => {
    mongoose.connection.close();
});