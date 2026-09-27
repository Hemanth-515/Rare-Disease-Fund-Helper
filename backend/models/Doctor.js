import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  medicalRegistrationNumber: { type: String, required: true, unique: true, trim: true, uppercase: true },
  specialization: { type: String, required: true, trim: true },
  hospitalName: { type: String, required: true, trim: true },
  hospitalAddress: { type: String, required: true, trim: true },
  registrationCertificate: String,
  hospitalProof: String,
  verificationStatus: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('Doctor', doctorSchema);
