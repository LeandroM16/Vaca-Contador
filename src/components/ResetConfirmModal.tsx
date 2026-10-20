import React from 'react';
import { AlertTriangle, RotateCcw, Save, Trash2, X } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: (saveFirst: boolean) => void;
  hasData: boolean;
  highSunMode: boolean;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
  hasData,
  highSunMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl z-10 overflow-hidden p-6 ${
          highSunMode
            ? 'bg-white text-slate-950 border-2 border-slate-900'
            : 'bg-slate-900 text-white border border-slate-800'
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-500 shrink-0">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">¿Reiniciar o Iniciar Nuevo Conteo?</h3>
            <p className="text-xs text-slate-400 mt-1">
              Esta acción pondrá en 0 los contadores de todas las categorías y vaciará la lista de notas de "Otros".
            </p>
          </div>
        </div>

        <div className="space-y-2.5 mt-6">
          {hasData && (
            <button
              type="button"
              onClick={() => onConfirmReset(true)}
              className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Guardar en Historial y Reiniciar a 0</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onConfirmReset(false)}
            className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-semibold text-sm flex items-center justify-center gap-2 transition-colors border border-rose-500/30"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Reiniciar a 0 sin guardar</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[44px] px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
