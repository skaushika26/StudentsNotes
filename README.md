# NoteNest – MERN Login Page

A professional login page for a note-sharing platform, built with the MERN stack.

## 📁 Folder Structure

```
notenest/
├── client/                   # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx     # Login page component
│   │   │   └── Login.css     # Styles
│   │   ├── App.jsx           # Router + routes
│   │   └── main.jsx          # React entry point
│   ├── index.html
│   ├── vite.config.js        # Vite + proxy config
│   └── package.json
│
└── server/                   # Node.js + Express backend
    ├── models/
    │   └── User.js           # Mongoose User schema
    ├── routes/
    │   └── auth.js           # /api/auth/login & /register
    ├── middleware/
    │   └── auth.js           # JWT protect middleware
    ├── utils/
    │   └── jwt.js            # generateToken / verifyToken
    ├── index.js              # Express server entry
    ├── .env.example          # Environment variable template
    └── package.json
```

## 🚀 Setup & Run

### 1. Clone & install

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure environment

```bash
cd server
cp .env.example .env
# Edit .env – set MONGO_URI and JWT_SECRET
```

### 3. Start the servers

**Terminal 1 – Backend (port 5000)**
```bash
cd server
npm run dev      # uses nodemon for auto-reload
```

**Terminal 2 – Frontend (port 3000)**
```bash
cd client
npm run dev
```

Then open **http://localhost:3000/login** in your browser.

## 🔌 API Reference

| Method | Endpoint            | Body                        | Description          |
|--------|---------------------|-----------------------------|----------------------|
| POST   | /api/auth/register  | { name, email, password }   | Create account       |
| POST   | /api/auth/login     | { email, password }         | Sign in, get JWT     |
| GET    | /api/auth/me        | — (Bearer token required)   | Get current user     |
| GET    | /api/health         | —                           | Server health check  |

### Login response shape

```json
{
  "message": "Login successful",
  "token": "eyJhbGci...",
  "user": {
    "id": "664f...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2024-05-23T10:00:00.000Z"
  }
}
```

The JWT is stored in `localStorage` under the key `"token"` and sent as
`Authorization: Bearer <token>` on subsequent requests.

## 🛠 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, React Router v6, Axios    |
| Styling    | Vanilla CSS (Lora + DM Sans fonts)  |
| Build tool | Vite 5                              |
| Backend    | Node.js, Express 4                  |
| Database   | MongoDB (Mongoose 8)                |
| Auth       | bcryptjs (hashing), jsonwebtoken    |
