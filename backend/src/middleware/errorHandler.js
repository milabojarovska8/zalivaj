import { HttpError } from '../utils/httpError.js';

export function notFoundHandler(_req, res) {
  res.status(404).json({ error: 'Pot ne obstaja' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, fields: err.fields });
  }
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Neveljaven JSON' });
  }
  console.error(err);
  res.status(500).json({ error: 'Napaka na strežniku' });
}
