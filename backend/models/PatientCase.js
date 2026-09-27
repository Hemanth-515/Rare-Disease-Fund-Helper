import mongoose from 'mongoose';
const patientCaseSchema = new mongoose.Schema({
  patientName: { type: String, required: true, trim: true, maxlength: 100 },
  patientPhoto: String,
  dateOfBirth: { type: Date, required: true },
  age: { type: Number, min: 0, max: 120 },
  gender: String,
  disease: { type: String, required: true, trim: true },
  diseaseDescription: { type: String, required: true, maxlength: 1200 },
  diagnosisDetails: { type: String, maxlength: 1500 },
  treatmentRequired: { type: String, required: true },
  treatmentDescription: { type: String, maxlength: 1500 },
  hospitalName: { type: String, required: true },
  location: { type: String, required: true },
  amountRequired: { type: Number, required: true, min: 1 },
  amountRaised: { type: Number, default: 0, min: 0 },
  remainingAmount: { type: Number, required: true, min: 0 },
  upiId: { type: String, required: true },
  qrCode: String,
  paymentInstructions: String,
  medicalDocuments: [{ path: String, originalName: String, public: { type: Boolean, default: false } }],
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
  verificationStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Approved', index: true },
  fundraisingStatus: { type: String, enum: ['Active', 'Completed', 'Deactivated'], default: 'Active', index: true },
  duplicateKey: { type: String, required: true }
}, { timestamps: true });
patientCaseSchema.index({ duplicateKey: 1, fundraisingStatus: 1 }, { unique: true, partialFilterExpression: { fundraisingStatus: 'Active' } });
patientCaseSchema.index({ disease: 1, location: 1, createdAt: -1 });
export default mongoose.model('PatientCase', patientCaseSchema);
