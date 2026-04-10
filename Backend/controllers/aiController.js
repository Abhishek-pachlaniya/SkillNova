import { GoogleGenerativeAI } from '@google/generative-ai';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

// Gemini Initialize
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. Profile ko Vector banana
export const generateProfileEmbedding = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user.role !== 'engineer') return res.status(403).json({ message: "Only engineers can use this" });

        const textToVectorize = `Skills: ${user.skills.join(', ')}. Bio: ${user.bio}. Experience: ${user.experience} years.`;

        // Gemini se Embedding nikaalo
        const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
        const result = await model.embedContent(textToVectorize);
        const embedding = result.embedding.values;

        user.profileEmbedding = embedding;
        await user.save();

        res.json({ message: "AI Profile Indexed with Gemini! 🚀", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Embedding failed", error: error.message });
    }
};

// 2. Client ka Search Function
export const searchEngineers = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ message: "Prompt is required" });

        // User ke search ko vector banao
        const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
        const result = await model.embedContent(prompt);
        const vector = result.embedding.values;

        // MongoDB Vector Search
        const matchedEngineers = await User.aggregate([
            {
                "$vectorSearch": {
                    "index": "vector_index", 
                    "path": "profileEmbedding",
                    "queryVector": vector,
                    "numCandidates": 1000,
                    "limit": 50
                }
            },
            { "$match": { "role": "engineer" } },
            { "$project": { "password": 0, "score": { "$meta": "vectorSearchScore" } } }
        ]);

        res.json(matchedEngineers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "AI Search failed", error: error.message });
    }
};