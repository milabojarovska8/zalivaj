export class HttpError extends Error {
  constructor(status, message, fields) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

export const badRequest = (message, fields) => new HttpError(400, message, fields);
export const unauthorized = (message = 'Niste prijavljeni') => new HttpError(401, message);
export const forbidden = (message = 'Ni pravic') => new HttpError(403, message);
export const notFound = (message = 'Ne obstaja') => new HttpError(404, message);
export const conflict = (message) => new HttpError(409, message);
