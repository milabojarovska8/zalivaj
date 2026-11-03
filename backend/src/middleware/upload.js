import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import multer from 'multer';
import { badRequest } from '../utils/httpError.js';

export const UPLOAD_DIR = path.resolve('uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (_req, file, cb) => cb(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
});

// Sprejme eno sliko (do 5 MB) v polju "photo".
export const uploadPhoto = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(badRequest('Fotografija mora biti slika', { photo: 'Dovoljene so le slike' }));
    cb(null, true);
  },
}).single('photo');

export function removeUpload(photoUrl) {
  if (!photoUrl) return;
  fs.rm(path.join(UPLOAD_DIR, path.basename(photoUrl)), { force: true }, () => {});
}
