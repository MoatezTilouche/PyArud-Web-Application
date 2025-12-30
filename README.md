# PyArud Web Application (Frontend + Backend)

Full-stack Arabic poetry prosody analysis app built around the **PyArud** library.

- **Backend**: Flask API for analyzing Arabic poetry verses (meter/baḥr detection, per-verse analysis, validation).
- **Frontend**: React + Vite UI (RTL-friendly) that calls the backend API and renders results.



---

## Project Structure

```
backend/
  pyarud-back/        # Flask API (Python)
frontend/             # React UI (Vite)
```

---

## Prerequisites

### Backend

- Python 3.8+
- pip
- (Recommended) virtual environment

### Frontend

- Node.js 18+
- npm

---

## Quick Start (Run Everything Locally)

### 1) Start the Backend API

From the repository root:

```bash
cd backend/pyarud-back
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

Backend will be available at:

- `http://0.0.0.0:5000`

> Note: Some frontend configs assume the backend is on `http://localhost:8000`. If needed, update either the backend port (via `.env`) or the frontend `VITE_API_URL`.

### 2) Start the Frontend

Open a second terminal from the repository root:

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at:

- `http://localhost:5173`

---

## 🧪 Utilisation de l’application

Vidéo de démonstration :
https://drive.google.com/file/d/1Ra95Ovh3QNM1pxWAhvzOdWhyWXG8RRzQ/view?usp=sharing

Étapes :

1. Ouvrir le frontend dans le navigateur.
2. Saisir un ou plusieurs vers arabes (un vers par ligne).
3. Cliquer sur **Analyser**.

Le résultat affiche :

- le baḥr détecté
- les taf‘īla
- les ziḥāf (s’il y en a)
- l’état du vers (correct / cassé)

---

## Configuration

### Backend environment

In `backend/pyarud-back/`:

- Copy the example env file (if present):
  ```bash
  copy .env.example .env
  ```
- Common settings:
  - `HOST` (default: `0.0.0.0`)
  - `PORT` (default: `5000`)
  - `FLASK_ENV`, `FLASK_DEBUG`
  - `CORS_ORIGINS`
  - `MAX_VERSES_PER_REQUEST`

### Frontend environment

In `frontend/`:

- Copy the example env file:
  ```bash
  cp .env.example .env
  ```
- Set the backend API base URL:
  ```env
  VITE_API_URL=http://localhost:8000/api
  ```

If your backend runs on port `5000`, use:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## API Overview

Base URL (default): `http://localhost:5000`

### Health

- `GET /health`

### Analyze poem

- `POST /api/analyze`

Request:

```json
{ "verses": ["يا ليلُ الصَّبُّ متى غَدُهُ", "أقيامُ الساعةِ مَوْعِدُهُ"] }
```

### Bahr information

- `GET /api/bahr/{bahr_name}`

### Validate verse

- `POST /api/validate`

### Status

- `GET /api/status`

---

## Testing

### Backend

From `backend/pyarud-back/`:

```bash
pytest
```

Optional coverage:

```bash
pytest --cov=app
```

---

## Notes

- The frontend is RTL-friendly and optimized for Arabic text input.
- Ensure CORS is configured properly if you change ports/domains.

---

## 👨‍💻 Author

<div align="center">

### **Moatez Tilouch**

_Frontend Developer & Animation Enthusiast_

[![GitHub](https://img.shields.io/badge/GitHub-MoatezTilouche-181717?style=for-the-badge&logo=github)](https://github.com/MoatezTilouche)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Moatez%20Tilouch-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/moatez-tilouch-a58a96284/)
[![Email](https://img.shields.io/badge/Email-moateztilouch%40gmail.com-EA4335?style=for-the-badge&logo=gmail)](mailto:moateztilouch@gmail.com)

</div>

---
