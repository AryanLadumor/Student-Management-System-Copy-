import mongoose from "mongoose"

const subjectSchema = new mongoose.Schema({
    subjectname : {
        type: String,
        required: true,
    },
    subjectcode:{
        type: String,
        required: true,
    },
    sessions: {
        type: String,
        required: true,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
    }
},{ timestamps: true })

const Subject = mongoose.model("Subject" , subjectSchema)
export default Subject