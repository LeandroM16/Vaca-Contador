import React, { useState } from 'react';
import { X, FileSpreadsheet, Share2, Copy, Check, Printer, AlertTriangle, Layers } from 'lucide-react';
import { CountingSession } from '../types/counter';
import { generateExcelWorkbook, formatWhatsAppSummary } from '../utils/excelExport';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: CountingSession;
  highSunMode: boolean;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({
  isOpen,
  onClose,
  session,
  highSunMode,
}) => {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  if (!isOpen) return null;

  const totalVacunos = session.categories.reduce((acc, cat) => acc + cat.count, 0);
  const totalOtros = session.otherItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalGeneral = totalVacunos + totalOtros;

  const handleDownloadExcel = () => {
    setExporting(true);
    try {
      generateExcelWorkbook(session);
    } catch (err) {
      console.error('Error generating Excel file:', err);
    } finally {
      setTimeout(() => setExporting(false), 800);
    }
  };

  const handleShare = async () => {
    const summaryText = formatWhatsAppSummary(session);
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Conteo de Hacienda - ${session.campo || 'Campo'}`,
          text: summaryText,
        });
        return;
      } catch {
        // User cancelled or unsupported, fallback to copy
      }
    }

    // Fallback: copy to clipboard
    handleCopyText();
  };

  const handleCopyText = () => {
    const summaryText = formatWhatsAppSummary(session);
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className={`relative w-full max-w-2xl rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl z-10 overflow-hidden ${
          highSunMode
            ? 'bg-white text-slate-950 border-2 border-slate-900'
            : 'bg-slate-900 text-white border border-slate-800'
        }`}
      >
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Resumen de Conteo y Planilla</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {session.campo || 'Establecimiento'} · {session.potrero || 'Potrero'} · {session.fecha}
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

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Big Totals Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div
              className={`p-3 rounded-xl border text-center ${
                highSunMode
                  ? 'bg-emerald-50 border-emerald-300 text-slate-950'
                  : 'bg-emerald-950/30 border-emerald-500/30 text-white'
              }`}
            >
              <div className="text-[11px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400">
                Vacunos
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-emerald-600 dark:text-emerald-300">
                {totalVacunos}
              </div>
              <div className="text-[10px] text-slate-500">cabezas</div>
            </div>

            <div
              className={`p-3 rounded-xl border text-center ${
                highSunMode
                  ? 'bg-amber-50 border-amber-300 text-slate-950'
                  : 'bg-amber-950/30 border-amber-500/30 text-white'
              }`}
            >
              <div className="text-[11px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400">
                Vacunos con Novedad
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-amber-600 dark:text-amber-300">
                {totalOtros}
              </div>
              <div className="text-[10px] text-slate-500">{session.otherItems.length} registros</div>
            </div>

            <div
              className={`p-3 rounded-xl border text-center ${
                highSunMode
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-slate-800 border-slate-700 text-white'
              }`}
            >
              <div className="text-[11px] uppercase font-bold tracking-wider text-slate-300">
                Total General
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-emerald-400">
                {totalGeneral}
              </div>
              <div className="text-[10px] text-slate-400">cabezas vacunas</div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2 border-b border-slate-200 dark:border-slate-800 font-bold text-xs uppercase tracking-wider flex justify-between">
              <span>Categoría Vacuna</span>
              <div className="flex gap-6">
                <span>Cabezas</span>
                <span>%</span>
              </div>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {session.categories.map(cat => {
                const pct = totalGeneral > 0 ? ((cat.count / totalGeneral) * 100).toFixed(1) : '0.0';
                return (
                  <div key={cat.id} className="px-4 py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold">{cat.name}</span>
                      {cat.subtext && <span className="text-xs text-slate-400 ml-2">({cat.subtext})</span>}
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-mono font-bold tabular-nums">{cat.count}</span>
                      <span className="font-mono text-xs text-slate-400 w-12 text-right">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary of Otros if any */}
          {session.otherItems.length > 0 && (
            <div className="border border-amber-300/60 dark:border-amber-500/30 rounded-xl p-3 bg-amber-50/50 dark:bg-amber-950/20">
              <div className="flex items-center gap-2 font-bold text-xs uppercase text-amber-700 dark:text-amber-400 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Novedades registradas para el informe ({session.otherItems.length})</span>
              </div>
              <div className="space-y-2 text-xs">
                {session.otherItems.map((item, idx) => (
                  <div key={item.id} className="p-2 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-center font-bold text-slate-900 dark:text-slate-100">
                      <span>#{idx + 1} {item.animalName} (x{item.quantity})</span>
                      <span className="text-[11px] font-normal text-slate-500">{item.timeFormatted} · {item.classification}</span>
                    </div>
                    <p className="italic text-slate-600 dark:text-slate-300 mt-1">"{item.observation}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          {/* Main Primary Action: Generate Excel */}
          <button
            type="button"
            onClick={handleDownloadExcel}
            disabled={exporting}
            className="w-full min-h-[50px] px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-700/20 active:scale-98 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-5 h-5" />
            <span>{exporting ? 'Generando Excel...' : 'Generar y Descargar Archivo Excel (.xlsx)'}</span>
          </button>

          {/* Secondary Actions: Share WhatsApp & Copy text */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleShare}
              className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border ${
                highSunMode
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Share2 className="w-4 h-4 text-emerald-500" />
              <span>Compartir WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleCopyText}
              className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border ${
                highSunMode
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Resumen</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
