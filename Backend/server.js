import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import userRoutes from './routes/userRoutes.js'
import applicationRoutes from './routes/applicationRoutes.js'; // 👈 Ye add karo
import interviewRoutes from './routes/interviewRoutes.js';
// Environment variables load karo
dotenv.config();

// DB Connect
connectDB();

const app = express();

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server started on port ${PORT}`));
