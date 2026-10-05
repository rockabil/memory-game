const STORAGE_KEY = 'memory-game.leaderboard';
const MAX_ENTRIES = 10;

function readRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
   
    return parsed.filter(
      (entry) =>
        entry &&
        typeof entry === 'object' &&
        Number.isInteger(entry.moves) &&
        entry.moves >= 0 &&
        typeof entry.date === 'string',
    );
  } catch {
    return [];
  }
}

function writeRaw(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {    
  }
}

function compareEntries(a, b) {
  if (a.moves !== b.moves) return a.moves - b.moves;
  return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
}

export function getLeaderboard() {
  return readRaw().sort(compareEntries).slice(0, MAX_ENTRIES);
}

export function addResult(entry) {
  const current = readRaw();
  current.push(entry);

  const updated = current.sort(compareEntries).slice(0, MAX_ENTRIES);

  writeRaw(updated);
  return updated;
}

export function formatDate(isoDate) {
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  return `${day}.${month}.${year}`;
}

export function buildLeaderboardTable(entries) {}