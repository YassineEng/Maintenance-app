# Cement Plant Maintenance App - Developer Guide

## Prerequisites
- Node.js 18+
- Python 3.9+
- Docker & Docker Compose
- SAP S/4HANA Access (or Mock Server)

## Getting Started

### 1. Infrastructure
Start the database and message broker:
```bash
cd infra
docker-compose up -d
```

### 2. Backend
Install dependencies and start the server:
```bash
cd backend
npm install
# Set env vars in .env (copy from .env.example)
npm run dev
```
The API will be available at `http://localhost:3000`.

### 3. Frontend
Install dependencies and start the dev server:
```bash
cd frontend
npm install
npm run dev
```
Access the UI at `http://localhost:5173`.

### 4. ML Service
Install Python dependencies and start FastAPI:
```bash
cd ml-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Project Structure
- `backend/`: NestJS API & Workflow Engine
- `frontend/`: React + React Flow UI
- `ml-service/`: Python FastAPI for Analytics
- `infra/`: Docker Compose & K8s manifests

## Testing
- Backend: `npm run test`
- Frontend: `npm run test` (not yet configured)
- E2E: See `tests/e2e` (to be implemented)

## SAP Integration
- Configure `SAP_URL`, `SAP_USERNAME`, `SAP_PASSWORD` in backend `.env`.
- The `SapService` uses SAP Cloud SDK to communicate with S/4HANA.
