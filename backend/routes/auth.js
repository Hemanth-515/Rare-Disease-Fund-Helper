import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import Doctor from '../models/Doctor.js';
import Donor from '../models/Donor.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { signToken, safeDoctor, safeDonor } from '../utils.js';
const router = Router();
const pass = z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/, 'Password needs an uppercase letter').regex(/[a-z]/, 'Password needs a lowercase letter').regex(/[0-9]/, 'Password needs a number');
const email = z.string().email();
const phone = z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number');
const valid = (schema, body) => { const out = schema.safeParse(body); if (!out.success) { const e = new Error(out.error.issues[0].message); e.status = 400; throw e; } return out.data; };
router.post('/doctor/register', upload.fields([{ name: 'registrationCertificate', maxCount: 1 }, { name: 'hospitalProof', maxCount: 1 }]), async (req, res, next) => {
 try {
  const data = valid(z.object({ name:z.string().min(2), medicalRegistrationNumber:z.string().min(3), hospitalName:z.string().min(2), hospitalAddress:z.string().min(5), specialization:z.string().min(2), email, phone, password:pass }), req.body);
  if (data.password !== req.body.confirmPassword) return res.status(400).json({ message: 'Passwords do not match.' });
  const exists = await Doctor.findOne({ $or: [{ email: data.email.toLowerCase() }, { phone: data.phone }, { medicalRegistrationNumber: data.medicalRegistrationNumber.toUpperCase() }] });
  if (exists) return res.status(409).json({ message: 'Email, phone number, or medical registration number already exists.' });
  const files = req.files || {};
  const doctor = await Doctor.create({ ...data, email: data.email.toLowerCase(), passwordHash: await bcrypt.hash(data.password, 12), registrationCertificate: files.registrationCertificate?.[0]?.filename, hospitalProof: files.hospitalProof?.[0]?.filename });
  res.status(201).json({ message: 'Registration received. Your account is pending verification.', user: safeDoctor(doctor) });
 } catch(e) { next(e); }
});
router.post('/doctor/login', async (req,res,next) => {
 try { const { identifier, password } = valid(z.object({ identifier:z.string().min(1), password:z.string().min(1) }), req.body); const doctor=await Doctor.findOne({ $or:[{ email:identifier.toLowerCase() },{ medicalRegistrationNumber:identifier.toUpperCase() }] }).select('+passwordHash'); if(!doctor || !await bcrypt.compare(password,doctor.passwordHash)) return res.status(401).json({message:'Invalid email or password.'}); if(doctor.verificationStatus==='Rejected') return res.status(403).json({message:'Your doctor application was rejected. Contact support.'}); res.json({token:signToken(doctor,'DOCTOR'),role:'DOCTOR',user:safeDoctor(doctor)}); } catch(e){next(e);} });
router.post('/donor/register', async(req,res,next)=>{ try {const d=valid(z.object({name:z.string().min(2),email,phone,password:pass,city:z.string().optional(),state:z.string().optional()}),req.body); if(d.password!==req.body.confirmPassword)return res.status(400).json({message:'Passwords do not match.'}); if(await Donor.findOne({$or:[{email:d.email.toLowerCase()},{phone:d.phone}]}))return res.status(409).json({message:'Email or phone number already registered.'}); const user=await Donor.create({...d,email:d.email.toLowerCase(),passwordHash:await bcrypt.hash(d.password,12)}); res.status(201).json({token:signToken(user,'DONOR'),role:'DONOR',user:safeDonor(user)}); }catch(e){next(e);} });
router.post('/donor/login', async(req,res,next)=>{ try {const d=valid(z.object({email,password:z.string().min(1)}),req.body);const user=await Donor.findOne({email:d.email.toLowerCase()}).select('+passwordHash');if(!user||!await bcrypt.compare(d.password,user.passwordHash))return res.status(401).json({message:'Invalid email or password.'});res.json({token:signToken(user,'DONOR'),role:'DONOR',user:safeDonor(user)});}catch(e){next(e);} });
router.get('/me', authenticate, (req,res)=>res.json({role:req.role,user:req.role==='DOCTOR'?safeDoctor(req.user):req.user}));
export default router;
