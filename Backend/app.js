import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import cors from 'cors';

import connectDB from './config/db.js';

//Routes Import Statement
import AdminRouter from './routes/admin.route.js';
import StudentRouter from './routes/student.route.js';
import ClassRouter from './routes/class.route.js';
import SubjectRouter from './routes/subject.route.js';
import TeacherRouter from './routes/teacher.route.js';
import ComplainRouter from './routes/complain.route.js';
import NoticeRouter  from './routes/notice.route.js';

//server APP
const app = express();
const PORT = process.env.PORT || 5000;


// Connect to DB
connectDB();

// middlewares for allowing urls from frontend and 
app.use(cors());
// to detect the json response from frontend
app.use(express.json());
// if frontend return some submitted form than to get that response
app.use(express.urlencoded({ extended: true }));



// API Calling with Router
app.use("/admin" , AdminRouter)
app.use("/students" , StudentRouter)
app.use("/class" , ClassRouter)
app.use("/subjects" , SubjectRouter)
app.use("/teachers" ,TeacherRouter)
app.use("/complain" , ComplainRouter)
app.use("/notices" , NoticeRouter)

app.get('/', (req, res) => {
    res.send('API is running...');  
});

// in env port is 8000
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})

  