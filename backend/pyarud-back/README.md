# PyArud Backend - Arabic Poetry Analysis API

Backend API for analyzing Arabic poetry using the PyArud library. Built with Flask following best practices.

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment (recommended)

## 🚀 Installation

### 1. Clone the repository (if applicable)

```bash
cd backend/pyarud-back
```

### 2. Create and activate virtual environment

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

```bash
# Copy the example environment file
copy .env.example .env  # Windows
# OR
cp .env.example .env    # macOS/Linux

# Edit .env file with your settings if needed
```

## 🏃 Running the Application

### Development Mode

```bash
python run.py
```

The server will start at `http://0.0.0.0:5000`

### Production Mode (using Gunicorn)

```bash
gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"
```

## 📡 API Endpoints

### 1. Health Check

```http
GET /health
```

**Response:**

```json
{
  "status": "healthy",
  "service": "PyArud Backend"
}
```

### 2. Analyze Poem

```http
POST /api/analyze
Content-Type: application/json
```

**Request Body:**

```json
{
  "verses": ["يا ليلُ الصَّبُّ متى غَدُهُ", "أقيامُ الساعةِ مَوْعِدُهُ"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "bahr": "المتقارب",
    "verses_analysis": [
      {
        "verse_number": 1,
        "original_verse": "يا ليلُ الصَّبُّ متى غَدُهُ",
        "bahr": "المتقارب",
        "tafila": [...],
        "zihaaf": [...],
        "is_valid": true,
        "details": {...}
      }
    ]
  }
}
```

### 3. Get Bahr Information

```http
GET /api/bahr/{bahr_name}
```

**Example:**

```http
GET /api/bahr/المتقارب
```

**Response:**

```json
{
  "success": true,
  "data": {
    "name": "المتقارب",
    "pattern": "فعولن فعولن فعولن فعولن"
  }
}
```

### 4. Validate Verse

```http
POST /api/validate
Content-Type: application/json
```

**Request Body:**

```json
{
  "verse": "يا ليلُ الصَّبُّ متى غَدُهُ"
}
```

**Response:**

```json
{
  "success": true,
  "is_valid": true
}
```

### 5. API Status

```http
GET /api/status
```

**Response:**

```json
{
  "status": "running",
  "version": "1.0.0",
  "service": "PyArud API",
  "endpoints": {...}
}
```

## 🏗️ Project Structure

```
pyarud-back/
├── app/
│   ├── __init__.py           # Application factory
│   ├── config.py             # Configuration classes
│   ├── routes.py             # API routes/endpoints
│   └── services/
│       ├── __init__.py
│       └── pyarud_service.py # PyArud integration service
├── venv/                     # Virtual environment (not in git)
├── .env                      # Environment variables (not in git)
├── .env.example              # Example environment file
├── .gitignore                # Git ignore rules
├── requirements.txt          # Python dependencies
├── run.py                    # Application entry point
└── README.md                 # This file
```

## 🧪 Testing

Run tests using pytest:

```bash
pytest
```

With coverage:

```bash
pytest --cov=app
```

## 🔧 Configuration

Key configuration options in `.env`:

- `FLASK_ENV`: Environment (development/production)
- `FLASK_DEBUG`: Enable debug mode (True/False)
- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 5000)
- `CORS_ORIGINS`: Allowed CORS origins (comma-separated)
- `MAX_VERSES_PER_REQUEST`: Maximum verses per analysis request

## 📝 Development Notes

### Architecture Principles

- **Factory Pattern**: Application created using factory pattern for flexibility
- **Blueprint Organization**: Routes organized using Flask blueprints
- **Service Layer**: Business logic separated in service layer
- **Configuration Management**: Environment-based configuration
- **Error Handling**: Comprehensive error handling and validation
- **CORS Support**: Enabled for frontend communication

### Best Practices Implemented

✅ Separation of concerns (routes, services, config)  
✅ Environment-based configuration  
✅ Input validation using Marshmallow  
✅ Proper error handling and HTTP status codes  
✅ CORS configuration for frontend integration  
✅ Arabic text support (JSON_AS_ASCII=False)  
✅ Request size limits  
✅ Comprehensive API documentation

## 🌐 CORS Configuration

The API is configured to accept requests from any origin in development mode. For production, update the `CORS_ORIGINS` in `.env`:

```bash
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

## 📦 Dependencies

- **Flask**: Web framework
- **Flask-CORS**: Cross-Origin Resource Sharing support
- **pyarud**: Arabic poetry analysis library
- **marshmallow**: Input validation
- **python-dotenv**: Environment variable management
- **gunicorn**: Production WSGI server

## 🐛 Troubleshooting

### PyArud installation issues

If you encounter issues installing PyArud:

```bash
pip install --upgrade pip
pip install pyarud
```

### Port already in use

Change the port in `.env` or run:

```bash
PORT=8000 python run.py
```

### Virtual environment not activating

Make sure you're in the correct directory and using the right command for your OS.

## 📄 License

This project is part of a technical test for Yuccainfo.

## 👨‍💻 Author

<div align="center">

### **Moatez Tilouch**
*Frontend Developer & Animation Enthusiast*

[![GitHub](https://img.shields.io/badge/GitHub-MoatezTilouche-181717?style=for-the-badge&logo=github)](https://github.com/MoatezTilouche)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Moatez%20Tilouch-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/moatez-tilouch-a58a96284/)
[![Email](https://img.shields.io/badge/Email-moateztilouch%40gmail.com-EA4335?style=for-the-badge&logo=gmail)](mailto:moateztilouch@gmail.com)

</div>


---
