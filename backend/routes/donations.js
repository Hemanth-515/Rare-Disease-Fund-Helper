import { Router } from 'express';
import Donation from '../models/Donation.js';
import PatientCase from '../models/PatientCase.js';
import { authenticate, allow } from '../middleware/auth.js';
const router=Router();
router.post('/',authenticate,allow('DONOR'),async(req,res,next)=>{try{const amount=Number(req.body.amount),patientCaseId=req.body.patientCaseId;if(!Number.isFinite(amount)||amount<=0)return res.status(400).json({message:'Donation amount is invalid.'});const c=await PatientCase.findOne({_id:patientCaseId,verificationStatus:'Approved',fundraisingStatus:'Active'});if(!c)return res.status(404).json({message:'This case is not accepting donations.'});if(amount>c.remainingAmount)return res.status(400).json({message:'Donation cannot exceed the remaining fundraising requirement.'});const donation=await Donation.create({donorId:req.user._id,patientCaseId:c._id,amount,paymentStatus:'Pending'});const params=new URLSearchParams({pa:c.upiId,pn:'Rare Disease Fund Helper',am:amount.toFixed(2),cu:'INR',tn:`Donation ${donation._id}`});res.status(201).json({donation,upiLink:`upi://pay?${params}`,message:'Payment initiated. It will remain pending until verified.'});}catch(e){next(e);}});
router.get('/mine',authenticate,allow('DONOR'),async(req,res,next)=>{try{res.json(await Donation.find({donorId:req.user._id}).populate('patientCaseId','patientName disease patientPhoto').sort({createdAt:-1}));}catch(e){next(e);}});
router.get('/:id',authenticate,async(req,res,next)=>{try{const q={_id:req.params.id};if(req.role==='DONOR')q.donorId=req.user._id;const d=await Donation.findOne(q);if(!d)return res.status(404).json({message:'Donation not found.'});res.json(d);}catch(e){next(e);}});
export default router;
