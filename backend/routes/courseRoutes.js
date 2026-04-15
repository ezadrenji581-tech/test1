import express from 'express';
import Course from '../models/Course.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({}).populate('author', 'nameemail');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Ralat mengambil data kursus', error: error.message });
  }
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('author', 'name email');
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Kursus tidak dijumpai' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Ralat pelayan', error: error.message });
  }
});

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, description, category, level, image, modules } = req.body;

    const course = new Course({
      title,
      description,
      category,
      level,
      image,
      modules,
      author: req.user._id,
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(400).json({ message: 'Gagal menambah kursus', error: error.message });
  }
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { title, description, category, level, image, modules } = req.body;
    const course = await Course.findById(req.params.id);

    if (course) {
      course.title = title || course.title;
      course.description = description || course.description;
      course.category = category || course.category;
      course.level = level || course.level;
      course.image = image || course.image;
      course.modules = modules || course.modules;

      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Kursus tidak dijumpai' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Gagal mengemaskini kursus', error: error.message });
  }
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course) {
      await course.deleteOne();
      res.json({ message: 'Kursus telah dipadam' });
    } else {
      res.status(404).json({ message: 'Kursus tidak dijumpai' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Ralat memadam kursus', error: error.message });
  }
});

export default router;
