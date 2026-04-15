import { findUserByEmail, createUser } from './lib/db.js';
import bcrypt from 'bcryptjs';

const createLocalUser = async () => {
  try {
    const args = process.argv.slice(2);
    if (args.length < 3) {
      console.log('Penggunaan: node backend/createUser.js <nama> <email> <kata_laluan>');
      process.exit(1);
    }

    const [name, email, password] = args;

    const userExists = findUserByEmail(email);
    if (userExists) {
      console.log('Ralat: Pengguna dengan e-mel ini sudah wujud.');
      process.exit(1);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    createUser({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });

    console.log(`Berjaya: Pengguna ${name} telah didaftarkan dalam local database.`);
    process.exit(0);
  } catch (error) {
    console.error(`Ralat: ${error.message}`);
    process.exit(1);
  }
};

createLocalUser();
