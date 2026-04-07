import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import userRoutes from './routes/userRoutes.js'
import applicationRoutes from './routes/applicationRoutes.js'; 
import interviewRoutes from './routes/interviewRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// 🚨 1. NAYA: Socket.io aur HTTP ke imports
import { createServer } from 'http';
import { Server } from 'socket.io';

// Environment variables load karo
dotenv.config();

// DB Connect
connectDB();

const app = express();

// 🚨 2. NAYA: Express app ko HTTP server mein lapet do
const server = createServer(app);

// 🚨 3. NAYA: Socket.io ka setup aur Frontend ko permission (CORS)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Tera React wala port
    methods: ["GET", "POST"]
  }
});

// Middlewares
app.use(cors());
app.use(express.json()); // Body parser

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users',userRoutes);
app.use('/api/applications', applicationRoutes);
app.get('/', (req, res) => {
    res.send('AI Freelance Platform API is running...');
});
app.use('/api/interviews', interviewRoutes);
app.use('/api/ai', aiRoutes);

// 🚨 4. NAYA: Asli Chat ka Logic (Socket Connection)
io.on("connection", (socket) => {
  console.log("🟢 Naya user chat mein aaya! ID:", socket.id);

  // Frontend se 'sendMessage' aane par suno...
  socket.on("sendMessage", (messageData) => {
    // Dusre connect hue logo ko turant forward kar do
    socket.broadcast.emit("receiveMessage", messageData);
  });

  // Jab user tab close kar de
  socket.on("disconnect", () => {
    console.log("🔴 User chala gaya:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

// 🚨 5. SABSE ZAROORI: app.listen ki jagah server.listen karo!
server.listen(PORT, () => console.log(`🔥 Server & Socket started on port ${PORT}`));