import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createUser = async () => {
  try {
    const args = process.argv.slice(2);
    if (args.length < 3) {
      console.log('Penggunaan: node server/createUser.js <nama> <email> <kata_laluan>');
      process.exit(1);
    }

    const [name, email, password] = args;

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cyberedu');

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('Ralat: Pengguna dengan e-mel ini sudah wujud.');
      process.exit(1);
    }

    await User.create({
      name,
      email,
      password,
      role: 'user'
    });

    console.log(`Berjaya: Pengguna ${name} telah didaftarkan.`);
    process.exit(0);
  } catch (error) {
    console.error(`Ralat: ${error.message}`);
    process.exit(1);
  }
};

createUser();
