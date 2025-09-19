# Firebase Authentication Integration Guide for Backend Engineers

## 🔥 Overview

The frontend is configured to send Firebase ID tokens in the `Authorization: Bearer <token>` header for authenticated API calls. This guide shows you how to verify these tokens on the backend.

## 🔐 Token Flow

### Frontend Token Generation
1. User logs in with Firebase Auth
2. Firebase generates an ID token (JWT)
3. Frontend stores token in localStorage
4. Token is sent with API requests in Authorization header

### Backend Token Verification
1. Extract token from `Authorization: Bearer <token>` header
2. Verify token using Firebase Admin SDK
3. Extract user information from decoded token
4. Use user ID for database operations

## 🛠️ Backend Implementation

### Python/FastAPI Example

```python
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import credentials, auth

# Initialize Firebase Admin SDK (one-time setup)
cred = credentials.Certificate("path/to/serviceAccountKey.json")
firebase_admin.initialize_app(cred)

security = HTTPBearer()
app = FastAPI()

# Dependency to verify Firebase token
async def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        # This is where the magic happens - verify the token
        decoded_token = auth.verify_id_token(credentials.credentials)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid authentication credentials: {str(e)}"
        )

# Protected endpoint example
@app.get("/auth/profile")
async def get_user_profile(user_data: dict = Depends(verify_firebase_token)):
    return {
        "uid": user_data.get('uid'),           # Use this as primary key
        "email": user_data.get('email'),       # User email
        "name": user_data.get('name'),         # Display name
        "email_verified": user_data.get('email_verified'),
        "auth_time": user_data.get('auth_time') # When user authenticated
    }

# Create issue with user context
@app.post("/issues")
async def create_issue(issue_data: dict, user_data: dict = Depends(verify_firebase_token)):
    user_id = user_data.get('uid')  # This is your foreign key
    
    new_issue = {
        **issue_data,
        "user_id": user_id,
        "user_email": user_data.get('email'),
        "created_at": datetime.now()
    }
    
    # Save to your database
    # db.issues.insert_one(new_issue)
    
    return {"message": "Issue created", "issue": new_issue}
```

### Node.js/Express Example

```javascript
const admin = require('firebase-admin');
const express = require('express');

// Initialize Firebase Admin (one-time setup)
const serviceAccount = require('./path/to/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

// Middleware to verify Firebase token
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Protected route
app.get('/auth/profile', verifyFirebaseToken, (req, res) => {
  res.json({
    uid: req.user.uid,
    email: req.user.email,
    name: req.user.name,
    email_verified: req.user.email_verified
  });
});
```

## 📋 Token Structure

The Firebase ID token is a JWT with this structure:

### Header
```json
{
  "alg": "RS256",
  "kid": "firebase-key-id",
  "typ": "JWT"
}
```

### Payload (Claims)
```json
{
  "iss": "https://securetoken.google.com/your-project-id",
  "aud": "your-project-id",
  "auth_time": 1642678400,
  "user_id": "firebase-user-unique-id",
  "sub": "firebase-user-unique-id",
  "iat": 1642678400,
  "exp": 1642682000,
  "email": "user@example.com",
  "email_verified": true,
  "firebase": {
    "identities": {
      "email": ["user@example.com"]
    },
    "sign_in_provider": "password"
  }
}
```

### Important Claims for Backend
- `user_id` or `sub`: Use as primary key in your database
- `email`: User's email address
- `email_verified`: Whether email is verified
- `exp`: Token expiration (handle expired tokens)
- `iat`: Token issued at time

## 🔧 Setup Requirements

### 1. Firebase Project Setup
1. Create Firebase project
2. Enable Authentication
3. Generate service account key
4. Download JSON key file

### 2. Environment Setup
```bash
# Set environment variable (recommended)
export GOOGLE_APPLICATION_CREDENTIALS="path/to/serviceAccountKey.json"

# Or load JSON directly in code
```

### 3. Dependencies

**Python:**
```bash
pip install firebase-admin fastapi python-multipart
```

**Node.js:**
```bash
npm install firebase-admin express
```

## 🚦 API Endpoints to Implement

Based on frontend implementation, you need these endpoints:

### Authentication Endpoints
- `GET /auth/verify` - Verify token and return user info
- `GET /auth/profile` - Get user profile data

### User-Specific Endpoints (Require Auth)
- `GET /user/issues` - Get issues created by authenticated user
- `POST /issues` - Create new issue (user auto-assigned from token)

### Public Endpoints (Optional Auth)
- `GET /issues` - Get all issues (public, but can show user-specific data if authenticated)

## ⚠️ Security Best Practices

1. **Always verify tokens** - Never trust client-side token claims
2. **Handle expired tokens** - Firebase tokens expire after 1 hour
3. **Use HTTPS** - Tokens should only be sent over secure connections
4. **Rate limiting** - Implement rate limiting on API endpoints
5. **Input validation** - Validate all request data
6. **Error handling** - Don't leak sensitive information in error messages

## 🧪 Testing

The frontend `/api-demo` page shows:
- Token being generated and sent
- Headers being set correctly  
- Mock API responses
- Console logs showing exact token format

Use this to verify your backend integration is working correctly.

## 📞 Frontend Integration Points

### Headers Sent by Frontend
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <firebase-id-token>'
}
```

### API Base URL
Frontend is configured to call: `http://localhost:8000` (configurable via `NEXT_PUBLIC_API_URL`)

### Error Handling
Frontend expects standard HTTP status codes:
- 200: Success
- 401: Unauthorized (invalid/expired token)
- 400: Bad request (validation errors)
- 500: Server error

## 🔍 Debugging

1. **Log received tokens** (temporarily during development)
2. **Verify token structure** using JWT debuggers
3. **Check Firebase console** for authentication events
4. **Monitor token expiration** (1 hour lifetime)

## 📝 Next Steps

1. Set up Firebase Admin SDK in your backend
2. Implement token verification middleware
3. Create the required endpoints
4. Test with the frontend demo page
5. Add your business logic (database operations, etc.)

The frontend is ready and sending tokens correctly - you just need to implement the verification and business logic on your end!