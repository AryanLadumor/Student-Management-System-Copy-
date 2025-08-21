import pandas as pd
import numpy as np
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson.objectid import ObjectId

# Load environment variables from a .env file
load_dotenv()

# --- Database Connection ---
MONGO_URL = os.getenv("MONGO_URL")
if not MONGO_URL:
    raise ValueError("MONGO_URL not found in environment variables. Please create a .env file in the Python_Services directory.")

client = MongoClient(MONGO_URL)
# Assumes your database name is part of the MONGO_URL, otherwise specify it here
db = client.get_default_database() 

def fetch_data_from_db():
    """Fetches and transforms student data from MongoDB into a pandas DataFrame."""
    students_collection = db.students
    
    pipeline = [
        {"$unwind": "$examResult"},
        {
            "$lookup": {
                "from": "subjects",
                "localField": "examResult.subject",
                "foreignField": "_id",
                "as": "subjectDetails"
            }
        },
        {"$unwind": "$subjectDetails"},
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
            "$project": {
                "_id": 0,
                "Roll Number": "$rollnumber",
                "NAME": "$name",
                "Class": "$classDetails.classname",
                "Subject": "$subjectDetails.subjectname",
                "ExamType": "$examResult.examType",
                "Marks": "$examResult.marks"
            }
        }
    ]
    
    data = list(students_collection.aggregate(pipeline))
    if not data:
        return pd.DataFrame()
        
    df = pd.DataFrame(data)
    
    pivot_df = df.pivot_table(
        index=['Roll Number', 'NAME', 'Class'],
        columns=['Subject', 'ExamType'],
        values='Marks'
    ).reset_index()

    pivot_df.columns = [' '.join(col).strip().replace('Marks', '').strip() for col in pivot_df.columns.values]
    
    return pivot_df

def clean_data(df):
    """Cleans the marks data, converting non-numeric values to NaN and then to 0."""
    marks_cols = [col for col in df.columns if 'T1' in col or 'T2' in col or 'T3' in col or 'T4' in col]
    for col in marks_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    df[marks_cols] = df[marks_cols].fillna(0)
    return df

def calculate_performance(df):
    """Calculates average scores, percentages, and ranks for each student."""
    if df.empty:
        return df

    df = clean_data(df.copy())
    
    marks_cols = [col for col in df.columns if 'T1' in col or 'T2' in col or 'T3' in col or 'T4' in col]
    
    df['Total Marks'] = df[marks_cols].sum(axis=1)
    total_possible_marks = len(marks_cols) * 25 
    df['Percentage'] = (df['Total Marks'] / total_possible_marks) * 100 if total_possible_marks > 0 else 0
    
    df['Overall Rank'] = df['Percentage'].rank(method='min', ascending=False).astype(int)
    df['Class Rank'] = df.groupby('Class')['Percentage'].rank(method='min', ascending=False).astype(int)
    
    return df

def get_subject_insights(df):
    """Calculates the average percentage for each subject."""
    if df.empty:
        return {}
        
    df = clean_data(df.copy())
    
    subjects = ['DM', 'PYTHON', 'TOC', 'COA', 'FSD']
    subject_avg = {}
    
    for subject in subjects:
        subject_cols = [col for col in df.columns if subject in col]
        if not subject_cols:
            continue
        total_marks = df[subject_cols].sum().sum()
        possible_marks = len(subject_cols) * len(df) * 25
        subject_avg[subject] = (total_marks / possible_marks) * 100 if possible_marks > 0 else 0
        
    return subject_avg

def get_at_risk_students(df, threshold=60.0):
    """Identifies students performing below a given percentage threshold."""
    if 'Percentage' not in df.columns:
        return pd.DataFrame()
        
    at_risk = df[df['Percentage'] < threshold]
    return at_risk[['NAME', 'Roll Number', 'Class', 'Percentage']].sort_values(by='Percentage')
