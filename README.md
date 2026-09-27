# Rare Disease Fund Helper

A responsive full-stack prototype connecting verified doctors with donors who want to support rare-disease treatment cases. The application uses React + Vite, Express, MongoDB/Mongoose and JWT sessions. **All seed records are fictional.** UPI is a prototype flow and does not verify bank payments.

## Features

- Separate doctor and donor registration/login, bcrypt password hashing, JWT authentication and role restrictions.
- Admin doctor approval/rejection endpoints; only verified doctors can publish cases.
- Patient case create, edit, deactivate and doctor-only case listing.
- Active-case duplicate prevention using normalized patient name + date of birth + disease + hospital, checked by the API and a partial unique MongoDB index.
- Public approved-case search/filter/sorting, case details and fundraising progress from raised/required amounts.
- UPI deep-link initiation, QR upload support and pending donation records. Only successful/verified payments should contribute to raised totals; this prototype intentionally provides no public payment-verification endpoint.
- Multer uploads (images/PDF, 5 MB per file), rate limited authentication endpoints, Helmet, CORS and MongoDB operator sanitization.
- Mobile responsive pages for landing, case listing/details, donor history and doctor dashboard/case form.

## Stack and folders

```text
rare-disease-fund-helper/
├── backend/                 # Express REST API and Mongoose models
│   ├── config/ models/ routes/ middleware/ uploads/
│   ├── server.js seed.js
│   └── .env.example
├── frontend/                # Vite + React single page app
│   └── src/ components/ context/ services/ App.jsx styles.css
├── package.json
└── README.md
```

## Requirements and setup

- Node.js 20+ and npm
- MongoDB Community Server locally, or a MongoDB Atlas database URI

```bash
cd rare-disease-fund-helper
cp backend/.env.example backend/.env
```

On Windows PowerShell, use `Copy-Item backend/.env.example backend/.env` instead. Edit `backend/.env` and set a long random `JWT_SECRET`, your MongoDB URI, `CLIENT_URL=http://localhost:5173`, and admin email/password. Never commit `.env`.

Install and run both apps from the repository root:

```bash
npm run install:all
npm run dev
```

Or run separately in two terminals:

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173>. API health check: <http://localhost:5000/api/health>. Optional frontend environment variables: `VITE_API_URL` (defaults to `http://localhost:5000/api`) and `VITE_SERVER_URL` (defaults to `http://localhost:5000`).

## Database and demo data

Start MongoDB locally and use `mongodb://127.0.0.1:27017/rare_disease_fund_helper`, or create an Atlas database and put its URI in `MONGODB_URI`. Ensure your Atlas network access and database user are configured.

Create fictional demonstration records:

```bash
cd backend
npm run seed
```

The seed script clears the prototype collections before inserting data. **Do not run it against production or a database containing data you need.** Demo doctors: `asha.doctor@example.com`, `kabir.doctor@example.com`; pending doctor: `nila.pending@example.com`. Demo donors: `ananya.donor@example.com`, `rohan.donor@example.com`, `meera.donor@example.com`. All demo passwords: `DemoPass123!`. Admin credentials are configured using `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`.

## API overview

All routes are prefixed with `/api`; protected routes use `Authorization: Bearer <JWT>`.

| Method | Path | Role | Purpose |
|---|---|---|---|
| POST | `/auth/doctor/register` | Public | Multipart doctor application and verification documents |
| POST | `/auth/doctor/login` | Public | Doctor login via email or registration number |
| POST | `/auth/donor/register` | Public | Donor registration |
| POST | `/auth/donor/login` | Public | Donor login |
| GET | `/auth/me` | Signed in | Current user summary |
| GET/PUT | `/doctors/profile` | Doctor | View/update own profile |
| GET | `/doctors/patients` | Doctor | Own cases |
| GET | `/patients` | Public | Approved patient cases; query `search`, `status`, `sort` |
| GET | `/patients/:id` | Public | Public case details (private diagnosis/docs excluded) |
| POST | `/patients` | Verified doctor | Multipart case creation and duplicate check |
| PUT/DELETE | `/patients/:id` | Owning doctor | Edit/deactivate own case |
| POST | `/donations` | Donor | Create pending donation and return UPI deep link |
| GET | `/donations/mine` | Donor | Own donation records |
| GET | `/donations/:id` | Owner/Admin | Donation status |
| POST | `/admin/login` | Public | Prototype admin login from environment credentials |
| GET | `/admin/doctors/pending` | Admin | Pending doctor applications |
| PUT | `/admin/doctors/:id/verify` or `/reject` | Admin | Set doctor verification status |

Patient multipart fields include `patientPhoto`, `qrCode`, and `medicalDocuments`. The donation endpoint only creates a `Pending` record. Payment status updates must come from a trusted payment verification integration; the client cannot mark a payment successful.

## UPI flow and production payment verification

After a donor chooses an amount, the API validates that amount against the active case's remaining target, stores a `Pending` donation and returns a `upi://pay` URI for the case UPI ID. The browser attempts to open an installed UPI handler; uploaded QR codes are available for scanning. Opening the app is **not** payment confirmation. A production release must replace this prototype handoff with a payment provider that supports signed server-side webhooks or another trusted reconciliation process, verify signatures/idempotency, update donation status on the server, and atomically update raised totals. Never collect a UPI PIN or bank/card credentials.

## Security and business rules

Passwords are hashed; JWT secret, database URI and admin credentials are environment-only. Doctor credentials and case ownership are enforced on the API. Sensitive diagnosis details and medical documents are omitted from public case responses; private files must be served through authenticated authorization if a document-view route is added. Upload files are type/size limited. The seed admin login is intentionally simple and must be replaced with stronger admin identity management for production.

Duplicate identity is normalized name, DOB, disease and hospital. Both a pre-insert API check and MongoDB unique partial index reject active duplicates. Deactivation frees the identity for a later legitimate fundraiser. Amount remaining and progress are bounded at zero and 100% in responses. Only successful donations are intended to count toward raised values; case `amountRaised` is not automatically changed by payment initiation.

## Prototype limitations / production work

- No payment gateway is configured; all UPI initiated donations remain pending until a future trusted verification service is implemented.
- Admin is a single environment credential, not a persisted/admin-managed account.
- Doctor documents use local disk storage; configure private object storage and authenticated signed access before deployment.
- Public case data is limited to fundraising details, but consent, local medical privacy rules, retention/deletion and security review must be addressed before handling real patient data.
- Add email/phone verification, password reset, audit logs, stronger monitoring/backups and deployment-specific CORS/storage configuration.

## License

Prototype for educational use. Do not use seed/demo data to represent real patients.
"# Rare-Disease-Fund-Helper" 
