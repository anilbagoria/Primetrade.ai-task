# Task Manager — Backend Internship Assignment

A full-stack Task Manager application with JWT authentication, role-based access control, and complete CRUD operations.

**Backend:** Node.js + Express.js + MongoDB Atlas  
**Frontend:** React.js (Vite) + Axios + React Router DOM

---

## Project Structure

```
taskmanager/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, GetMe
│   │   └── taskController.js     # CRUD for tasks
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT auth + admin check
│   │   └── errorMiddleware.js    # Centralized error handler
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt
│   │   └── Task.js               # Task schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── validators/
│   │   ├── authValidator.js      # express-validator rules
│   │   └── taskValidator.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Dashboard.jsx
    │   ├── services/
    │   │   ├── api.js            # Axios instance with interceptors
    │   │   ├── authService.js
    │   │   └── taskService.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    └── package.json
```

---

## Prerequisites

- Node.js v18+
- npm v8+
- A MongoDB Atlas account (free tier works)

---

## Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here
```

See `.env.example` for reference.

---

## Running the Backend

```bash
cd backend
npm install
# create your .env file (see above)
npm run dev        # development with nodemon
# or
npm start          # production
```

Server runs at: `http://localhost:5000`

---

## Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

> **Note:** By default the frontend points to `http://localhost:5000/api/v1`. To change this, create a `.env` file in the `frontend/` folder:
> ```env
> VITE_API_URL=http://localhost:5000/api/v1
> ```

---

## API Endpoints

### Auth Routes — `/api/v1/auth`

| Method | Endpoint               | Access  | Description         |
|--------|------------------------|---------|---------------------|
| POST   | `/api/v1/auth/register`| Public  | Register new user   |
| POST   | `/api/v1/auth/login`   | Public  | Login & get token   |
| GET    | `/api/v1/auth/me`      | Private | Get logged-in user  |

**Register Request Body:**
```json
{
  "name": "Anil Sharma",
  "email": "anil@example.com",
  "password": "password123"
}
```

**Login Request Body:**
```json
{
  "email": "anil@example.com",
  "password": "password123"
}
```

---

### Task Routes — `/api/v1/tasks`

All task routes require `Authorization: Bearer <token>` header.

| Method | Endpoint            | Access         | Description                          |
|--------|---------------------|----------------|--------------------------------------|
| GET    | `/api/v1/tasks`     | Private        | Get tasks (own for user, all for admin) |
| GET    | `/api/v1/tasks/:id` | Private        | Get single task by ID                |
| POST   | `/api/v1/tasks`     | Private        | Create new task                      |
| PUT    | `/api/v1/tasks/:id` | Private        | Update task (owner or admin)         |
| DELETE | `/api/v1/tasks/:id` | Private        | Delete task (owner or admin)         |

**Create/Update Task Body:**
```json
{
  "title": "Complete assignment",
  "description": "Backend internship task manager",
  "status": "pending"
}
```

---

## Role-Based Access

| Action                | User        | Admin       |
|-----------------------|-------------|-------------|
| Register/Login        | ✅          | ✅          |
| Create Task           | ✅ (own)    | ✅          |
| View Tasks            | ✅ (own)    | ✅ (all)    |
| Edit Task             | ✅ (own)    | ✅ (any)    |
| Delete Task           | ✅ (own)    | ✅ (any)    |

To create an admin user, register normally and then manually update the `role` field in MongoDB Atlas to `"admin"`.

---

## Scalability Notes

This project is structured to scale easily:

- **API Versioning** (`/api/v1/`) allows introducing v2 routes without breaking existing clients
- **Modular structure** (controllers/routes/validators) makes adding new entities (notes, products, etc.) straightforward — just add a new folder set
- **Centralized error handling** means all errors are caught and formatted consistently
- **JWT authentication** is stateless and scales horizontally without shared session storage
- **MongoDB Atlas** supports auto-scaling clusters for production traffic

**Future improvements for production scale:**
- Add Redis caching for frequently-read data (e.g., task lists)
- Add rate limiting (`express-rate-limit`) to protect auth endpoints
- Add request logging with Morgan + Winston
- Containerize with Docker for consistent deployments
- Use load balancing (NGINX or cloud load balancer) for multiple backend instances
- Break into microservices when services grow independently (auth service, task service)

---

## Deployment

### Backend → Render

1. Push backend folder to GitHub
2. Create new Web Service on Render
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add environment variables: `PORT`, `MONGODB_URI`, `JWT_SECRET`

### Frontend → Vercel

1. Push frontend folder to GitHub
2. Import project in Vercel
3. Set framework to Vite
4. Add environment variable: `VITE_API_URL=https://your-render-url.onrender.com/api/v1`

### Database → MongoDB Atlas

See setup guide below.
