import { HttpError } from '../utils/httpError.js';
import { removeUpload } from './upload.js';

export function notFoundHandler(_req, res) {
  res.status(404).json({ error: 'Pot ne obstaja' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  // Če zahteva ni uspela, naložena fotografija ni več potrebna.
  if (req.file) removeUpload(req.file.filename);

  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, fields: err.fields });
  }
  if (err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Fotografija je prevelika (največ 5 MB)', fields: { photo: 'Največ 5 MB' } });
  }
  if (err?.code === 'P2002') {
    return res.status(409).json({ error: 'Zapis že obstaja' });
  }
  if (err?.code === 'P2023' || err?.code === 'P2025') {
    return res.status(404).json({ error: 'Ne obstaja' });
  }
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Neveljaven JSON' });
  }
  console.error(err);
  res.status(500).json({ error: 'Napaka na strežniku' });
}
