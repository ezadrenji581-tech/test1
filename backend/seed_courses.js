import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';
import User from './models/User.js';

dotenv.config();

const originalCourses = [
  {
    title: 'Web',
    description: 'Main battlefield',
    category: 'Web',
    level: 'Beginner',
    modules: [
      {
        title: 'Pengenalan Web Security',
        content: 'Memahami asas keselamatan web dan jenis-jenis serangan utama seperti SQL Injection, XSS, dan CSRF.',
        slideUrl: 'https://docs.google.com/presentation/d/1_J9p2wY0C7p2-o_fGf_y6-6vFqT5I2G8_Z/embed'
      }
    ]
  },
  {
    title: 'OSINT',
    description: 'Intel phase',
    category: 'OSINT',
    level: 'Beginner',
    modules: [
      {
        title: 'Open Source Intelligence (OSINT)',
        content: 'Teknik pengumpulan maklumat menggunakan sumber terbuka untuk tujuan perisikan dan keselamatan.',
        slideUrl: 'https://docs.google.com/presentation/d/1bK7dLuOmQyYWn9r3pWp_ySYh_OlST-04eSYuzXywsn4/embed'
      }
    ]
  },
  {
    title: 'Forensics',
    description: 'Detection & investigation',
    category: 'Forensic',
    level: 'Intermediate',
    modules: [
      {
        title: 'Digital Forensics',
        content: 'Penyiasatan jenayah siber dan pemulihan data dari sistem yang dikompromi.',
        slideUrl: 'https://docs.google.com/presentation/d/1_J9p2wY0C7p2-o_fGf_y6-6vFqT5I2G8_Z/embed'
      }
    ]
  },
  {
    title: 'Crypto',
    description: 'Secure systems & niche exploit',
    category: 'Crypto',
    level: 'Advanced',
    modules: [
      {
        title: 'Kriptografi',
        content: 'Asas penyulitan, jenis-jenis kriptografi, dan eksploitasi kelemahan dalam sistem kriptografi.',
        slideUrl: 'https://docs.google.com/presentation/d/1_J9p2wY0C7p2-o_fGf_y6-6vFqT5I2G8_Z/embed'
      }
    ]
  },
  {
    title: 'Reverse',
    description: 'Deep technical / malware',
    category: 'Reverse',
    level: 'Advanced',
    modules: [
      {
        title: 'Reverse Engineering',
        content: 'Membongkar kod perisian atau malware untuk memahami struktur dan cara ia berfungsi.',
        slideUrl: 'https://docs.google.com/presentation/d/1_J9p2wY0C7p2-o_fGf_y6-6vFqT5I2G8_Z/embed'
      }
    ]
  },
  {
    title: 'Analysis',
    description: 'SOC / network defense',
    category: 'Misc/Puzzle',
    level: 'Intermediate',
    modules: [
      {
        title: 'Analisis dan Pertahanan Rangkaian',
        content: 'Operasi Security Operations Center (SOC), pemantauan rangkaian, dan pertahanan terhadap serangan.',
        slideUrl: 'https://docs.google.com/presentation/d/1_J9p2wY0C7p2-o_fGf_y6-6vFqT5I2G8_Z/embed'
      }
    ]
  },
  {
    title: 'Misc',
    description: 'Tambahan / puzzle',
    category: 'Misc/Puzzle',
    level: 'Beginner',
    modules: [
      {
        title: 'Miscellaneous',
        content: 'Topik-topik tambahan, puzzle, dan cabaran pelbagai yang menguji kemahiran siber anda.',
        slideUrl: 'https://docs.google.com/presentation/d/1_J9p2wY0C7p2-o_fGf_y6-6vFqT5I2G8_Z/embed'
      }
    ]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // Get an admin user to be the author
    const adminUser = await User.findOne({ role: 'admin' }) || await User.findOne({});
    
    if (!adminUser) {
      console.error('No user found to set as author. Please register a user first.');
      process.exit(1);
    }

    // Clear existing courses (Optional)
    // await Course.deleteMany({});

    for (const courseData of originalCourses) {
        const exists = await Course.findOne({ title: courseData.title });
        if (!exists) {
            await Course.create({
                ...courseData,
                author: adminUser._id
            });
            console.log(`Added course: ${courseData.title}`);
        } else {
            console.log(`Course already exists: ${courseData.title}`);
        }
    }

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
