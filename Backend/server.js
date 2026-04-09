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
import notificationRoutes from './routes/notificationRoutes.js';
// 🚨 1. NAYA: Socket.io aur HTTP ke imports
import { createServer } from 'http';
import { Server } from 'socket.io';
import { socketHandler } from './utils/socketHandler.js';
import conversationRoutes from './routes/conversationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
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
app.set('socketio', io);
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
app.use('/api/notifications', notificationRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
socketHandler(io);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🔥 Server & Socket started on port ${PORT}`));