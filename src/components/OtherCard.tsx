import React from 'react';
import { PlusCircle, FileText, AlertCircle, ChevronRight } from 'lucide-react';
import { OtherItem } from '../types/counter';

interface OtherCardProps {
  otherItems: OtherItem[];
  onOpenModal: () => void;
  onViewList: () => void;
  highSunMode: boolean;
}

export const OtherCard: React.FC<OtherCardProps> = ({
  otherItems,
  onOpenModal,
  onViewList,
  highSunMode,
}) => {
  const totalCount = otherItems.reduce((acc, item) => acc + item.quantity, 0);
  const itemsCount = otherItems.length;

  return (
    <div
      className={`rounded-2xl border-2 transition-all duration-150 overflow-hidden flex flex-col justify-between shadow-sm ${
        highSunMode
          ? 'bg-amber-50/80 border-amber-500 text-slate-950 shadow-md'
          : 'bg-amber-950/20 border-amber-500/40 text-amber-100 hover:border-amber-400/60'
      }`}
    >
      {/* Top Header */}
      <div className="p-3.5 pb-2 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-500/20 text-amber-500 dark:text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </span>
            <h3 className={`text-base font-bold truncate ${highSunMode ? 'text-amber-950' : 'text-amber-200'}`}>
              Otro Vacuno / Novedades
            </h3>
          </div>
          <p className={`text-xs mt-0.5 ${highSunMode ? 'text-amber-900/80' : 'text-amber-300/80'}`}>
            Vacunos ajenos, sin caravana, sanitarios o con observaciones
          </p>
        </div>

        {/* Counter Badge */}
        <div className="text-right shrink-0">
          <span
            className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
              highSunMode
                ? 'bg-amber-200 text-amber-950'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            {itemsCount} {itemsCount === 1 ? 'registro' : 'registros'}
          </span>
        </div>
      </div>

      {/* Main Touch Area: Big Button to open Modal */}
      <button
        type="button"
        onClick={onOpenModal}
        className={`w-full py-5 px-4 flex items-center justify-between transition-transform active:scale-[0.98] cursor-pointer select-none ${
          highSunMode
            ? 'bg-amber-100/70 hover:bg-amber-200/80 active:bg-amber-300'
            : 'bg-amber-950/40 hover:bg-amber-900/40 active:bg-amber-900/60'
        }`}
        aria-label="Registrar observación o novedad vacuna en la manga"
      >
        <div className="flex items-baseline gap-2">
          <span
            className={`text-5xl font-extrabold tracking-tight tabular-nums ${
              highSunMode ? 'text-amber-950' : 'text-amber-300'
            }`}
          >
            {totalCount}
          </span>
          <span className={`text-xs uppercase font-semibold tracking-wider ${highSunMode ? 'text-amber-800' : 'text-amber-400/80'}`}>
            vacunos
          </span>
        </div>

        {/* Action Button Label */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition-all active:scale-95">
          <PlusCircle className="w-5 h-5 text-slate-950" />
          <span>Anotar Novedad</span>
        </div>
      </button>

      {/* Bottom bar with view list action */}
      <div
        className={`px-3 py-2 flex items-center justify-between border-t gap-2 ${
          highSunMode
            ? 'bg-amber-100/40 border-amber-300'
            : 'bg-amber-950/50 border-amber-500/20'
        }`}
      >
        <span className={`text-xs truncate ${highSunMode ? 'text-slate-700' : 'text-slate-400'}`}>
          {itemsCount > 0 ? `Último: ${otherItems[otherItems.length - 1].animalName}` : 'Sin notas registradas'}
        </span>

        {itemsCount > 0 && (
          <button
            type="button"
            onClick={onViewList}
            className={`min-h-[44px] px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors ${
              highSunMode
                ? 'text-amber-950 hover:bg-amber-200/60'
                : 'text-amber-300 hover:bg-amber-500/20'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ver listado ({itemsCount})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
