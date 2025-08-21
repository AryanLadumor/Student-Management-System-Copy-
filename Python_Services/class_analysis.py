import pandas as pd
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
if not MONGO_URL:
    raise ValueError("MONGO_URL not found in environment variables.")

client = MongoClient(MONGO_URL)
db = client.get_default_database()

def get_class_performance_data():
    """Calculates the average marks for each class across all subjects."""
    students_collection = db.students
    
    pipeline = [
        {"$unwind": "$examResult"},
        {
            "$lookup": {
                "from": "classes",
                "localField": "classname",
                "foreignField": "_id",
                "as": "classDetails"
            }
        },
        {"$unwind": "$classDetails"},
        {
            "$group": {
                "_id": "$classDetails.classname",
                "AverageMarks": {"$avg": "$examResult.marks"}
            }
        },
        {"$sort": {"AverageMarks": -1}}
    ]
    
    data = list(students_collection.aggregate(pipeline))
    return data

def get_teacher_performance_data():
    """Calculates the average marks for subjects taught by each teacher."""
    teachers_collection = db.teachers
    
    pipeline = [
        {"$unwind": "$teaches"},
        {
            "$lookup": {
                "from": "students",
                "localField": "teaches.class",
                "foreignField": "classname",
                "as": "students"
            }
        },
        {"$unwind": "$students"},
        {"$unwind": "$students.examResult"},
        {
            "$project": {
                "teacher_name": "$name",
                "subject_taught": "$teaches.subject",
                "student_subject": "$students.examResult.subject",
                "marks": "$students.examResult.marks"
            }
        },
        {
            "$match": {
                "$expr": { "$eq": ["$subject_taught", "$student_subject"] }
            }
        },
        {
            "$group": {
                "_id": "$teacher_name",
                "AverageMarks": {"$avg": "$marks"}
            }
        },
        {"$sort": {"AverageMarks": -1}}
    ]
    
    data = list(teachers_collection.aggregate(pipeline))
    return data
