import { badRequest } from '../utils/httpError.js';

// Preveri req.body z Zod shemo. Ob napaki vrne 400 s seznamom napak po poljih.
export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const fields = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join('.') || 'body';
      if (!fields[key]) fields[key] = issue.message;
    }
    return next(badRequest('Podatki niso veljavni', fields));
  }
  req.body = result.data;
  next();
};
