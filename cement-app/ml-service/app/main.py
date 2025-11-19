from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest

app = FastAPI(title="Cement Plant ML Service")

class TelemetryData(BaseModel):
    timestamp: str
    value: float
    sensor_id: str

class AnomalyRequest(BaseModel):
    data: List[TelemetryData]

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/analyze/anomaly")
def detect_anomaly(request: AnomalyRequest):
    try:
        df = pd.DataFrame([d.dict() for d in request.data])
        if df.empty:
            return {"anomalies": []}
            
        # Simple Isolation Forest for anomaly detection
        model = IsolationForest(contamination=0.1)
        df['anomaly'] = model.fit_predict(df[['value']])
        
        anomalies = df[df['anomaly'] == -1].to_dict(orient='records')
        return {"anomalies": anomalies}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/eda")
def generate_eda(request: AnomalyRequest):
    # Placeholder for generating statistical summary
    df = pd.DataFrame([d.dict() for d in request.data])
    if df.empty:
        return {"summary": {}}
        
    summary = df['value'].describe().to_dict()
    return {"summary": summary}
