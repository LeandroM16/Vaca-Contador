import React, { useState, useEffect } from 'react';
import { X, Check, MapPin, User, Calendar, FileText } from 'lucide-react';
import { CountingSession } from '../types/counter';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: CountingSession;
  onUpdateSession: (updated: Partial<CountingSession>) => void;
  highSunMode: boolean;
}

export const SessionModal: React.FC<SessionModalProps> = ({
  isOpen,
  onClose,
  session,
  onUpdateSession,
  highSunMode,
}) => {
  const [campo, setCampo] = useState(session.campo);
  const [potrero, setPotrero] = useState(session.potrero);
  const [operador, setOperador] = useState(session.operador);
  const [fecha, setFecha] = useState(session.fecha);
  const [notes, setNotes] = useState(session.notes || '');

  useEffect(() => {
    setCampo(session.campo);
    setPotrero(session.potrero);
    setOperador(session.operador);
    setFecha(session.fecha);
    setNotes(session.notes || '');
  }, [session, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSession({
      campo: campo.trim(),
      potrero: potrero.trim(),
      operador: operador.trim(),
      fecha,
      notes: notes.trim(),
      sessionName: potrero.trim() ? `Conteo ${potrero.trim()}` : 'Conteo en manga',
    });
    onClose();
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
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Datos del Campo y Sesión</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Información que figurará en el encabezado del archivo Excel
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

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-700 dark:text-slate-300">
              Establecimiento / Estancia / Campo
            </label>
            <input
              type="text"
              value={campo}
              onChange={e => setCampo(e.target.value)}
              placeholder="Ej: Estancia La Oriental"
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                highSunMode
                  ? 'bg-white border-slate-400 text-slate-950 focus:border-emerald-600'
                  : 'bg-slate-800 border-slate-700 text-white focus:border-emerald-400'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-700 dark:text-slate-300">
              Potrero / Lote / Manga
            </label>
            <input
              type="text"
              value={potrero}
              onChange={e => setPotrero(e.target.value)}
              placeholder="Ej: Potrero 4 - El Molino"
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                highSunMode
                  ? 'bg-white border-slate-400 text-slate-950 focus:border-emerald-600'
                  : 'bg-slate-800 border-slate-700 text-white focus:border-emerald-400'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-700 dark:text-slate-300">
                Operador / Capataz
              </label>
              <input
                type="text"
                value={operador}
                onChange={e => setOperador(e.target.value)}
                placeholder="Ej: Marcelo Díaz"
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                  highSunMode
                    ? 'bg-white border-slate-400 text-slate-950 focus:border-emerald-600'
                    : 'bg-slate-800 border-slate-700 text-white focus:border-emerald-400'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-700 dark:text-slate-300">
                Fecha del Conteo
              </label>
              <input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                  highSunMode
                    ? 'bg-white border-slate-400 text-slate-950 focus:border-emerald-600'
                    : 'bg-slate-800 border-slate-700 text-white focus:border-emerald-400'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-700 dark:text-slate-300">
              Observaciones Generales de la Sesión
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ej: Apartado para vacunación antiaftosa y caravaneo..."
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                highSunMode
                  ? 'bg-white border-slate-400 text-slate-950 focus:border-emerald-600'
                  : 'bg-slate-800 border-slate-700 text-white focus:border-emerald-400'
              }`}
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
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
              className="min-h-[44px] px-5 py-2 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Datos</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
