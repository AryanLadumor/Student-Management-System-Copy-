from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from analysis import (
    fetch_data_from_db,
    calculate_performance,
    get_subject_insights,
    get_at_risk_students
)
from class_analysis import get_class_performance_data, get_teacher_performance_data
from predictive_models import train_prediction_model, get_performance_predictions

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODELS = train_prediction_model()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Student Performance Analysis API"}

# --- Student Performance Endpoints ---
@app.get("/predict-performance")
def predict_performance():
    """
    Predicts future student performance based on T1 and T2 scores.
    """
    if not MODELS:
        return {"error": "Model not trained. Not enough data available."}
    
    predictions = get_performance_predictions(MODELS)
    return predictions

@app.get("/performance")
def get_performance_data():
    df = fetch_data_from_db()
    if df.empty: return []
    performance_df = calculate_performance(df)
    return performance_df.to_dict(orient='records')

@app.get("/subject-insights")
def get_subject_insights_data():
    df = fetch_data_from_db()
    if df.empty: return {}
    subject_insights = get_subject_insights(df)
    return subject_insights

@app.get("/at-risk")
def get_at_risk_students_data(threshold: float = 60.0):
    df = fetch_data_from_db()
    if df.empty: return []
    performance_df = calculate_performance(df)
    at_risk_df = get_at_risk_students(performance_df, threshold)
    return at_risk_df.to_dict(orient='records')



# --- Class and Teacher Analysis Endpoints ---
@app.get("/class-performance")
def get_class_performance():
    """Returns average marks for each class."""
    return get_class_performance_data()

@app.get("/teacher-performance")
def get_teacher_performance():
    """Returns average marks for subjects taught by each teacher."""
    return get_teacher_performance_data()
