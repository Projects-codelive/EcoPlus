import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import quizRoutes from './routes/quiz.js';
import journeyRoutes from './routes/journey.js';
import userRoutes from './routes/users.js';
import socialRoutes from './routes/social.js';
import floodRouter from './routes/flood.js';
// import activityRoutes from './routes/activity.js';

import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
  process.env.FRONTEND_URL, // e.g. https://your-app.vercel.app
].filter(Boolean);

const io = new Server(server, { // Attach Socket.io
  cors: {
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: true,
  }
});

const PORT = process.env.PORT || 5001;

// Helper: true if origin is allowed (no header set for disallowed origins)
function isOriginAllowed(origin) {
  if (!origin) return false;
  if (allowedOrigins.includes(origin)) return true;
  if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) return true;
  return false;
}

// Set CORS headers only for allowed origins; do not set Allow-Origin for others
function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  if (origin && isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
}

// Preflight: respond to OPTIONS with 204 and CORS headers (before any route)
app.use((req, res, next) => {
  setCorsHeaders(req, res);
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// CORS for actual requests: only allow configured origins and localhost
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // same-origin or non-browser
    if (isOriginAllowed(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(cookieParser());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection (only connect if MONGO_URI is set)
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err.message));
} else {
  console.warn('MONGO_URI not set in .env – API will run but DB operations will fail. Copy backend/.env.example to .env and set MONGO_URI.');
}

// Make io accessible in routes
app.set('io', io);

// Socket.io Connection Logic
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/journey', journeyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/social', socialRoutes);
app.use("/api/flood", floodRouter);
// app.use('/api/activity', activityRoutes);

app.get('/', (req, res) => {
  res.send('Green Earth Hub Backend Running');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
