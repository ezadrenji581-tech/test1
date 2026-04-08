import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cyberedu');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    console.warn('Backend is running without database connection. Database operations will fail.');
    // Don't exit process, allow server to stay up
  }
};

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
