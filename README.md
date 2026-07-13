# AI Smart Trip Planner - Backend Foundation

This directory houses the FastAPI production-ready clean architecture backend foundations.

## Quick Start (Local Setup)

1. **Activate Virtual Environment**:
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On Linux/macOS:
   source venv/bin/activate
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Establish Environment Variables**:
   Copy `.env.example` to `.env` and fill in necessary database/AI API keys.
   ```bash
   cp .env.example .env
   ```

4. **Run Local Server**:
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```
   Open `http://127.0.0.1:8000/docs` to access interactive Swagger documentation.

---

## Docker Orchestration

To run the application alongside a PostgreSQL database locally:

```bash
docker-compose up --build -d
```

- Access Backend: `http://127.0.0.1:8000/`
- Access Swagger Docs: `http://127.0.0.1:8000/docs`
- Health check details: `http://127.0.0.1:8000/api/v1/health`

---

## Formatting and Linting

We enforce strict formatting rules configured inside `pyproject.toml`. Run the following commands to validate code style:

```bash
# Format code
black app
isort app

# Run syntax linting
ruff check app
```
