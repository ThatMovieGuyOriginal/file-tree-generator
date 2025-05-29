// src/lib/plugins/python.ts
import { LanguagePlugin } from '@/types/plugin';
import { ProjectSettings } from '@/types/project';

const pythonPlugin: LanguagePlugin = {
  id: 'python',
  name: 'Python',
  description: 'Python web application with FastAPI or Flask',
  version: '1.0.0',
  category: 'backend',
  
  extensions: ['.py'],
  configFiles: ['requirements.txt', 'pyproject.toml', '.env'],
  
  sampleTree: `my-python-app/
├── requirements.txt
├── pyproject.toml
├── .env
├── .gitignore
├── README.md
├── main.py
├── src/
│   ├── __init__.py
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── user.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   └── users.py
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── database.py
├── tests/
│   ├── __init__.py
│   ├── test_main.py
│   └── conftest.py
└── docs/
    └── api.md`,

  generateContent: (filename: string, settings: ProjectSettings): string => {
    if (filename.endsWith('.py')) {
      return generatePythonFileContent(filename, settings);
    }
    
    switch (filename) {
      case 'requirements.txt':
        return generateRequirementsTxt(settings);
      case 'pyproject.toml':
        return generatePyprojectToml(settings);
      case '.env':
        return generatePythonEnv(settings);
      case 'README.md':
        return generatePythonReadme(settings);
      default:
        return `# ${filename}\n# Python project file\n`;
    }
  },

  dependencies: {
    runtime: ['fastapi', 'uvicorn', 'pydantic', 'python-dotenv'],
    devDependencies: ['pytest', 'black', 'flake8', 'mypy']
  },

  metadata: {
    author: 'File Tree Generator',
    documentation: 'https://fastapi.tiangolo.com/',
    tags: ['api', 'web', 'async'],
    difficulty: 'intermediate'
  }
};

function generatePythonFileContent(filename: string, settings: ProjectSettings): string {
  const basename = filename.replace('.py', '');
  
  if (filename === 'main.py') {
    return `"""
${settings.name || 'My Python App'}
${settings.description || 'Generated with File Tree Generator'}
"""

from fastapi import FastAPI
from src.app.routes import auth, users

app = FastAPI(
    title="${settings.name || 'My Python App'}",
    description="${settings.description || 'Generated with File Tree Generator'}",
    version="1.0.0"
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(users.router, prefix="/users", tags=["users"])

@app.get("/")
async def root():
    return {"message": "Hello from ${settings.name || 'My Python App'}!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)`;
  }

  if (basename === '__init__') {
    return '"""Package initialization."""\n';
  }

  if (basename.includes('model')) {
    return `"""User model definition."""

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    is_active: Optional[bool] = None

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True`;
  }

  if (basename.includes('route') || basename.includes('auth')) {
    return `"""Authentication routes."""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer
from typing import List

router = APIRouter()
security = HTTPBearer()

@router.post("/login")
async def login(credentials: dict):
    """User login endpoint."""
    # Implementation here
    return {"access_token": "token", "token_type": "bearer"}

@router.post("/register")
async def register(user_data: dict):
    """User registration endpoint."""
    # Implementation here
    return {"message": "User created successfully"}

@router.post("/logout")
async def logout(token: str = Depends(security)):
    """User logout endpoint."""
    # Implementation here
    return {"message": "Logged out successfully"}`;
  }

  if (basename.includes('test_')) {
    return `"""Test cases for ${basename.replace('test_', '')}."""

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root():
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_health_check():
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}`;
  }

  return `"""${basename} module."""\n\n# Implementation for ${basename}\n`;
}

function generateRequirementsTxt(settings: ProjectSettings): string {
  return `# Core dependencies
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
python-dotenv==1.0.0

# Database (optional)
# sqlalchemy==2.0.23
# alembic==1.13.1

# Security
passlib[bcrypt]==1.7.4
python-jose[cryptography]==3.3.0

# Development dependencies
pytest==7.4.3
pytest-asyncio==0.21.1
black==23.11.0
flake8==6.1.0
mypy==1.7.1

# Documentation
# mkdocs==1.5.3
# mkdocs-material==9.4.8`;
}

function generatePyprojectToml(settings: ProjectSettings): string {
  return `[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "${settings.name || 'my-python-app'}"
version = "0.1.0"
description = "${settings.description || 'Generated with File Tree Generator'}"
readme = "README.md"
requires-python = ">=3.8"
dependencies = [
    "fastapi>=0.104.0",
    "uvicorn[standard]>=0.24.0",
    "pydantic>=2.5.0",
    "python-dotenv>=1.0.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.4.0",
    "pytest-asyncio>=0.21.0",
    "black>=23.0.0",
    "flake8>=6.0.0",
    "mypy>=1.7.0",
]

[tool.black]
line-length = 88
target-version = ['py38']

[tool.mypy]
python_version = "3.8"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true

[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]`;
}

function generatePythonEnv(settings: ProjectSettings): string {
  return `# Application settings
APP_NAME="${settings.name || 'My Python App'}"
APP_VERSION="1.0.0"
DEBUG=True

# Database
# DATABASE_URL="sqlite:///./app.db"
# DATABASE_URL="postgresql://user:password@localhost/dbname"

# Security
SECRET_KEY="your-secret-key-here"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Settings
API_V1_STR="/api/v1"
PROJECT_NAME="${settings.name || 'My Python App'}"

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000", "http://localhost:8080"]

# Redis (optional)
# REDIS_URL="redis://localhost:6379"`;
}

function generatePythonReadme(settings: ProjectSettings): string {
  return `# ${settings.name || 'My Python Project'}

${settings.description || 'A Python web application generated with File Tree Generator'}

## Features

- 🚀 FastAPI for high-performance API development
- 📝 Automatic API documentation with Swagger/OpenAPI
- 🔒 Authentication and authorization ready
- 🗃️ Database integration ready (SQLAlchemy)
- ✅ Test suite with pytest
- 🎨 Code formatting with Black
- 🔍 Type checking with mypy

## Quick Start

### Prerequisites
- Python 3.8+
- pip or poetry

### Installation

1. **Clone and setup:**
   \`\`\`bash
   git clone <your-repo>
   cd ${settings.name || 'my-python-app'}
   \`\`\`

2. **Create virtual environment:**
   \`\`\`bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   \`\`\`

3. **Install dependencies:**
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

4. **Run the application:**
   \`\`\`bash
   python main.py
   \`\`\`

5. **Visit:** http://localhost:8000

## API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Development

### Running Tests
\`\`\`bash
pytest
\`\`\`

### Code Formatting
\`\`\`bash
black .
\`\`\`

### Type Checking
\`\`\`bash
mypy .
\`\`\`

### Linting
\`\`\`bash
flake8 .
\`\`\`

## Deployment

### Docker (Recommended)
\`\`\`bash
docker build -t ${settings.name || 'my-python-app'} .
docker run -p 8000:8000 ${settings.name || 'my-python-app'}
\`\`\`

### Traditional Deployment
- **Heroku**: Ready for Heroku deployment
- **Railway**: One-click deploy ready
- **DigitalOcean**: App Platform compatible

## Project Structure

- \`src/app/\` - Main application code
- \`src/app/models/\` - Data models
- \`src/app/routes/\` - API routes
- \`tests/\` - Test files
- \`requirements.txt\` - Dependencies

## License

MIT License`;
}

export default pythonPlugin;
