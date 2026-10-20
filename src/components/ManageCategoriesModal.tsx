import React, { useState } from 'react';
import { X, Plus, Trash2, Check, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Category } from '../types/counter';

interface ManageCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSaveCategories: (categories: Category[]) => void;
  highSunMode: boolean;
}

const COLOR_OPTIONS: Category['color'][] = [
  'emerald',
  'teal',
  'blue',
  'cyan',
  'purple',
  'amber',
  'rose',
  'indigo',
];

const PRESET_CATEGORIES = [
  { name: 'Vaquillonas preñadas', subtext: 'Confirmadas por tacto/eco' },
  { name: 'Vaquillas para entore', subtext: '15-18 meses' },
  { name: 'Vacas con cría al pie', subtext: 'Madre con ternero' },
  { name: 'Vacas secas / vacías', subtext: 'Sin ternero' },
  { name: 'Terneros destete precoz', subtext: 'Recría temprana' },
  { name: 'Novillitos de recría', subtext: '1 a 2 años' },
  { name: 'Toritos de reposición', subtext: 'Futuros reproductores' },
  { name: 'Vacas de descarte / conserva', subtext: 'Para refugo o faena' },
];

export const ManageCategoriesModal: React.FC<ManageCategoriesModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSaveCategories,
  highSunMode,
}) => {
  const [items, setItems] = useState<Category[]>(categories);
  const [newName, setNewName] = useState('');
  const [newSubtext, setNewSubtext] = useState('');
  const [selectedColor, setSelectedColor] = useState<Category['color']>('emerald');

  if (!isOpen) return null;

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newCat: Category = {
      id: 'cat_' + Date.now(),
      name: newName.trim(),
      subtext: newSubtext.trim() || undefined,
      count: 0,
      color: selectedColor,
      isCustom: true,
    };

    const updated = [...items, newCat];
    setItems(updated);
    onSaveCategories(updated);
    setNewName('');
    setNewSubtext('');
  };

  const handleAddPreset = (preset: { name: string; subtext: string }) => {
    if (items.some(c => c.name.toLowerCase() === preset.name.toLowerCase())) return;

    const newCat: Category = {
      id: 'cat_' + Date.now(),
      name: preset.name,
      subtext: preset.subtext,
      count: 0,
      color: COLOR_OPTIONS[Math.floor(Math.random() * COLOR_OPTIONS.length)],
      isCustom: true,
    };

    const updated = [...items, newCat];
    setItems(updated);
    onSaveCategories(updated);
  };

  const handleDelete = (id: string) => {
    if (items.length <= 1) return;
    const updated = items.filter(c => c.id !== id);
    setItems(updated);
    onSaveCategories(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const copy = [...items];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    setItems(copy);
    onSaveCategories(copy);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className={`relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl z-10 overflow-hidden ${
          highSunMode
            ? 'bg-white text-slate-950 border-2 border-slate-900'
            : 'bg-slate-900 text-white border border-slate-800'
        }`}
      >
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden" />

        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Configurar Opciones / Categorías Vacunas</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Agrega, edita o quita categorías vacunas para tu conteo en manga
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Add New Category Form */}
          <form onSubmit={handleAddCategory} className="p-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Crear Nueva Categoría Vacuna
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Nombre (ej: Vacas preñadas)"
                className={`px-3 py-2 text-xs rounded-lg border focus:outline-none ${
                  highSunMode
                    ? 'bg-white border-slate-300 text-slate-950'
                    : 'bg-slate-800 border-slate-700 text-white'
                }`}
              />
              <input
                type="text"
                value={newSubtext}
                onChange={e => setNewSubtext(e.target.value)}
                placeholder="Detalle opcional (ej: Lote 1)"
                className={`px-3 py-2 text-xs rounded-lg border focus:outline-none ${
                  highSunMode
                    ? 'bg-white border-slate-300 text-slate-950'
                    : 'bg-slate-800 border-slate-700 text-white'
                }`}
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500">Color:</span>
                <div className="flex gap-1">
                  {COLOR_OPTIONS.slice(0, 5).map(col => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`w-5 h-5 rounded-full transition-transform ${
                        col === 'emerald' ? 'bg-emerald-500' :
                        col === 'teal' ? 'bg-teal-500' :
                        col === 'blue' ? 'bg-blue-500' :
                        col === 'cyan' ? 'bg-cyan-500' :
                        col === 'purple' ? 'bg-purple-500' : 'bg-amber-500'
                      } ${selectedColor === col ? 'ring-2 ring-white scale-110' : 'opacity-60'}`}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </button>
            </div>
          </form>

          {/* Preset Suggestions */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Categorías vacunas comunes sugeridas:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_CATEGORIES.map(pre => (
                <button
                  key={pre.name}
                  type="button"
                  onClick={() => handleAddPreset(pre)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-slate-500" />
                  <span>{pre.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Current Categories List with reordering & deletion */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Categorías Activas ({items.length})
            </h3>
            <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              {items.map((cat, idx) => (
                <div key={cat.id} className="p-3 flex items-center justify-between gap-2 bg-white/5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm truncate">{cat.name}</span>
                      <span className="text-xs font-mono font-bold text-slate-500">
                        ({cat.count} cab.)
                      </span>
                    </div>
                    {cat.subtext && <p className="text-xs text-slate-400 truncate">{cat.subtext}</p>}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Up / Down */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-1 rounded hover:bg-slate-700/50 disabled:opacity-20 text-slate-400"
                      title="Subir"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={idx === items.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-1 rounded hover:bg-slate-700/50 disabled:opacity-20 text-slate-400"
                      title="Bajar"
                    >
                      ▼
                    </button>

                    {/* Delete button (prevent deleting if only 1 left) */}
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id)}
                      disabled={items.length <= 1}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 disabled:opacity-20 ml-1"
                      title="Eliminar categoría"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-6 py-2 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Listo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
