"""
Application Entry Point
"""
import os
from app import create_app
from app.config import config

# Get environment
env = os.environ.get('FLASK_ENV', 'development')
app = create_app(config.get(env, config['default']))

if __name__ == '__main__':
    # Get port from environment or use default
    port = int(os.environ.get('PORT', 5000))
    host = os.environ.get('HOST', '0.0.0.0')
    
    print(f"""
╔════════════════════════════════════════════════╗
║         PyArud Backend Server Started          ║
╠════════════════════════════════════════════════╣
║  Environment: {env.ljust(32)} ║
║  Host: {host.ljust(39)} ║
║  Port: {str(port).ljust(39)} ║
║  URL: http://{host}:{port}                 ║
╠════════════════════════════════════════════════╣
║  API Endpoints:                                ║
║  - POST /api/analyze                           ║
║  - GET  /api/bahr/<name>                       ║
║  - POST /api/validate                          ║
║  - GET  /api/status                            ║
║  - GET  /health                                ║
╚════════════════════════════════════════════════╝
    """)
    
    app.run(
        host=host,
        port=port,
        debug=app.config['DEBUG']
    )
