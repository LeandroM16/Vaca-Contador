import { Category, CountingSession, OtherItem } from '../types/counter';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'vacas', name: 'Vacas', count: 0, color: 'emerald', subtext: 'Adultas reproductoras' },
  { id: 'vaquillonas', name: 'Vaquillonas / Vaquillas', count: 0, color: 'teal', subtext: 'Para servicio / recría' },
  { id: 'terneras', name: 'Terneras', count: 0, color: 'cyan', subtext: 'Hembras al pie / destete' },
  { id: 'terneros', name: 'Terneros', count: 0, color: 'blue', subtext: 'Machos al pie / destete' },
  { id: 'toros', name: 'Toros', count: 0, color: 'purple', subtext: 'Reproductores' },
  { id: 'novillos', name: 'Novillos', count: 0, color: 'amber', subtext: 'Invernada / engorde' },
];

const CURRENT_SESSION_KEY = 'contador_ganadero_current_v1';
const HISTORY_KEY = 'contador_ganadero_history_v1';
const PREFERENCES_KEY = 'contador_ganadero_preferences_v1';

export interface UserPreferences {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  highSunMode: boolean; // High-contrast daylight mode for direct sunlight
  stepIncrement: 1 | 5 | 10;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  soundEnabled: true,
  hapticEnabled: true,
  highSunMode: false,
  stepIncrement: 1,
};

export function getTodayDateString(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function createNewSession(campo = '', potrero = '', operador = ''): CountingSession {
  return {
    id: 'ses_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    sessionName: potrero ? `Conteo ${potrero}` : 'Conteo en manga',
    campo,
    potrero,
    operador,
    fecha: getTodayDateString(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    categories: DEFAULT_CATEGORIES.map(c => ({ ...c, count: 0 })),
    otherItems: [],
    notes: '',
  };
}

export function loadCurrentSession(): CountingSession {
  try {
    const raw = localStorage.getItem(CURRENT_SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.categories)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading current session from localStorage:', err);
  }
  return createNewSession();
}

export function saveCurrentSession(session: CountingSession): void {
  try {
    const updated = { ...session, updatedAt: Date.now() };
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving current session to localStorage:', err);
  }
}

export function loadHistory(): CountingSession[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading history:', err);
  }
  return [];
}

export function saveToHistory(session: CountingSession): CountingSession[] {
  try {
    const history = loadHistory();
    const existingIndex = history.findIndex(s => s.id === session.id);
    let updatedHistory: CountingSession[];
    if (existingIndex >= 0) {
      updatedHistory = [...history];
      updatedHistory[existingIndex] = { ...session, updatedAt: Date.now() };
    } else {
      updatedHistory = [{ ...session, updatedAt: Date.now() }, ...history];
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (err) {
    console.error('Error saving to history:', err);
    return loadHistory();
  }
}

export function deleteFromHistory(sessionId: string): CountingSession[] {
  try {
    const history = loadHistory().filter(s => s.id !== sessionId);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return history;
  } catch (err) {
    console.error('Error deleting from history:', err);
    return loadHistory();
  }
}

export function loadPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY);
    if (raw) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error('Error loading preferences:', err);
  }
  return DEFAULT_PREFERENCES;
}

export function savePreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
  } catch (err) {
    console.error('Error saving preferences:', err);
  }
}
