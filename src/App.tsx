/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Plus, 
  RotateCcw, 
  Undo2, 
  FileSpreadsheet, 
  AlertTriangle, 
  ClipboardList, 
  CheckCircle2, 
  SlidersHorizontal,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { Category, OtherItem, CountingSession, ActionLog } from './types/counter';
import { 
  loadCurrentSession, 
  saveCurrentSession, 
  loadHistory, 
  saveToHistory, 
  deleteFromHistory, 
  loadPreferences, 
  savePreferences, 
  UserPreferences,
  createNewSession 
} from './utils/storage';
import { playClickSound, playDecrementSound, playOtherSound, triggerHaptic } from './utils/audio';
import { Header } from './components/Header';
import { CategoryCard } from './components/CategoryCard';
import { OtherCard } from './components/OtherCard';
import { OtherModal } from './components/OtherModal';
import { OtherListModal } from './components/OtherListModal';
import { SummaryModal } from './components/SummaryModal';
import { SessionModal } from './components/SessionModal';
import { ManageCategoriesModal } from './components/ManageCategoriesModal';
import { HistoryModal } from './components/HistoryModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';

export default function App() {
  const [session, setSession] = useState<CountingSession>(() => loadCurrentSession());
  const [history, setHistory] = useState<CountingSession[]>(() => loadHistory());
  const [preferences, setPreferences] = useState<UserPreferences>(() => loadPreferences());
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Navigation tabs for Android bottom bar
  const [activeTab, setActiveTab] = useState<'counter' | 'others' | 'summary'>('counter');

  // Modals state
  const [isOtherModalOpen, setIsOtherModalOpen] = useState(false);
  const [editingOtherItem, setEditingOtherItem] = useState<OtherItem | null>(null);
  const [isOtherListOpen, setIsOtherListOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Undo stack & quick notification toast
  const [undoStack, setUndoStack] = useState<ActionLog[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save whenever session updates
  useEffect(() => {
    saveCurrentSession(session);
  }, [session]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const updatePreferences = (updated: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const next = { ...prev, ...updated };
      savePreferences(next);
      return next;
    });
  };

  // -------------------------------------------------------------
  // INCREMENT / DECREMENT HANDLERS
  // -------------------------------------------------------------
  const handleIncrement = (categoryId: string, amount: number = 1) => {
    if (preferences.soundEnabled) playClickSound(880, 0.05);
    if (preferences.hapticEnabled) triggerHaptic(30);

    const cat = session.categories.find(c => c.id === categoryId);
    if (!cat) return;

    setSession(prev => ({
      ...prev,
      updatedAt: Date.now(),
      categories: prev.categories.map(c => 
        c.id === categoryId ? { ...c, count: c.count + amount } : c
      ),
    }));

    // Push to undo stack
    setUndoStack(prev => [
      {
        id: 'act_' + Date.now(),
        type: 'increment',
        categoryId,
        categoryName: cat.name,
        delta: amount,
        timestamp: Date.now(),
        description: `+${amount} ${cat.name}`,
      },
      ...prev.slice(0, 19), // Keep last 20 actions
    ]);
  };

  const handleDecrement = (categoryId: string) => {
    const cat = session.categories.find(c => c.id === categoryId);
    if (!cat || cat.count <= 0) return;

    if (preferences.soundEnabled) playDecrementSound();
    if (preferences.hapticEnabled) triggerHaptic([20, 40]);

    setSession(prev => ({
      ...prev,
      updatedAt: Date.now(),
      categories: prev.categories.map(c => 
        c.id === categoryId ? { ...c, count: Math.max(0, c.count - 1) } : c
      ),
    }));

    setUndoStack(prev => [
      {
        id: 'act_' + Date.now(),
        type: 'decrement',
        categoryId,
        categoryName: cat.name,
        delta: -1,
        timestamp: Date.now(),
        description: `-1 ${cat.name}`,
      },
      ...prev.slice(0, 19),
    ]);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const [lastAction, ...rest] = undoStack;

    if (preferences.soundEnabled) playDecrementSound();
    if (preferences.hapticEnabled) triggerHaptic(40);

    if (lastAction.type === 'increment' && lastAction.categoryId && lastAction.delta) {
      setSession(prev => ({
        ...prev,
        categories: prev.categories.map(c => 
          c.id === lastAction.categoryId ? { ...c, count: Math.max(0, c.count - lastAction.delta!) } : c
        ),
      }));
      showToast(`Deshecho: ${lastAction.description}`);
    } else if (lastAction.type === 'decrement' && lastAction.categoryId) {
      setSession(prev => ({
        ...prev,
        categories: prev.categories.map(c => 
          c.id === lastAction.categoryId ? { ...c, count: c.count + 1 } : c
        ),
      }));
      showToast(`Deshecho: ${lastAction.description}`);
    } else if (lastAction.type === 'other_add' && lastAction.otherItem) {
      setSession(prev => ({
        ...prev,
        otherItems: prev.otherItems.filter(i => i.id !== lastAction.otherItem!.id),
      }));
      showToast(`Deshecho registro de "${lastAction.otherItem.animalName}"`);
    }

    setUndoStack(rest);
  };

  // -------------------------------------------------------------
  // "OTRO" / NOVEDADES HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddOther = () => {
    setEditingOtherItem(null);
    setIsOtherModalOpen(true);
  };

  const handleEditOther = (item: OtherItem) => {
    setEditingOtherItem(item);
    setIsOtherListOpen(false);
    setIsOtherModalOpen(true);
  };

  const handleSaveOther = (itemData: Omit<OtherItem, 'id' | 'timestamp' | 'timeFormatted'>) => {
    if (preferences.soundEnabled) playOtherSound();
    if (preferences.hapticEnabled) triggerHaptic([40, 60, 40]);

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (editingOtherItem) {
      // Edit existing
      setSession(prev => ({
        ...prev,
        updatedAt: Date.now(),
        otherItems: prev.otherItems.map(item => 
          item.id === editingOtherItem.id
            ? { ...item, ...itemData }
            : item
        ),
      }));
      showToast(`Actualizado: ${itemData.animalName}`);
    } else {
      // Add new
      const newItem: OtherItem = {
        ...itemData,
        id: 'oth_' + Date.now(),
        timestamp: Date.now(),
        timeFormatted,
      };

      setSession(prev => ({
        ...prev,
        updatedAt: Date.now(),
        otherItems: [...prev.otherItems, newItem],
      }));

      setUndoStack(prev => [
        {
          id: 'act_' + Date.now(),
          type: 'other_add',
          otherItem: newItem,
          timestamp: Date.now(),
          description: `Vacuno: ${newItem.animalName} (x${newItem.quantity})`,
        },
        ...prev.slice(0, 19),
      ]);

      showToast(`Anotado vacuno "${newItem.animalName}" con observación para el Excel`);
    }
  };

  const handleDeleteOther = (id: string) => {
    const item = session.otherItems.find(i => i.id === id);
    if (!item) return;

    setSession(prev => ({
      ...prev,
      updatedAt: Date.now(),
      otherItems: prev.otherItems.filter(i => i.id !== id),
    }));

    showToast(`Eliminado "${item.animalName}"`);
  };

  // -------------------------------------------------------------
  // SESSION & CATEGORIES MANAGEMENT
  // -------------------------------------------------------------
  const handleUpdateSessionData = (updated: Partial<CountingSession>) => {
    setSession(prev => ({ ...prev, ...updated, updatedAt: Date.now() }));
    showToast('Datos de la sesión actualizados');
  };

  const handleSaveCategories = (categories: Category[]) => {
    setSession(prev => ({ ...prev, categories, updatedAt: Date.now() }));
    showToast('Categorías actualizadas');
  };

  const handleConfirmReset = (saveFirst: boolean) => {
    if (saveFirst) {
      const updatedHistory = saveToHistory(session);
      setHistory(updatedHistory);
      showToast('Sesión guardada en el historial');
    }

    const fresh = createNewSession(session.campo, '', session.operador);
    // Keep custom categories but zero counts
    fresh.categories = session.categories.map(c => ({ ...c, count: 0 }));
    setSession(fresh);
    setUndoStack([]);
    setIsResetModalOpen(false);
    showToast('Contadores reiniciados a 0');
  };

  const handleLoadHistorySession = (loaded: CountingSession) => {
    // Optionally save current if has counts
    const hasCounts = session.categories.some(c => c.count > 0) || session.otherItems.length > 0;
    if (hasCounts) {
      saveToHistory(session);
    }
    setSession(loaded);
    setUndoStack([]);
    showToast(`Sesión cargada: ${loaded.sessionName}`);
  };

  const handleDeleteHistorySession = (id: string) => {
    const updated = deleteFromHistory(id);
    setHistory(updated);
    showToast('Sesión eliminada del historial');
  };

  const totalVacunos = session.categories.reduce((acc, cat) => acc + cat.count, 0);
  const totalOtros = session.otherItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalGeneral = totalVacunos + totalOtros;
  const hasData = totalGeneral > 0;

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        preferences.highSunMode
          ? 'bg-slate-100 text-slate-950'
          : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Top Header */}
      <Header
        session={session}
        preferences={preferences}
        onUpdatePreferences={updatePreferences}
        onOpenSessionModal={() => setIsSessionModalOpen(true)}
        onOpenCategoriesModal={() => setIsCategoriesModalOpen(true)}
        onOpenSummaryModal={() => setIsSummaryModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
        onOpenResetModal={() => setIsResetModalOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 sm:p-6 pb-28">
        {/* Quick Undo Floating Bar if available */}
        {undoStack.length > 0 && (
          <div className="mb-3 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs shadow-md animate-in fade-in slide-in-from-top-2">
            <span className="text-slate-300 truncate">
              Último toque: <strong className="text-white">{undoStack[0].description}</strong>
            </span>
            <button
              type="button"
              onClick={handleUndo}
              className="ml-2 px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-amber-300 font-bold flex items-center gap-1 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Deshacer</span>
            </button>
          </div>
        )}

        {/* View tab: Counter Screen */}
        {activeTab === 'counter' && (
          <div>
            {/* Grid of livestock categories + "Otro" card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {/* Livestock categories */}
              {session.categories.map(category => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  totalHerd={totalGeneral}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  highSunMode={preferences.highSunMode}
                />
              ))}

              {/* Dedicated "OTRO / NOVEDADES" Card */}
              <OtherCard
                otherItems={session.otherItems}
                onOpenModal={handleOpenAddOther}
                onViewList={() => setIsOtherListOpen(true)}
                highSunMode={preferences.highSunMode}
              />
            </div>
          </div>
        )}

        {/* View tab: Others and Notes Screen */}
        {activeTab === 'others' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Novedades y Observaciones Vacunas</h2>
                <p className="text-xs text-slate-400">
                  Vacunos ajenos, sin caravana, sanitarios o fuera de lote
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddOther}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Registro</span>
              </button>
            </div>

            {session.otherItems.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-slate-700 text-center space-y-3">
                <AlertTriangle className="w-10 h-10 text-amber-500/60 mx-auto" />
                <h3 className="font-semibold text-sm">No has anotado novedades vacunas todavía</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Toca el botón "+ Nuevo Registro" para anotar vacunos que presenten novedades (vacas ajenas de vecinos, terneros sin caravana, animales sanitarios) y su observación correspondiente.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddOther}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  Registrar Ahora
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {session.otherItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border ${
                      preferences.highSunMode
                        ? 'bg-white border-slate-300 text-slate-950 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-500">
                            #{idx + 1}
                          </span>
                          <h4 className="font-bold text-base">{item.animalName}</h4>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                            {item.quantity} {item.quantity === 1 ? 'cabeza' : 'cabezas'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {item.timeFormatted} · {item.classification}
                          {item.caravana ? ` · Caravana: ${item.caravana}` : ''}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditOther(item)}
                          className="px-2 py-1 rounded text-xs text-slate-300 hover:bg-slate-800"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteOther(item.id)}
                          className="px-2 py-1 rounded text-xs text-rose-400 hover:bg-rose-950/40"
                        >
                          Borrar
                        </button>
                      </div>
                    </div>

                    <div className="mt-2.5 p-2.5 rounded-lg bg-black/20 text-xs italic text-slate-300 border border-white/5">
                      "{item.observation}"
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* View tab: Live Summary Screen */}
        {activeTab === 'summary' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Resumen de la Hacienda</h2>
                <p className="text-xs text-slate-400">
                  {session.campo || 'Establecimiento'} · {session.potrero || 'Potrero'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSummaryModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Exportar Excel</span>
              </button>
            </div>

            {/* Quick stats strip */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center">
                <div className="text-[10px] uppercase font-bold text-emerald-400">Vacunos</div>
                <div className="text-2xl font-mono font-extrabold text-emerald-300">{totalVacunos}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-center">
                <div className="text-[10px] uppercase font-bold text-amber-400">Vacunos con Novedad</div>
                <div className="text-2xl font-mono font-extrabold text-amber-300">{totalOtros}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">Total Vacunos</div>
                <div className="text-2xl font-mono font-extrabold text-white">{totalGeneral}</div>
              </div>
            </div>

            {/* Table of all categories */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden divide-y divide-slate-800 text-sm">
              {session.categories.map(cat => {
                const pct = totalGeneral > 0 ? ((cat.count / totalGeneral) * 100).toFixed(1) : '0.0';
                return (
                  <div key={cat.id} className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{cat.name}</div>
                      {cat.subtext && <div className="text-xs text-slate-400">{cat.subtext}</div>}
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-base">{cat.count} cab.</div>
                      <div className="text-xs text-slate-400 font-mono">{pct}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>


      {/* Mobile Bottom Navigation Bar (Pattern from Mobile Design Guide) */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-md transition-colors pb-safe ${
          preferences.highSunMode
            ? 'bg-white/95 border-slate-300 text-slate-900 shadow-lg'
            : 'bg-slate-950/95 border-slate-800 text-white'
        }`}
      >
        <div className="grid grid-cols-4 items-center h-16 max-w-lg mx-auto">
          {/* Tab 1: Conteo */}
          <button
            type="button"
            onClick={() => setActiveTab('counter')}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-colors ${
              activeTab === 'counter'
                ? 'text-emerald-500 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            <span className="text-[11px] mt-1">Conteo</span>
          </button>

          {/* Tab 2: Otros / Novedades */}
          <button
            type="button"
            onClick={() => setActiveTab('others')}
            className={`min-h-[48px] flex flex-col items-center justify-center relative transition-colors ${
              activeTab === 'others'
                ? 'text-amber-500 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <AlertTriangle className="w-5 h-5" />
              {session.otherItems.length > 0 && (
                <span className="absolute -top-1.5 -right-2 px-1 min-w-[16px] h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center font-mono">
                  {session.otherItems.length}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-1">Novedades ({session.otherItems.length})</span>
          </button>

          {/* Tab 3: Resumen */}
          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-colors ${
              activeTab === 'summary'
                ? 'text-blue-500 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="font-mono text-sm font-black text-emerald-400">
              {totalGeneral}
            </div>
            <span className="text-[11px] mt-0.5">Resumen</span>
          </button>

          {/* Tab 4: Excel export modal trigger */}
          <button
            type="button"
            onClick={() => setIsSummaryModalOpen(true)}
            className="min-h-[48px] flex flex-col items-center justify-center text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            <FileSpreadsheet className="w-5 h-5" />
            <span className="text-[11px] mt-1 font-semibold">Excel</span>
          </button>
        </div>
      </nav>

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-slate-900/95 border border-slate-700 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ALL MODALS */}
      {/* 1. Modal for "Otro" (Requested explicit feature) */}
      <OtherModal
        isOpen={isOtherModalOpen}
        onClose={() => setIsOtherModalOpen(false)}
        onSave={handleSaveOther}
        editingItem={editingOtherItem}
        highSunMode={preferences.highSunMode}
      />

      {/* 2. Modal list for all "Otros" */}
      <OtherListModal
        isOpen={isOtherListOpen}
        onClose={() => setIsOtherListOpen(false)}
        otherItems={session.otherItems}
        onAddNew={handleOpenAddOther}
        onEdit={handleEditOther}
        onDelete={handleDeleteOther}
        highSunMode={preferences.highSunMode}
      />

      {/* 3. Summary & Excel Generation Modal */}
      <SummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        session={session}
        highSunMode={preferences.highSunMode}
      />

      {/* 4. Session & Field metadata modal */}
      <SessionModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        session={session}
        onUpdateSession={handleUpdateSessionData}
        highSunMode={preferences.highSunMode}
      />

      {/* 5. Custom Options / Categories modal */}
      <ManageCategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        categories={session.categories}
        onSaveCategories={handleSaveCategories}
        highSunMode={preferences.highSunMode}
      />

      {/* 6. History modal */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        currentSessionId={session.id}
        onLoadSession={handleLoadHistorySession}
        onDeleteSession={handleDeleteHistorySession}
        highSunMode={preferences.highSunMode}
      />

      {/* 7. Safety Reset modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={handleConfirmReset}
        hasData={hasData}
        highSunMode={preferences.highSunMode}
      />
    </div>
  );
}
