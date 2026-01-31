
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
const io = new Server(server, { // Attach Socket.io
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:8080'],
    credentials: true,
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080'],
  credentials: true,
}));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

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

app.get('/', (req, res) => {
  res.send('Green Earth Hub Backend Running');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
