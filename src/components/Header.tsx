import React from 'react';
import { Activity, ShieldCheck, Download, Compass, Cpu, HelpCircle } from 'lucide-react';

interface HeaderProps {
  currentView: 'map' | 'xai' | 'fairness' | 'architecture' | 'hypotheses';
  onChangeView: (view: 'map' | 'xai' | 'fairness' | 'architecture' | 'hypotheses') => void;
  onOpenFeasibility: () => void;
  onExportData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onChangeView,
  onOpenFeasibility,
  onExportData
}) => {
  return (
    <header className="bg-[#0a0a0a]/95 border-b border-white/10 backdrop-blur-md sticky top-0 z-30 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-[#d4af37]/40 bg-[#161616] flex items-center justify-center text-[#d4af37] shadow-lg shadow-black/60">
            <Activity className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif italic tracking-tight text-[#d4af37]">
                Heat–Blackout Health Digital Twin
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37]">
                v2.0 · Sep 2026
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/40 truncate max-w-xl">
              National Geo-Research & Clinical Epidemic Surveillance Portal
            </p>
          </div>
        </div>

        {/* Sync Status Badges */}
        <div className="hidden xl:flex items-center gap-2 text-[10px] font-mono">
          <div className="px-2.5 py-1 rounded bg-[#050505] border border-white/10 text-white/60 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse"></span>
            <span>gridMET 4km</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-[#050505] border border-white/10 text-white/60 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
            <span>EAGLE-I 15m</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-[#050505] border border-white/10 text-white/60 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>NWS 7d</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-[#050505] border border-white/10 text-white/60 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
            <span>EPHT #440 / VA #1385</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            id="btn-feasibility-verdict"
            onClick={onOpenFeasibility}
            className="px-3.5 py-1.5 rounded border border-[#d4af37] bg-[#d4af37] hover:bg-[#c59f2e] text-black font-semibold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer uppercase tracking-wider text-[11px]"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Dictamen de Viabilidad</span>
          </button>

          <button
            id="btn-export-scenario"
            onClick={onExportData}
            className="px-3 py-1.5 rounded bg-[#111] hover:bg-[#1a1a1a] text-white/80 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 border border-white/20 cursor-pointer text-[11px]"
            title="Exportar parámetros y snapshot del gemelo en JSON para reproducibilidad DVC/OSF"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar JSON</span>
          </button>
        </div>
      </div>

      {/* Navigation Views Tab Bar */}
      <div className="max-w-7xl mx-auto mt-2.5 pt-2 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto text-xs">
        <button
          onClick={() => onChangeView('map')}
          className={`px-3 py-1.5 rounded transition-all font-medium flex items-center gap-1.5 whitespace-nowrap text-[11px] uppercase tracking-wider ${
            currentView === 'map'
              ? 'bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] font-semibold shadow-sm'
              : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Mapa & Escenarios (L4)
        </button>

        <button
          onClick={() => onChangeView('xai')}
          className={`px-3 py-1.5 rounded transition-all font-medium flex items-center gap-1.5 whitespace-nowrap text-[11px] uppercase tracking-wider ${
            currentView === 'xai'
              ? 'bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] font-semibold shadow-sm'
              : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          Explicabilidad XAI (TreeSHAP & DLNM)
        </button>

        <button
          onClick={() => onChangeView('fairness')}
          className={`px-3 py-1.5 rounded transition-all font-medium flex items-center gap-1.5 whitespace-nowrap text-[11px] uppercase tracking-wider ${
            currentView === 'fairness'
              ? 'bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] font-semibold shadow-sm'
              : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Auditoría de Equidad (Fairlearn)
        </button>

        <button
          onClick={() => onChangeView('architecture')}
          className={`px-3 py-1.5 rounded transition-all font-medium flex items-center gap-1.5 whitespace-nowrap text-[11px] uppercase tracking-wider ${
            currentView === 'architecture'
              ? 'bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] font-semibold shadow-sm'
              : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          Arquitectura 6 Capas (L0–L5)
        </button>

        <button
          onClick={() => onChangeView('hypotheses')}
          className={`px-3 py-1.5 rounded transition-all font-medium flex items-center gap-1.5 whitespace-nowrap text-[11px] uppercase tracking-wider ${
            currentView === 'hypotheses'
              ? 'bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] font-semibold shadow-sm'
              : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          Hipótesis H1–H6
        </button>
      </div>
    </header>
  );
};
