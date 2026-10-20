import React from 'react';
import { X, Trash2, Edit2, AlertCircle, Clock, Plus, Tag } from 'lucide-react';
import { OtherItem } from '../types/counter';

interface OtherListModalProps {
  isOpen: boolean;
  onClose: () => void;
  otherItems: OtherItem[];
  onAddNew: () => void;
  onEdit: (item: OtherItem) => void;
  onDelete: (id: string) => void;
  highSunMode: boolean;
}

export const OtherListModal: React.FC<OtherListModalProps> = ({
  isOpen,
  onClose,
  otherItems,
  onAddNew,
  onEdit,
  onDelete,
  highSunMode,
}) => {
  if (!isOpen) return null;

  const totalQuantity = otherItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className={`relative w-full max-w-xl rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl z-10 overflow-hidden ${
          highSunMode
            ? 'bg-white text-slate-950 border-2 border-slate-900'
            : 'bg-slate-900 text-white border border-slate-800'
        }`}
      >
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Listado de Novedades y Observaciones Vacunas</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {otherItems.length} registros · Total: {totalQuantity} cabezas
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

        {/* Content list */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {otherItems.length === 0 ? (
            <div className="text-center py-10 px-4">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
                No hay vacunos con novedades registradas
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Puedes registrar vacunos con situaciones especiales (vacas o toros ajenos de vecinos, animales sin caravana, sanitarios o preñadas fuera de lote).
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAddNew();
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs inline-flex items-center gap-2 hover:bg-amber-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Vacuno con Novedad</span>
              </button>
            </div>
          ) : (
            otherItems.map((item, idx) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  highSunMode
                    ? 'bg-amber-50/50 border-amber-300 text-slate-950'
                    : 'bg-slate-800/80 border-slate-700 text-slate-100'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
                      #{idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {item.animalName}
                    </h3>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                      x{item.quantity} {item.quantity === 1 ? 'cab.' : 'cabs.'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                      title="Editar registro"
                      aria-label="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 transition-colors"
                      title="Eliminar registro"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {item.timeFormatted}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    {item.classification}
                  </span>
                  {item.caravana && (
                    <>
                      <span>·</span>
                      <span>Caravana: <strong className="text-slate-800 dark:text-slate-200">{item.caravana}</strong></span>
                    </>
                  )}
                </div>

                {/* Detailed Observation */}
                <div className="text-xs p-2.5 rounded-lg bg-black/5 dark:bg-black/30 border border-black/5 dark:border-white/5 italic text-slate-700 dark:text-slate-300">
                  "{item.observation}"
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              highSunMode
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Cerrar
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onAddNew();
            }}
            className="min-h-[44px] px-4 py-2 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Vacuno con Nota</span>
          </button>
        </div>
      </div>
    </div>
  );
};
