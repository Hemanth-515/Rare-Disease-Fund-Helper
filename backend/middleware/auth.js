import jwt from 'jsonwebtoken';
import Doctor from '../models/Doctor.js';
import Donor from '../models/Donor.js';
import mongoose from 'mongoose';

export async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ message: 'Please sign in to continue.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    let user;
    if (payload.role === 'DOCTOR') user = await Doctor.findById(payload.id);
    else if (payload.role === 'DONOR') user = await Donor.findById(payload.id);
    else if (payload.role === 'ADMIN') user = { _id: payload.id, role: 'ADMIN', name: 'Admin' };
    if (!user) return res.status(401).json({ message: 'Your session is no longer valid.' });
    req.user = user; req.role = payload.role; next();
  } catch { return res.status(401).json({ message: 'Invalid or expired session.' }); }
}
export const allow = (...roles) => (req, res, next) => roles.includes(req.role) ? next() : res.status(403).json({ message: 'You are not authorized to perform this action.' });
export const isObjectId = value => mongoose.isValidObjectId(value);
