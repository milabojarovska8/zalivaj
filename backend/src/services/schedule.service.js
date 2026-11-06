import { addDays } from 'date-fns';
import { utc } from '@date-fns/utc';

/**
 * Ustvari urnik zalivanja (US-07): za vsako rastlino opravilo na začetni datum
 * in nato vsakih N dni (N = pogostost zalivanja), vse do vključno končnega datuma.
 *
 * Primer: 1.–10. 11., bazilika na 2 dni → 1., 3., 5., 7., 9. 11.; monstera na 7 dni → 1. in 8. 11.
 *
 * Računamo v UTC, da prehod na poletni ali zimski čas ne premakne datumov.
 */
export function generateSchedule(startDate, endDate, plants) {
  const tasks = [];
  for (const plant of plants) {
    for (let day = startDate; day <= endDate; day = addDays(day, plant.wateringEveryDays, { in: utc })) {
      tasks.push({ plantId: plant.id, dueDate: new Date(day) });
    }
  }
  return tasks.sort((a, b) => a.dueDate - b.dueDate);
}
