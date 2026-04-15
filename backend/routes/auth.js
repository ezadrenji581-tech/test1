import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { findUserByEmail, createUser, updateUser } from '../lib/db.js';

const router = express.Router();

const getGoogleClient = () => {
    const id = process.env.GOOGLE_CLIENT_ID;
    if (!id) {
        console.error('CRITICAL: GOOGLE_CLIENT_ID is not defined in environment variables!');
    }
    return new OAuth2Client(id);
};

const isMongoConnected = () => mongoose.connection.readyState === 1;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret', {
    expiresIn: '30d',
  });
};

router.post('/google-login', async (req, res) => {
  try {
    const { token } = req.body;
    const client = getGoogleClient();
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, sub: googleId } = ticket.getPayload();
    let user;

    if (isMongoConnected()) {
        user = await User.findOne({ email });
        if (!user) {
          user = await User.create({ name, email, googleId });
        } else if (!user.googleId) {
          user.googleId = googleId;
          await user.save();
        }
    } else {
        user = findUserByEmail(email);
        if (!user) {
          user = createUser({ name, email, googleId });
        } else if (!user.googleId) {
          user = updateUser(user._id, { googleId });
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
    console.error('Google Login Backend Error:', error.message);
    res.status(401).json({ message: 'Log masuk Google gagal di backend', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user;

    if (isMongoConnected()) {
        user = await User.findOne({ email }).select('+password');
        if (user && (await user.matchPassword(password))) {
          return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
          });
        }
    } else {
        user = findUserByEmail(email);
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

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (isMongoConnected()) {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Pengguna sudah wujud' });
        const user = await User.create({ name, email, password });
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        const userExists = findUserByEmail(email);
        if (userExists) return res.status(400).json({ message: 'Pengguna sudah wujud' });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = createUser({ name, email, password: hashedPassword });
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
