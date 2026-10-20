import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Category } from '../types/counter';

interface CategoryCardProps {
  category: Category;
  totalHerd: number;
  onIncrement: (id: string, amount: number) => void;
  onDecrement: (id: string) => void;
  highSunMode: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  totalHerd,
  onIncrement,
  onDecrement,
  highSunMode,
}) => {
  const percentage = totalHerd > 0 ? ((category.count / totalHerd) * 100).toFixed(1) : '0.0';

  // Palette styling according to category color
  const colorStyles: Record<string, { bg: string; text: string; ring: string; bar: string; badge: string }> = {
    emerald: {
      bg: highSunMode ? 'bg-white' : 'bg-emerald-950/20 hover:bg-emerald-950/30',
      text: 'text-emerald-800 dark:text-emerald-300',
      ring: 'border-emerald-600/30 dark:border-emerald-500/30',
      bar: 'bg-emerald-600',
      badge: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200',
    },
    teal: {
      bg: highSunMode ? 'bg-white' : 'bg-teal-950/20 hover:bg-teal-950/30',
      text: 'text-teal-800 dark:text-teal-300',
      ring: 'border-teal-600/30 dark:border-teal-500/30',
      bar: 'bg-teal-600',
      badge: 'bg-teal-100 text-teal-900 dark:bg-teal-900/60 dark:text-teal-200',
    },
    blue: {
      bg: highSunMode ? 'bg-white' : 'bg-blue-950/20 hover:bg-blue-950/30',
      text: 'text-blue-800 dark:text-blue-300',
      ring: 'border-blue-600/30 dark:border-blue-500/30',
      bar: 'bg-blue-600',
      badge: 'bg-blue-100 text-blue-900 dark:bg-blue-900/60 dark:text-blue-200',
    },
    cyan: {
      bg: highSunMode ? 'bg-white' : 'bg-cyan-950/20 hover:bg-cyan-950/30',
      text: 'text-cyan-800 dark:text-cyan-300',
      ring: 'border-cyan-600/30 dark:border-cyan-500/30',
      bar: 'bg-cyan-600',
      badge: 'bg-cyan-100 text-cyan-900 dark:bg-cyan-900/60 dark:text-cyan-200',
    },
    purple: {
      bg: highSunMode ? 'bg-white' : 'bg-purple-950/20 hover:bg-purple-950/30',
      text: 'text-purple-800 dark:text-purple-300',
      ring: 'border-purple-600/30 dark:border-purple-500/30',
      bar: 'bg-purple-600',
      badge: 'bg-purple-100 text-purple-900 dark:bg-purple-900/60 dark:text-purple-200',
    },
    amber: {
      bg: highSunMode ? 'bg-white' : 'bg-amber-950/20 hover:bg-amber-950/30',
      text: 'text-amber-800 dark:text-amber-300',
      ring: 'border-amber-600/30 dark:border-amber-500/30',
      bar: 'bg-amber-600',
      badge: 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200',
    },
  };

  const style = colorStyles[category.color] || colorStyles.emerald;

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-150 shadow-sm overflow-hidden flex flex-col justify-between ${
        highSunMode
          ? 'bg-white border-2 border-slate-900 text-slate-950 shadow-md'
          : 'bg-slate-900/90 border-slate-800 text-white hover:border-slate-700'
      }`}
    >
      {/* Top Card Info Bar */}
      <div className="p-3.5 pb-2 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`text-base font-bold truncate ${highSunMode ? 'text-slate-950' : 'text-slate-100'}`}>
              {category.name}
            </h3>
            {category.isCustom && (
              <span className="text-[10px] uppercase font-semibold text-amber-600 dark:text-amber-400">
                Personalizado
              </span>
            )}
          </div>
          {category.subtext && (
            <p className={`text-xs truncate ${highSunMode ? 'text-slate-600' : 'text-slate-400'}`}>
              {category.subtext}
            </p>
          )}
        </div>

        {/* Percentage of herd */}
        <div className="text-right shrink-0">
          <span className={`text-xs font-mono font-medium ${highSunMode ? 'text-slate-700' : 'text-slate-400'}`}>
            {percentage}%
          </span>
        </div>
      </div>

      {/* Primary Tapping Area: Extra Large Touch Target for manga / field work */}
      <button
        type="button"
        onClick={() => onIncrement(category.id, 1)}
        className={`w-full py-5 px-4 flex items-center justify-between transition-transform active:scale-[0.98] cursor-pointer select-none ${
          highSunMode
            ? 'bg-slate-100 hover:bg-slate-200 active:bg-slate-300'
            : 'bg-slate-800/80 hover:bg-slate-800 active:bg-slate-700'
        }`}
        aria-label={`Contar 1 ${category.name}`}
      >
        <div className="flex items-baseline gap-2">
          <span
            className={`text-5xl font-extrabold tracking-tight tabular-nums ${
              highSunMode ? 'text-slate-950' : 'text-white'
            }`}
          >
            {category.count}
          </span>
          <span className={`text-xs uppercase font-semibold tracking-wider ${highSunMode ? 'text-slate-500' : 'text-slate-400'}`}>
            cabezas
          </span>
        </div>

        {/* Big +1 Touch Button visual aid */}
        <div
          className={`h-14 w-14 rounded-xl flex items-center justify-center font-bold text-xl shadow-md transition-all active:scale-95 ${
            highSunMode
              ? 'bg-emerald-600 text-white active:bg-emerald-700'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white active:bg-emerald-700'
          }`}
        >
          +1
        </div>
      </button>

      {/* Progress mini bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1">
        <div
          className={`h-full transition-all duration-300 ${style.bar}`}
          style={{ width: `${Math.min(100, Math.max(0, Number(percentage)))}%` }}
        />
      </div>

      {/* Quick Burst & Decrement Action Row */}
      <div
        className={`px-3 py-2 flex items-center justify-between border-t gap-2 ${
          highSunMode
            ? 'bg-white border-slate-200'
            : 'bg-slate-900 border-slate-800/80'
        }`}
      >
        {/* Decrement Button */}
        <button
          type="button"
          onClick={() => onDecrement(category.id)}
          disabled={category.count <= 0}
          className={`min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
            highSunMode
              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              : 'bg-rose-950/40 text-rose-300 hover:bg-rose-900/50 border border-rose-800/40'
          }`}
          title="Restar 1 (en caso de error)"
          aria-label={`Restar 1 a ${category.name}`}
        >
          <Minus className="w-3.5 h-3.5" />
          <span>-1</span>
        </button>

        {/* Quick Multiplier Buttons (+5, +10) */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onIncrement(category.id, 5)}
            className={`min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
              highSunMode
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-900 border border-slate-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            aria-label={`Sumar 5 a ${category.name}`}
          >
            +5
          </button>
          <button
            type="button"
            onClick={() => onIncrement(category.id, 10)}
            className={`min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
              highSunMode
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-900 border border-slate-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            aria-label={`Sumar 10 a ${category.name}`}
          >
            +10
          </button>
        </div>
      </div>
    </div>
  );
};
