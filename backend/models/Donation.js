import mongoose from 'mongoose';
const donationSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true, index: true },
  patientCaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'PatientCase', required: true, index: true },
  amount: { type: Number, required: true, min: 1 },
  transactionReference: { type: String, trim: true },
  paymentStatus: { type: String, enum: ['Pending', 'Successful', 'Failed'], default: 'Pending', index: true }
}, { timestamps: true });
export default mongoose.model('Donation', donationSchema);
