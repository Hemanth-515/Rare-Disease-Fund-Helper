import { Router } from 'express';
import { authenticate, allow } from '../middleware/auth.js';
import { safeDoctor } from '../utils.js';
import PatientCase from '../models/PatientCase.js';
const router=Router();
router.get('/profile',authenticate,allow('DOCTOR'),(req,res)=>res.json({user:safeDoctor(req.user)}));
router.put('/profile',authenticate,allow('DOCTOR'),async(req,res,next)=>{try{const fields=['name','phone','specialization','hospitalName','hospitalAddress'];for(const f of fields)if(req.body[f])req.user[f]=req.body[f];await req.user.save();res.json({user:safeDoctor(req.user)});}catch(e){next(e);}});
router.get('/patients',authenticate,allow('DOCTOR'),async(req,res,next)=>{try{const cases=await PatientCase.find({doctorId:req.user._id,fundraisingStatus:{$ne:'Deactivated'}}).sort({updatedAt:-1});res.json(cases);}catch(e){next(e);}});
export default router;
