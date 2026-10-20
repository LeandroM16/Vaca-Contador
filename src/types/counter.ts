export interface Category {
  id: string;
  name: string;
  count: number;
  color: 'emerald' | 'blue' | 'amber' | 'purple' | 'rose' | 'teal' | 'indigo' | 'orange' | 'cyan';
  subtext?: string;
  isCustom?: boolean;
}

export type OtherClassification = 
  | 'Vacuno ajeno / de vecino'
  | 'Sin marca / Sin caravana'
  | 'Sanitario / Lesionado'
  | 'Preñada / Fuera de lote'
  | 'Descarte / Refugo'
  | 'Otra observación vacuna';

export interface OtherItem {
  id: string;
  timestamp: number;
  timeFormatted: string;
  animalName: string;
  observation: string;
  quantity: number;
  classification: OtherClassification;
  potrero?: string;
  caravana?: string;
}

export interface CountingSession {
  id: string;
  sessionName: string;
  campo: string;
  potrero: string;
  operador: string;
  fecha: string;
  createdAt: number;
  updatedAt: number;
  categories: Category[];
  otherItems: OtherItem[];
  notes?: string;
}

export interface ActionLog {
  id: string;
  type: 'increment' | 'decrement' | 'other_add' | 'other_remove' | 'reset';
  categoryId?: string;
  categoryName?: string;
  otherItem?: OtherItem;
  delta?: number;
  timestamp: number;
  description: string;
}
