# Setup Guide - Authentication System

## ✅ What's Been Improved

### **Backend (server.js)**
- ✅ Added CORS support for frontend communication
- ✅ Added POST `/api/auth/register` endpoint for user registration
- ✅ Added POST `/api/auth/login` endpoint for user login
- ✅ Added form validation
- ✅ Added in-memory user storage (will persist during server runtime)

### **Frontend - Login (Login.jsx)**
- ✅ Added state management for form inputs (email, password, rememberMe)
- ✅ Added form validation
- ✅ Added error display for invalid inputs
- ✅ Integrated with backend API
- ✅ Stores auth token and user info in localStorage
- ✅ Redirects to /home on successful login
- ✅ Loading state during submission

### **Frontend - Inscription (Signup) (Inscription.jsx)**
- ✅ Updated API endpoint to correct localhost URL
- ✅ Improved error handling with response data
- ✅ Redirects to /login after successful registration (2 second delay)
- ✅ Added console error logging for debugging

---

## 🚀 How to Run

### **Step 1: Start the Backend Server**
```bash
cd c:\Users\A\Desktop\prepfa\back
npm start  # or npm run dev if nodemon is configured
```
Server will run on `http://localhost:4000`

### **Step 2: Start the Frontend Development Server** (in a new terminal)
```bash
cd c:\Users\A\Desktop\prepfa\front
npm start
```
Frontend will run on `http://localhost:3000`

---

## 📋 Testing the Authentication Flow

### **Register a New Account**
1. Go to `http://localhost:3000/inscription`
2. Fill in:
   - **Nom complet**: Any name
   - **Adresse email**: Any email (e.g., test@example.com)
   - **Mot de passe**: At least 6 characters
   - **Confirmer mot de passe**: Must match the password above
3. Click "S'inscrire"
4. You should see a success message and be redirected to login

### **Login**
1. Go to `http://localhost:3000/login`
2. Use the credentials from registration:
   - **Email**: test@example.com
   - **Mot de passe**: Your password
3. Optionally check "Se souvenir de moi"
4. Click "Se connecter"
5. You should be redirected to `/home`

---

## 🔐 Current Implementation Details

### **Password Storage**
⚠️ **WARNING**: Passwords are currently stored in plain text in memory.
In production, you MUST:
- Use bcrypt to hash passwords
- Use a real database (MongoDB, PostgreSQL, etc.)
- Implement JWT tokens instead of simple token strings

### **Token Storage**
- Auth token is stored in `localStorage` under key `authToken`
- User info is stored in `localStorage` under key `user`
- Use these in the app to:
  - Check if user is logged in
  - Protect private routes
  - Include token in API requests

---

## 🛠️ Next Steps (For Production)

1. **Database Integration**
   - Install and setup MongoDB or PostgreSQL
   - Create User schema/table

2. **Password Security**
   - Install bcrypt: `npm install bcrypt`
   - Hash passwords before storing

3. **JWT Tokens**
   - Install jsonwebtoken: `npm install jsonwebtoken`
   - Generate JWT tokens on login

4. **Environment Variables**
   - Create `.env` file
   - Store DB_URL, JWT_SECRET, etc.
   - Use dotenv package: `npm install dotenv`

5. **Protected Routes**
   - Use `PrivateRoute` component that checks localStorage.authToken
   - Redirect to login if not authenticated

6. **API Headers**
   - Include `Authorization: Bearer <token>` in all requests
   - Verify token on backend before returning data

---

## 📁 File Structure Summary

```
prepfa/
├── back/
│   ├── server.js          ✅ UPDATED - Auth endpoints added
│   └── package.json       ✅ UPDATED - cors dependency added
└── front/
    └── src/components/
        ├── login/
        │   └── Login.jsx          ✅ UPDATED - Functional login form
        └── inscription/
            └── Inscription.jsx    ✅ UPDATED - API endpoint fixed
```

---

## 🐛 Troubleshooting

**"Can't reach server" error?**
- Make sure backend is running on port 4000
- Check CORS is enabled in server.js
- Verify no other app is using port 4000

**Credentials not working?**
- Make sure you registered first before logging in
- Check browser console for error messages
- Verify form validation passes (no red error texts)

**User data not persisting?**
- Data is only in server memory; it resets when server restarts
- This is normal for development; use a database for production

