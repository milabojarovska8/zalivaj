export const STATUS_LABELS = {
  OPEN: 'Odprta',
  ACTIVE: 'Aktivna',
  COMPLETED: 'Zaključena',
  CANCELLED: 'Preklicana',
};

// "2026-11-01" → "1. 11. 2026"
export function formatDate(str) {
  if (!str) return '';
  const [y, m, d] = str.split('-').map(Number);
  return `${d}. ${m}. ${y}`;
}

export function formatRange(start, end) {
  return `${formatDate(start)} – ${formatDate(end)}`;
}

// Današnji datum kot "YYYY-MM-DD" v lokalnem času brskalnika.
export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
