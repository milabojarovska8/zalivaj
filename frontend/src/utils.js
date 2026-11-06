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

// Slovenska dvojina in množina: 1 varstvo, 2 varstvi, 3–4 varstva, 5+ varstev
export function plural(n, one, two, few, many) {
  const m = n % 100;
  if (m === 1) return one;
  if (m === 2) return two;
  if (m === 3 || m === 4) return few;
  return many;
}

export function trustLabel(trust) {
  if (!trust || (trust.averageRating == null && trust.completedSittings === 0)) return 'Nov varuh – še brez ocen';
  const n = trust.completedSittings;
  const sittings = `${n} ${plural(n, 'opravljeno varstvo', 'opravljeni varstvi', 'opravljena varstva', 'opravljenih varstev')}`;
  if (trust.averageRating == null) return `še brez ocen · ${sittings}`;
  return `★ ${trust.averageRating.toFixed(1).replace('.', ',')} · ${sittings}`;
}
