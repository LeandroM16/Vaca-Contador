import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Maximize, 
  Minimize, 
  FileSpreadsheet, 
  Settings, 
  MapPin, 
  RotateCcw, 
  History,
  SlidersHorizontal,
  Vibrate,
  VibrateOff
} from 'lucide-react';
import { CountingSession } from '../types/counter';
import { UserPreferences } from '../utils/storage';

interface HeaderProps {
  session: CountingSession;
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  onOpenSessionModal: () => void;
  onOpenCategoriesModal: () => void;
  onOpenSummaryModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenResetModal: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  session,
  preferences,
  onUpdatePreferences,
  onOpenSessionModal,
  onOpenCategoriesModal,
  onOpenSummaryModal,
  onOpenHistoryModal,
  onOpenResetModal,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const totalVacunos = session.categories.reduce((acc, cat) => acc + cat.count, 0);
  const totalOtros = session.otherItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalGeneral = totalVacunos + totalOtros;

  return (
    <header
      className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors ${
        preferences.highSunMode
          ? 'bg-white/95 border-slate-300 text-slate-950 shadow-sm'
          : 'bg-slate-950/90 border-slate-800 text-white'
      }`}
    >
      {/* Top Bar Row */}
      <div className="px-3.5 sm:px-6 py-2.5 flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Left: Brand & Field info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm">
            🐂
          </div>

          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold tracking-tight truncate leading-tight">
              Contador Ganadero
            </h1>
            <button
              type="button"
              onClick={onOpenSessionModal}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-500 flex items-center gap-1 truncate text-left"
            >
              <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
              <span className="truncate">
                {session.campo || session.potrero ? (
                  <>
                    <strong>{session.campo || 'Campo'}</strong> · {session.potrero || 'Potrero'}
                  </>
                ) : (
                  'Configurar Campo / Potrero'
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Right Action Icons & Excel CTA */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => onUpdatePreferences({ soundEnabled: !preferences.soundEnabled })}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-colors ${
              preferences.soundEnabled
                ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'
                : 'text-slate-400 hover:bg-slate-800/40'
            }`}
            title={preferences.soundEnabled ? 'Silenciar clics' : 'Activar sonido de clic'}
            aria-label="Sonido"
          >
            {preferences.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Haptics Toggle */}
          <button
            type="button"
            onClick={() => onUpdatePreferences({ hapticEnabled: !preferences.hapticEnabled })}
            className={`hidden xs:flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl transition-colors ${
              preferences.hapticEnabled
                ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'
                : 'text-slate-400 hover:bg-slate-800/40'
            }`}
            title={preferences.hapticEnabled ? 'Desactivar vibración' : 'Activar vibración háptica'}
            aria-label="Vibración"
          >
            {preferences.hapticEnabled ? <Vibrate className="w-5 h-5" /> : <VibrateOff className="w-5 h-5" />}
          </button>

          {/* Sunlight Mode Toggle */}
          <button
            type="button"
            onClick={() => onUpdatePreferences({ highSunMode: !preferences.highSunMode })}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-colors ${
              preferences.highSunMode
                ? 'text-amber-600 bg-amber-100 hover:bg-amber-200'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
            title={preferences.highSunMode ? 'Modo Oscuro' : 'Modo Pleno Sol (Alto Contraste)'}
            aria-label="Contraste"
          >
            {preferences.highSunMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="hidden sm:flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title="Pantalla Completa"
            aria-label="Pantalla Completa"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Main Primary CTA Button: Excel */}
          <button
            type="button"
            onClick={onOpenSummaryModal}
            className="min-h-[44px] px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-emerald-700/20 active:scale-95 transition-all"
            aria-label="Generar planilla Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden xs:inline">Generar</span>
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Floating HUD Summary Strip */}
      <div
        className={`px-3.5 sm:px-6 py-2 border-t flex items-center justify-between gap-3 text-xs max-w-7xl mx-auto ${
          preferences.highSunMode
            ? 'bg-slate-100 border-slate-300 text-slate-900'
            : 'bg-slate-900/60 border-slate-800/80 text-slate-300'
        }`}
      >
        {/* Total Count Display */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Manga:
          </span>
          <span className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            {totalGeneral}
          </span>
          <span className="text-slate-500 hidden sm:inline">cabezas</span>

          <span className="text-slate-400 mx-1">·</span>
          <span className="text-slate-400 text-[11px]">
            Vacunos: <strong className="text-slate-700 dark:text-slate-200">{totalVacunos}</strong>
          </span>
          {totalOtros > 0 && (
            <>
              <span className="text-slate-400">·</span>
              <span className="text-amber-600 dark:text-amber-400 text-[11px] font-semibold">
                Novedades: {totalOtros}
              </span>
            </>
          )}
        </div>

        {/* Quick Management Triggers */}
        <div className="flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={onOpenCategoriesModal}
            className="px-2 py-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
            title="Añadir o configurar categorías vacunas"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Opciones</span>
          </button>

          <button
            type="button"
            onClick={onOpenHistoryModal}
            className="px-2 py-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
            title="Historial de conteos"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Historial</span>
          </button>

          <button
            type="button"
            onClick={onOpenResetModal}
            className="px-2 py-1 rounded-md hover:bg-rose-100 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors"
            title="Reiniciar o nuevo lote"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reiniciar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
