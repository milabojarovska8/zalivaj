import { notFound } from '../utils/httpError.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// router.param('id', checkId) – neveljaven id vrne 404 namesto napake baze.
export function checkId(_req, _res, next, id) {
  if (!UUID.test(id)) return next(notFound());
  next();
}
