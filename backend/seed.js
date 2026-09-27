import 'dotenv/config';
import bcrypt from 'bcryptjs';
import {connectDB} from './config/db.js';
import Doctor from './models/Doctor.js';
import Donor from './models/Donor.js';
import PatientCase from './models/PatientCase.js';
import Donation from './models/Donation.js';
await connectDB();
await Promise.all([Doctor.deleteMany({}),Donor.deleteMany({}),PatientCase.deleteMany({}),Donation.deleteMany({})]);
const hash=await bcrypt.hash('DemoPass123!',12);
const docs=await Doctor.create([
 {name:'Dr. Asha Menon',email:'asha.doctor@example.com',phone:'9876543201',passwordHash:hash,medicalRegistrationNumber:'DEMO-KA-1001',specialization:'Pediatric Neurology',hospitalName:'Green Valley Children’s Hospital',hospitalAddress:'12 Lake Road, Bengaluru',verificationStatus:'Verified'},
 {name:'Dr. Kabir Rao',email:'kabir.doctor@example.com',phone:'9876543202',passwordHash:hash,medicalRegistrationNumber:'DEMO-MH-1002',specialization:'Genetics',hospitalName:'Harborview Medical Centre',hospitalAddress:'44 Marine Drive, Mumbai',verificationStatus:'Verified'},
 {name:'Dr. Nila Shah',email:'nila.pending@example.com',phone:'9876543203',passwordHash:hash,medicalRegistrationNumber:'DEMO-TN-1003',specialization:'Pediatrics',hospitalName:'Lotus Children’s Clinic',hospitalAddress:'8 Garden Street, Chennai',verificationStatus:'Pending'}
]);
const cases=await PatientCase.create([
 {patientName:'Mira',dateOfBirth:new Date('2018-04-16'),age:8,gender:'Female',disease:'Spinal Muscular Atrophy',diseaseDescription:'Mira is a bright, curious child living with SMA. Her care team has recommended a treatment plan and ongoing rehabilitation.',diagnosisDetails:'Fictional demo data. Confirmed by hospital team.',treatmentRequired:'Gene therapy and rehabilitation',treatmentDescription:'Specialist care, therapy and follow-up treatment recommended by her clinical team.',hospitalName:docs[0].hospitalName,location:'Bengaluru, Karnataka',amountRequired:1800000,amountRaised:745000,remainingAmount:1055000,upiId:'greenvalley@upi',doctorId:docs[0]._id,duplicateKey:'mira|2018-04-16|spinal muscular atrophy|green valley children’s hospital'},
 {patientName:'Arjun',dateOfBirth:new Date('2015-09-03'),age:11,gender:'Male',disease:'Duchenne Muscular Dystrophy',diseaseDescription:'Arjun’s family is seeking support for specialist cardiac care, physiotherapy and ongoing treatment.',diagnosisDetails:'Fictional demo data.',treatmentRequired:'Cardiac care and physiotherapy',treatmentDescription:'A coordinated care plan with regular specialist visits and physical therapy.',hospitalName:docs[1].hospitalName,location:'Mumbai, Maharashtra',amountRequired:950000,amountRaised:320000,remainingAmount:630000,upiId:'harborview@upi',doctorId:docs[1]._id,duplicateKey:'arjun|2015-09-03|duchenne muscular dystrophy|harborview medical centre'},
 {patientName:'Leela',dateOfBirth:new Date('2020-02-22'),age:6,gender:'Female',disease:'Pompe Disease',diseaseDescription:'Leela needs continued enzyme replacement therapy and respiratory monitoring from her specialist team.',diagnosisDetails:'Fictional demo data.',treatmentRequired:'Enzyme replacement therapy',treatmentDescription:'Ongoing therapy and respiratory monitoring as guided by her doctors.',hospitalName:docs[0].hospitalName,location:'Mysuru, Karnataka',amountRequired:620000,amountRaised:620000,remainingAmount:0,upiId:'greenvalley@upi',doctorId:docs[0]._id,duplicateKey:'leela|2020-02-22|pompe disease|green valley children’s hospital',fundraisingStatus:'Completed'},
 {patientName:'Dev',dateOfBirth:new Date('2017-12-01'),age:8,gender:'Male',disease:'Rare metabolic disorder',diseaseDescription:'Dev’s care team is coordinating further specialist evaluation and a treatment plan.',diagnosisDetails:'Fictional demo data.',treatmentRequired:'Specialist evaluation and treatment',treatmentDescription:'Diagnostic review and treatment recommended by the specialist team.',hospitalName:docs[1].hospitalName,location:'Pune, Maharashtra',amountRequired:450000,amountRaised:85000,remainingAmount:365000,upiId:'harborview@upi',doctorId:docs[1]._id,duplicateKey:'dev|2017-12-01|rare metabolic disorder|harborview medical centre'}
]);
const donors=await Donor.create([
 {name:'Ananya Iyer',email:'ananya.donor@example.com',phone:'9876543211',passwordHash:hash,city:'Bengaluru',state:'Karnataka'},
 {name:'Rohan Das',email:'rohan.donor@example.com',phone:'9876543212',passwordHash:hash,city:'Mumbai',state:'Maharashtra'},
 {name:'Meera Joseph',email:'meera.donor@example.com',phone:'9876543213',passwordHash:hash,city:'Chennai',state:'Tamil Nadu'}
]);
await Donation.create([
 {donorId:donors[0]._id,patientCaseId:cases[0]._id,amount:1000,paymentStatus:'Successful',transactionReference:'DEMO-VERIFIED-001'},
 {donorId:donors[1]._id,patientCaseId:cases[1]._id,amount:500,paymentStatus:'Pending'},
 {donorId:donors[2]._id,patientCaseId:cases[2]._id,amount:2500,paymentStatus:'Successful',transactionReference:'DEMO-VERIFIED-002'}
]);
console.log('Fictional demo data created. Admin login uses ADMIN_EMAIL / ADMIN_PASSWORD from .env. All user demo passwords: DemoPass123!');process.exit(0);
