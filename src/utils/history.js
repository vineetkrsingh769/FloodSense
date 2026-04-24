const KEY = 'floodsense_history';

export function getHistory() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

export function saveToHistory(entry) {
  const h = getHistory();
  h.unshift({ id: Date.now(), date: new Date().toLocaleString(), ...entry });
  localStorage.setItem(KEY, JSON.stringify(h.slice(0, 100)));
}

export function deleteFromHistory(id) {
  const h = getHistory().filter(x => x.id !== id);
  localStorage.setItem(KEY, JSON.stringify(h));
}

export function clearHistory() {
  localStorage.removeItem(KEY);
}

export function getAnalysisCount() {
  return parseInt(localStorage.getItem('fs_total') || '1247');
}

export function incrementAnalysisCount() {
  const n = getAnalysisCount() + 1;
  localStorage.setItem('fs_total', n);
  return n;
}
