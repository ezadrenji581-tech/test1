import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();
const LOCAL_DB_PATH = path.resolve('users_local.json');

// Helper to handle local DB
const getLocalUsers = () => {
    if (!fs.existsSync(LOCAL_DB_PATH)) return [];
    try {
        return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
    } catch (e) {
        return [];
    }
};

const saveLocalUser = (user) => {
    const users = getLocalUsers();
    users.push(user);
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(users, null, 2));
};

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret', {
    expiresIn: '30d',
  });
};

// @route POST /api/auth/google-login
router.post('/google-login', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, sub: googleId } = ticket.getPayload();

    let user;
    try {
        user = await User.findOne({ email });
        if (!user) {
          user = await User.create({ name, email, googleId });
        } else if (!user.googleId) {
          user.googleId = googleId;
          await user.save();
        }
    } catch (dbError) {
        console.warn('Database offline, using local storage fallback for Google login');
        const localUsers = getLocalUsers();
        user = localUsers.find(u => u.email === email);
        if (!user) {
            user = { _id: googleId, name, email, role: 'user', googleId };
            saveLocalUser(user);
        }
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(401).json({ message: 'Log masuk Google gagal', error: error.message });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');
        if (user && (await user.matchPassword(password))) {
          return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
          });
        }
    } catch (dbError) {
        console.warn('Database offline, using local storage fallback for login');
        const localUsers = getLocalUsers();
        const user = localUsers.find(u => u.email === email);
        if (user && user.password && (await bcrypt.compare(password, user.password))) {
             return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
              });
        }
    }
    
    res.status(401).json({ message: 'E-mel atau kata laluan tidak sah' });
  } catch (error) {
    res.status(500).json({ message: 'Ralat pelayan', error: error.message });
  }
});

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
          return res.status(400).json({ message: 'Pengguna sudah wujud' });
        }
        const user = await User.create({ name, email, password });
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (dbError) {
        console.warn('Database offline, using local storage fallback for registration');
        const localUsers = getLocalUsers();
        if (localUsers.find(u => u.email === email)) {
            return res.status(400).json({ message: 'Pengguna sudah wujud' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = {
            _id: Date.now().toString(),
            name,
            email,
            password: hashedPassword,
            role: 'user'
        };
        saveLocalUser(newUser);

        return res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            token: generateToken(newUser._id),
        });
    }
  } catch (error) {
    res.status(500).json({ message: 'Ralat pendaftaran', error: error.message });
  }
});

export default router;
