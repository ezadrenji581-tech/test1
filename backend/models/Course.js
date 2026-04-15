import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Sila masukkan tajuk kursus'],
  },
  description: {
    type: String,
    required: [true, 'Sila masukkan penerangan'],
  },
  category: {
    type: String,
    required: [true, 'Sila pilih kategori'],
    enum: ['Web', 'OSINT', 'Forensic', 'Pwn', 'Crypto', 'Reverse', 'Misc/Puzzle'],
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
  },
  modules: [
    {
      title: String,
      content: String,
      videoUrl: String,
    }
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
