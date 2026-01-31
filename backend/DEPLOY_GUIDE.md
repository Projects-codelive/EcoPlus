# Backend Deployment Guide

## ⚠️ Critical Changes Required BEFORE Deploying

Your backend currently uses **Local Storage** and a **Local Database**. These will NOT work on the cloud unless you make changes.

### 1. Database (MongoDB)
You are using `mongodb://127.0.0.1...`. This only exists on your laptop.
**You must:**
1.  Create a free account on [MongoDB Atlas](https://www.mongodb.com/atlas).
2.  Create a Cluster -> Database -> User.
3.  Get the Connection String (starts with `mongodb+srv://...`).
4.  Use this string in your Render Environment Variables as `MONGO_URI`.

### 2. File Uploads (Images)
You are saving images to a local `uploads/` folder.
*   **On Vercel:** Fails immediately (File system is Read-Only).
*   **On Render:** Works temporarily, but images **DELETE** every time the server restarts (approx. every 15 mins of inactivity or updates).
    *   *Solution:* Use Cloudinary or AWS S3 for production. For a demo, Render is "okay" but posts will lose images after restarts.

### 3. Socket.io (Real-time)
*   **On Vercel:** **Does NOT Work.** Vercel functions cannot keep a connection open.
*   **On Render:** Works perfectly!

---

## Recommended: Deploy to Render.com

Since you need WebSockets (for Social Feed) and File Uploads, Render is the best free option.

1.  **Push to GitHub:**
    *   Push your `backend` folder to a GitHub repository.

2.  **Create Service on Render:**
    *   Go to [dashboard.render.com](https://dashboard.render.com).
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub repo.
    *   **Root Directory:** `backend` (Important!).
    *   **Build Command:** `npm install`
    *   **Start Command:** `node server.js`
    *   **Environment Variables:** Add these!
        *   `MONGO_URI`: (Your MongoDB Atlas connection string)
        *   `JWT_SECRET`: (Any secret password)
        *   `VITE_GEMINI_API_KEY`: (Your Gemini Key)

3.  **Update Frontend:**
    *   Once deployed, Render gives you a URL (e.g., `https://green-earth-backend.onrender.com`).
    *   Go to your **Frontend** Vercel Environment variables.
    *   Update `VITE_API_URL` to this new Render URL.
