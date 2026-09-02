import React, { useState } from 'react';
import { BENCHMARK_HYPOTHESES } from '../data/usStatesData';
import { ResearchHypothesis } from '../types';
import { Award, CheckCircle2, ChevronRight, Activity, FileText } from 'lucide-react';

export const HypothesisTracker: React.FC = () => {
  const [selectedHypoId, setSelectedHypoId] = useState<string>('H2');

  const activeHypo = BENCHMARK_HYPOTHESES.find(h => h.id === selectedHypoId) || BENCHMARK_HYPOTHESES[1];

  return (
    <div id="hypotheses-tracker-card" className="bg-[#080808] border border-white/10 rounded-xl p-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-full bg-[#161616] border border-[#d4af37]/40 text-[#d4af37]">
            <Award className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div>
            <h3 className="text-base font-serif italic text-white flex items-center gap-2">
              Research Hypotheses Formal Verification (H1 to H6 · §3)
              <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37]">
                Statistical Contrasts
              </span>
            </h3>
            <p className="text-xs text-white/50">
              Sustituye umbrales arbitrarios por contrastes empíricos formales (DeLong, RERI bootstrap, DLNM y doble validación externa).
            </p>
          </div>
        </div>

        <div className="text-[11px] font-mono text-[#d4af37] bg-[#050505] border border-[#d4af37]/30 px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
          6 de 6 Hipótesis Contrastadas
        </div>
      </div>

      {/* Hypothesis Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
        {BENCHMARK_HYPOTHESES.map((hypo) => {
          const isSelected = selectedHypoId === hypo.id;
          return (
            <button
              key={hypo.id}
              onClick={() => setSelectedHypoId(hypo.id)}
              className={`p-3 rounded text-left transition-all border ${
                isSelected
                  ? 'bg-[#141414] border-[#d4af37] text-[#d4af37] ring-1 ring-[#d4af37]/40'
                  : 'bg-[#050505] border-white/10 text-white/50 hover:border-white/20 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold">{hypo.id}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37]">
                  {hypo.status === 'confirmed' ? 'Confirmada' : hypo.status === 'divergent' ? 'Divergente' : 'Significativa'}
                </span>
              </div>
              <div className="text-xs font-serif truncate">
                {hypo.title.split(' ')[0]} {hypo.title.split(' ')[1] || ''}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Hypothesis Card */}
      <div className="bg-[#050505] p-5 rounded border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded font-mono text-xs font-bold bg-[#d4af37] text-black">
              {activeHypo.id}
            </span>
            <h4 className="text-base font-serif italic text-white">
              {activeHypo.title}
            </h4>
          </div>
          <div className="text-xs font-mono text-[#d4af37] font-semibold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            {activeHypo.keyMetricName}: <span className="text-white font-bold">{activeHypo.keyMetricValue}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Formulation */}
          <div className="space-y-3">
            <div>
              <span className="text-white/40 text-[10px] font-semibold uppercase tracking-wider block mb-1">
                Hipótesis Nula (H0):
              </span>
              <p className="text-white/70 italic bg-[#0a0a0a] p-2.5 rounded border border-white/10 font-serif">
                "{activeHypo.nullHypothesis}"
              </p>
            </div>

            <div>
              <span className="text-[#d4af37] text-[10px] font-semibold uppercase tracking-wider block mb-1">
                Hipótesis Alterna (H1):
              </span>
              <p className="text-white/90 font-medium bg-[#0a0a0a] p-2.5 rounded border border-[#d4af37]/30">
                "{activeHypo.altHypothesis}"
              </p>
            </div>
          </div>

          {/* Test Method & Scientific Interpretation */}
          <div className="space-y-3">
            <div className="bg-[#0a0a0a] p-3 rounded border border-white/10 font-mono text-[11px]">
              <div className="text-white/40 mb-1">Método de Contraste Estadístico:</div>
              <div className="text-white font-semibold">{activeHypo.testMethod}</div>
              <div className="mt-2 pt-2 border-t border-white/10 flex justify-between">
                <span className="text-white/40">Resultado / p-valor:</span>
                <span className="text-[#d4af37] font-bold">{activeHypo.pValueOrCi}</span>
              </div>
            </div>

            <div className="bg-[#0e0e0e] p-3 rounded border border-[#d4af37]/30 text-white/80">
              <span className="text-[#d4af37] font-semibold block text-[10px] uppercase tracking-wider mb-1">
                Interpretación para la Tesis:
              </span>
              <p className="leading-relaxed">
                {activeHypo.interpretation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
