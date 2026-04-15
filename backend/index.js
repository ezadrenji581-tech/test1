import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courseRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',           // Untuk testing lokal
  'https://test1-zeta-liart-83.vercel.app' // URL Vercel anda
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const connectDB = async () => {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB Connected successfully (Online Mode)');
    } catch (err) {
      console.error(`MongoDB Connection Error: ${err.message}`);
      console.log('Backend starts in LOCAL DATABASE mode (users_local.json)');
    }
  } else {
    console.log('No MONGODB_URI found. Backend starts in LOCAL DATABASE mode (users_local.json)');
  }
};
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

app.get('/', (req, res) => {
  res.send('API CyberEdu is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
});
