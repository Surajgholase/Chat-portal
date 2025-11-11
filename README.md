## Chat Portal

A full-stack chat application with a Django REST API backend and a React + Vite frontend. The backend exposes conversation endpoints and optional AI hooks; the frontend provides a modern chat UI wired to those endpoints.

### Prerequisites
- Python 3.13 (or 3.10+)
- Node.js 18+ and npm

### Backend (Django + DRF)
1. Create and activate a virtual environment (Windows PowerShell):
   ```pwsh
   cd backend
   python -m venv venv
   ./venv/Scripts/Activate.ps1
   ```
2. Install dependencies:
   ```pwsh
   pip install -r requirements.txt
   ```
3. Run migrations and start the server:
   ```pwsh
   python manage.py migrate
   python manage.py runserver
   ```
4. API base URL: `http://127.0.0.1:8000/api/conversations`

Optional: Create a `.env` file in `backend/chat_portal` or project root to provide AI keys:
```
OPENAI_API_KEY=your_key_here
```

### Frontend (React + Vite)
1. Install dependencies:
   ```pwsh
   cd ../frontend
   npm install
   ```
2. Configure API base URL (optional; defaults to `http://127.0.0.1:8000/api/conversations`):
   - Create a `.env` file in `frontend` with:
     ```
     VITE_API_BASE=http://127.0.0.1:8000/api/conversations
     ```
3. Start the dev server:
   ```pwsh
   npm run dev
   ```
   Open the printed local URL (typically `http://127.0.0.1:5173`).

### Project Structure
- `backend/`: Django project (`chat_portal`) with app `chat_api`
  - Endpoints:
    - `GET /api/conversations/` list conversations
    - `GET /api/conversations/<id>/` conversation detail
    - `POST /api/conversations/start/` start a conversation
    - `POST /api/conversations/send/` send a message (returns AI reply)
    - `POST /api/conversations/end/` end and summarize
- `frontend/`: React app with a clean chat interface wired to the API

### Notes
- CORS is enabled in the backend for local development.
- The AI functions have a safe fallback if keys/services are not configured.
- For production, tighten `ALLOWED_HOSTS` and CORS settings, and set `DEBUG=False`.

### Scripts
- Backend: `python manage.py runserver`
- Frontend: `npm run dev`, `npm run build`, `npm run preview`

### License
MIT
*** End Patch***  }```???

