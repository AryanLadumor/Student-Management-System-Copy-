import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from analysis import fetch_data_from_db, clean_data

def train_prediction_model():
    """
    Trains a model to predict T3 and T4 marks based on T1 and T2 marks
    for each subject and returns a dictionary of trained models.
    """
    df = fetch_data_from_db()
    if df.empty:
        return None

    df = clean_data(df.copy())
    subjects = ['DM', 'PYTHON', 'TOC', 'COA', 'FSD']
    models = {}

    for subject in subjects:
        subject_cols = [col for col in df.columns if subject in col]
        
        # Ensure we have all four test columns for the subject
        t1_col, t2_col, t3_col, t4_col = f'{subject} T1', f'{subject} T2', f'{subject} T3', f'{subject} T4'
        if all(c in df.columns for c in [t1_col, t2_col, t3_col, t4_col]):
            
            # Features: T1 and T2 marks
            X = df[[t1_col, t2_col]]
            
            # Target: Average of T3 and T4 marks
            y = df[[t3_col, t4_col]].mean(axis=1)

            # Simple validation
            if X.shape[0] < 10: # Need enough data to train
                continue

            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            model = LinearRegression()
            model.fit(X_train, y_train)
            
            # Store the trained model
            models[subject] = model
            
    return models

def get_performance_predictions(models):
    """
    Uses the trained models to predict future performance for all students.
    """
    df = fetch_data_from_db()
    if df.empty or not models:
        return []

    df = clean_data(df.copy())
    predictions = []

    for index, row in df.iterrows():
        student_prediction = {
            'NAME': row['NAME'],
            'Roll Number': row['Roll Number'],
            'Class': row['Class'],
            'Predicted_Scores': {}
        }
        
        total_predicted_marks = 0
        num_subjects = 0

        for subject, model in models.items():
            t1_col, t2_col = f'{subject} T1', f'{subject} T2'
            if t1_col in row and t2_col in row:
                features = [[row[t1_col], row[t2_col]]]
                predicted_avg = model.predict(features)[0]
                
                # Cap predictions between 0 and 25
                predicted_avg = max(0, min(25, predicted_avg))
                
                student_prediction['Predicted_Scores'][subject] = predicted_avg
                
                # Calculate overall predicted percentage
                # (T1+T2 actual) + (T3+T4 predicted)
                total_predicted_marks += row[t1_col] + row[t2_col] + (predicted_avg * 2)
                num_subjects += 1

        if num_subjects > 0:
            total_possible = num_subjects * 4 * 25
            student_prediction['Predicted_Overall_Percentage'] = (total_predicted_marks / total_possible) * 100
        
        predictions.append(student_prediction)
        
    return predictions
    