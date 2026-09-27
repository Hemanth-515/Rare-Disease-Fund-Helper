import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = ['medicalDocuments', 'registrationCertificate', 'hospitalProof'].includes(file.fieldname)
      ? resolve(here, '../uploads-private') : resolve(here, '../uploads');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => cb(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`)
});
const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);
export const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024, files: 8 }, fileFilter: (_req, file, cb) => {
  if (!allowed.has(file.mimetype)) return cb(new Error('File type is not supported. Use JPG, PNG, WebP, or PDF.'));
  cb(null, true);
} });
