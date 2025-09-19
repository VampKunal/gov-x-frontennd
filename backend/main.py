from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import credentials, auth
import json
from datetime import datetime
from typing import Optional
import os

# Initialize Firebase Admin SDK
# You'll need to download your Firebase service account key JSON file
# and set the path in environment variable or directly here
if not firebase_admin._apps:
    # Option 1: Using environment variable (recommended for production)
    # os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "path/to/serviceAccountKey.json"
    # cred = credentials.ApplicationDefault()
    
    # Option 2: Direct path (for development)
    # cred = credentials.Certificate("path/to/serviceAccountKey.json")
    
    # Option 3: Using JSON string from environment variable
    firebase_config = os.getenv('FIREBASE_CONFIG')
    if firebase_config:
        service_account_info = json.loads(firebase_config)
        cred = credentials.Certificate(service_account_info)
        firebase_admin.initialize_app(cred)
    else:
        # Fallback - you need to add your Firebase config here
        print("Warning: Firebase not initialized. Please set FIREBASE_CONFIG environment variable.")

app = FastAPI(
    title="Gov-X India API",
    description="AI-Powered Civic Engagement Platform API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://localhost:3002",
        "https://your-frontend-domain.com",  # Update with your actual domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Dependency to verify Firebase token
async def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        # Verify the ID token
        decoded_token = auth.verify_id_token(credentials.credentials)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid authentication credentials: {str(e)}"
        )

# Optional dependency for endpoints that can work with or without auth
async def optional_verify_token(request: Request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except:
        return None

# Public endpoints
@app.get("/")
def home():
    return {
        "message": "Gov-X India API - AI-Powered Civic Engagement",
        "version": "1.0.0",
        "status": "active",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Auth endpoints
@app.get("/auth/verify")
async def verify_token(user_data: dict = Depends(verify_firebase_token)):
    """Verify the Firebase token and return user information"""
    return {
        "message": "Token is valid",
        "user": {
            "uid": user_data.get('uid'),
            "email": user_data.get('email'),
            "name": user_data.get('name'),
            "email_verified": user_data.get('email_verified'),
            "firebase": user_data  # Full Firebase user data
        }
    }

@app.get("/auth/profile")
async def get_user_profile(user_data: dict = Depends(verify_firebase_token)):
    """Get user profile information"""
    # Here you would typically fetch additional user data from your database
    # using the user_data['uid'] as the key
    
    return {
        "uid": user_data.get('uid'),
        "email": user_data.get('email'),
        "name": user_data.get('name', ''),
        "email_verified": user_data.get('email_verified', False),
        "picture": user_data.get('picture', ''),
        "created_at": user_data.get('auth_time'),
        "provider_data": user_data.get('firebase', {}).get('identities', {}),
        # Add your custom user fields here
        "role": "citizen",  # Default role
        "issues_reported": 0,
        "issues_resolved": 0
    }

# Protected endpoints (require authentication)
@app.get("/user/issues")
async def get_user_issues(user_data: dict = Depends(verify_firebase_token)):
    """Get issues reported by the authenticated user"""
    user_id = user_data.get('uid')
    
    # Mock data - replace with actual database queries
    user_issues = [
        {
            "id": 1,
            "title": "Pothole on Main Street",
            "description": "Large pothole causing traffic issues",
            "status": "pending",
            "created_at": "2024-01-15T10:00:00Z",
            "location": "Main Street, Mumbai",
            "department": "Municipal Corporation",
            "user_id": user_id
        }
    ]
    
    return {
        "issues": user_issues,
        "total": len(user_issues),
        "user_id": user_id
    }

@app.post("/issues")
async def create_issue(
    issue_data: dict,
    user_data: dict = Depends(verify_firebase_token)
):
    """Create a new civic issue"""
    user_id = user_data.get('uid')
    
    # Validate required fields
    required_fields = ['title', 'description', 'location', 'department']
    for field in required_fields:
        if field not in issue_data:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required field: {field}"
            )
    
    # Create new issue (mock implementation)
    new_issue = {
        "id": 12345,  # Would be generated by database
        "title": issue_data['title'],
        "description": issue_data['description'],
        "location": issue_data['location'],
        "department": issue_data['department'],
        "category": issue_data.get('category', 'General'),
        "priority": issue_data.get('priority', 'medium'),
        "status": "pending",
        "created_at": datetime.now().isoformat(),
        "user_id": user_id,
        "user_email": user_data.get('email'),
        "user_name": user_data.get('name', 'Anonymous'),
        "likes": 0,
        "comments": 0
    }
    
    # Here you would save to database
    # db.issues.insert_one(new_issue)
    
    return {
        "message": "Issue created successfully",
        "issue": new_issue
    }

# Public endpoints (no auth required)
@app.get("/issues")
async def get_all_issues(
    limit: int = 10,
    offset: int = 0,
    category: Optional[str] = None,
    status: Optional[str] = None,
    user_data: Optional[dict] = Depends(optional_verify_token)
):
    """Get all civic issues (public endpoint with optional auth)"""
    
    # Mock data - replace with actual database queries
    all_issues = [
        {
            "id": 1,
            "title": "Pothole on MG Road",
            "description": "Large pothole causing accidents",
            "status": "pending",
            "category": "Infrastructure",
            "location": "MG Road, Bangalore",
            "department": "Municipal Corporation",
            "created_at": "2024-01-15T10:00:00Z",
            "user_name": "John Doe",
            "likes": 15,
            "comments": 3,
            "is_liked": bool(user_data)  # User can like only if authenticated
        },
        {
            "id": 2,
            "title": "Broken Street Light",
            "description": "Street light not working for weeks",
            "status": "in_progress",
            "category": "Utilities",
            "location": "Park Street, Kolkata",
            "department": "Electricity Board",
            "created_at": "2024-01-14T15:30:00Z",
            "user_name": "Jane Smith",
            "likes": 8,
            "comments": 5,
            "is_liked": False
        }
    ]
    
    # Filter by category if provided
    if category:
        all_issues = [issue for issue in all_issues if issue['category'].lower() == category.lower()]
    
    # Filter by status if provided
    if status:
        all_issues = [issue for issue in all_issues if issue['status'].lower() == status.lower()]
    
    # Apply pagination
    paginated_issues = all_issues[offset:offset + limit]
    
    return {
        "issues": paginated_issues,
        "total": len(all_issues),
        "limit": limit,
        "offset": offset,
        "authenticated": bool(user_data)
    }

@app.get("/departments")
def get_departments():
    """Get all available departments"""
    return {
        "departments": [
            {"id": "municipal", "name": "Municipal Corporation", "description": "Garbage, sanitation, roads, parks"},
            {"id": "pwd", "name": "Public Works Department", "description": "Road construction, bridges, drainage"},
            {"id": "electricity", "name": "Electricity Board", "description": "Power outages, street lights, cables"},
            {"id": "water", "name": "Water Department", "description": "Water supply, pipelines, sewage"},
            {"id": "traffic", "name": "Traffic Police", "description": "Traffic signals, road safety"}
        ]
    }
