import React, { useState, useEffect } from 'react';
import { X, Check, Plus, Minus, Tag, AlertTriangle } from 'lucide-react';
import { OtherItem, OtherClassification } from '../types/counter';

interface OtherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<OtherItem, 'id' | 'timestamp' | 'timeFormatted'>) => void;
  editingItem?: OtherItem | null;
  highSunMode: boolean;
}

const QUICK_BOVINES = [
  'Vaca',
  'Vaquilla / Vaquillona',
  'Ternera',
  'Ternero',
  'Toro',
  'Novillo',
  'Vaca ajena',
  'Vaca preñada',
  'Ternero guacho',
  'Vaca de descarte',
  'Novillito recría',
  'Vaquilla para entore',
];

const CLASSIFICATIONS: OtherClassification[] = [
  'Vacuno ajeno / de vecino',
  'Sin marca / Sin caravana',
  'Sanitario / Lesionado',
  'Preñada / Fuera de lote',
  'Descarte / Refugo',
  'Otra observación vacuna',
];

const QUICK_OBSERVATIONS = [
  'Esta vaca estaba acá y entró por error desde el potrero vecino',
  'Ternero al pie sin caravana identificatoria',
  'Vaca con renguera / rengo en pata trasera',
  'Vaquilla con marca ajena de otro campo',
  'Separada para tacto / ecografía',
  'Vacuno para tratamiento sanitario',
];

export const OtherModal: React.FC<OtherModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  highSunMode,
}) => {
  const [animalName, setAnimalName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [classification, setClassification] = useState<OtherClassification>('Vacuno ajeno / de vecino');
  const [caravana, setCaravana] = useState('');
  const [observation, setObservation] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingItem) {
      setAnimalName(editingItem.animalName);
      setQuantity(editingItem.quantity);
      setClassification(editingItem.classification);
      setCaravana(editingItem.caravana || '');
      setObservation(editingItem.observation);
    } else {
      setAnimalName('');
      setQuantity(1);
      setClassification('Vacuno ajeno / de vecino');
      setCaravana('');
      setObservation('');
    }
    setError('');
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!animalName.trim()) {
      setError('Por favor indica la categoría o tipo de vacuno');
      return;
    }

    onSave({
      animalName: animalName.trim(),
      quantity: Math.max(1, quantity),
      classification,
      caravana: caravana.trim() || undefined,
      observation: observation.trim() || 'Sin observación registrada',
    });

    onClose();
  };

  const handleQuickBovineClick = (name: string) => {
    setAnimalName(name);
    if (name.includes('ajen')) {
      setClassification('Vacuno ajeno / de vecino');
    } else if (name.includes('lastimad') || name.includes('reng')) {
      setClassification('Sanitario / Lesionado');
    } else if (name.includes('preñad')) {
      setClassification('Preñada / Fuera de lote');
    } else if (name.includes('descarte')) {
      setClassification('Descarte / Refugo');
    }
  };

  const handleAppendObservation = (snippet: string) => {
    if (!observation) {
      setObservation(snippet);
    } else {
      setObservation(prev => `${prev}. ${snippet}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog Content */}
      <div
        className={`relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl z-10 overflow-hidden ${
          highSunMode
            ? 'bg-white text-slate-950 border-2 border-slate-900'
            : 'bg-slate-900 text-white border border-slate-800'
        }`}
      >
        {/* Top Handle bar for mobile drag affordance */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {editingItem ? 'Editar Registro "Otro"' : 'Registrar Vacuno / Novedad en Manga'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Anota vacunos con observaciones (ajenos, sanitarios, sin caravana, fuera de lote)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Quick Bovine Classification Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Clasificaciones vacunas sugeridas:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_BOVINES.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleQuickBovineClick(item)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                    animalName === item
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : highSunMode
                      ? 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Bovine Category / Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-700 dark:text-slate-300">
              Categoría o concepto vacuno *
            </label>
            <input
              type="text"
              required
              value={animalName}
              onChange={e => {
                setAnimalName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Ej: Vaca con cría, Vaquilla ajena caravana #402, Ternero guacho..."
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                highSunMode
                  ? 'bg-white border-slate-400 text-slate-950 focus:border-amber-600'
                  : 'bg-slate-800 border-slate-700 text-white focus:border-amber-400'
              }`}
            />
          </div>

          {/* Quantity and Caravana in 2 cols */}
          <div className="grid grid-cols-2 gap-3">
            {/* Quantity */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-700 dark:text-slate-300">
                Cantidad de cabezas
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="min-h-[44px] min-w-[44px] rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-95"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className={`w-full text-center py-2 rounded-lg font-mono font-bold text-lg border ${
                    highSunMode
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-slate-800 border-slate-700 text-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="min-h-[44px] min-w-[44px] rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Caravana / Tag */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-700 dark:text-slate-300">
                Caravana / Señal (opcional)
              </label>
              <input
                type="text"
                value={caravana}
                onChange={e => setCaravana(e.target.value)}
                placeholder="Ej: #405, Amarilla, S/M"
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                  highSunMode
                    ? 'bg-white border-slate-400 text-slate-950 focus:border-amber-600'
                    : 'bg-slate-800 border-slate-700 text-white focus:border-amber-400'
                }`}
              />
            </div>
          </div>

          {/* Classification */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-700 dark:text-slate-300">
              Clasificación de la novedad
            </label>
            <select
              value={classification}
              onChange={e => setClassification(e.target.value as OtherClassification)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                highSunMode
                  ? 'bg-white border-slate-400 text-slate-950 focus:border-amber-600'
                  : 'bg-slate-800 border-slate-700 text-white focus:border-amber-400'
              }`}
            >
              {CLASSIFICATIONS.map(cls => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Observation Field (Highlighting the exact requirement requested) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Observación detallada *
              </label>
              <span className="text-[11px] text-slate-500">Se incluirá en el Excel</span>
            </div>
            <textarea
              rows={3}
              value={observation}
              onChange={e => setObservation(e.target.value)}
              placeholder="esta vaca estaba aca y entro por error desde tal lado..."
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors leading-relaxed ${
                highSunMode
                  ? 'bg-white border-slate-400 text-slate-950 focus:border-amber-600 placeholder:text-slate-400'
                  : 'bg-slate-800 border-slate-700 text-white focus:border-amber-400 placeholder:text-slate-500'
              }`}
            />

            {/* Quick observation snippet buttons */}
            <div className="mt-2">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                Agregar frase rápida con un toque:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_OBSERVATIONS.map((snippet, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAppendObservation(snippet)}
                    className="text-[11px] px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 text-left"
                  >
                    + {snippet}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                highSunMode
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-6 py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{editingItem ? 'Guardar Cambios' : 'Registrar en Conteo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
