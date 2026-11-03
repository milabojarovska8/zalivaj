import { config } from '../config.js';

// Datumi brez časa se v bazi hranijo kot DATE, v API pa kot niz "YYYY-MM-DD".
export const toDate = (str) => new Date(`${str}T00:00:00.000Z`);
export const toDateStr = (date) => date.toISOString().slice(0, 10);

// Današnji datum v časovnem pasu aplikacije (Europe/Ljubljana).
export function todayStr() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: config.timezone }).format(new Date());
}
