import React from 'react';
import { X, History, FileSpreadsheet, Trash2, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { CountingSession } from '../types/counter';
import { generateExcelWorkbook } from '../utils/excelExport';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: CountingSession[];
  currentSessionId: string;
  onLoadSession: (session: CountingSession) => void;
  onDeleteSession: (id: string) => void;
  highSunMode: boolean;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  currentSessionId,
  onLoadSession,
  onDeleteSession,
  highSunMode,
}) => {
  if (!isOpen) return null;

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

        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Historial de Conteos Guardados</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {history.length} sesiones registradas en este dispositivo
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

        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
                No hay sesiones guardadas en el historial
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                A medida que realices y guardes conteos en manga o potrero, quedarán archivados aquí para descargar su Excel en cualquier momento.
              </p>
            </div>
          ) : (
            history.map(session => {
              const totalVacunos = session.categories.reduce((acc, c) => acc + c.count, 0);
              const totalOtros = session.otherItems.reduce((acc, i) => acc + i.quantity, 0);
              const total = totalVacunos + totalOtros;
              const isCurrent = session.id === currentSessionId;

              return (
                <div
                  key={session.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500'
                      : highSunMode
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-slate-800/70 border-slate-700 text-slate-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base">
                          {session.campo ? `${session.campo} - ` : ''}
                          {session.potrero || session.sessionName}
                        </h3>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                            En curso
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {session.fecha}
                        </span>
                        {session.operador && (
                          <>
                            <span>·</span>
                            <span>Op: {session.operador}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-extrabold font-mono tabular-nums text-emerald-500">
                        {total}
                      </div>
                      <div className="text-[10px] text-slate-400">cabezas</div>
                    </div>
                  </div>

                  {/* Badges breakdown */}
                  <div className="flex flex-wrap gap-1.5 mb-3 text-xs">
                    {session.categories.filter(c => c.count > 0).map(c => (
                      <span
                        key={c.id}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        {c.name}: <strong>{c.count}</strong>
                      </span>
                    ))}
                    {totalOtros > 0 && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-medium">
                        Novedades: <strong>{totalOtros}</strong>
                      </span>
                    )}
                  </div>

                  {/* Actions for this session */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => generateExcelWorkbook(session)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 transition-colors"
                      title="Descargar archivo Excel de esta sesión"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Descargar Excel</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {!isCurrent && (
                        <button
                          type="button"
                          onClick={() => {
                            onLoadSession(session);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white transition-colors"
                        >
                          Cargar Conteo
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onDeleteSession(session.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Borrar del historial"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`min-h-[44px] px-6 py-2 rounded-xl text-sm font-semibold transition-colors ${
              highSunMode
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
