import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
export const signToken = (user, role) => jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
export const hashPassword = password => bcrypt.hash(password, 12);
export const comparePassword = (password, hash) => bcrypt.compare(password, hash);
export const safeDoctor = doctor => ({ id: doctor._id, name: doctor.name, email: doctor.email, phone: doctor.phone, specialization: doctor.specialization, hospitalName: doctor.hospitalName, hospitalAddress: doctor.hospitalAddress, medicalRegistrationNumber: doctor.medicalRegistrationNumber, verificationStatus: doctor.verificationStatus });
export const safeDonor = donor => ({ id: donor._id, name: donor.name, email: donor.email, phone: donor.phone, city: donor.city, state: donor.state });
