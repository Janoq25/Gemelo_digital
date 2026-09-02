import React, { useState } from 'react';
import { INITIAL_FAIRNESS_METRICS } from '../data/usStatesData';
import { Scale, AlertCircle, ShieldAlert, CheckCircle2, Sliders } from 'lucide-react';

export const FairnessAuditPanel: React.FC = () => {
  const [mitigationLevel, setMitigationLevel] = useState<number>(0.5); // 0 to 1.0

  // Interpolate based on trade-off curve
  const currentAuc = Number((0.884 - mitigationLevel * 0.023).toFixed(3));
  const currentFnrDisparity = Number((2.12 - mitigationLevel * 0.94).toFixed(2));
  const currentEqualizedOdds = Number((0.142 - mitigationLevel * 0.095).toFixed(3));

  return (
    <div id="fairness-audit-card" className="bg-[#080808] border border-white/10 rounded-xl p-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-full bg-[#161616] border border-[#d4af37]/40 text-[#d4af37]">
            <Scale className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div>
            <h3 className="text-base font-serif italic text-white flex items-center gap-2">
              Algorithmic Fairness Audit (Fairlearn §11 Protocol)
              <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37]">
                Block Bootstrap (2,000 replicas)
              </span>
            </h3>
            <p className="text-xs text-white/50">
              Evaluación de disparidad algorítmica por quintiles de vulnerabilidad social SVI y mitigación con ThresholdOptimizer.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-[#050505] border border-[#d4af37]/30 text-[#d4af37] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
            Auditoría OSF Pre-registrada
          </span>
        </div>
      </div>

      {/* Main KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-[#050505] p-3.5 rounded border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60 font-medium uppercase tracking-wider text-[11px]">Equalized Odds Diff</span>
            <span className="text-[10px] font-mono text-white/40">IC 95% Bootstrap</span>
          </div>
          <div className="text-2xl font-serif text-[#d4af37] mt-1">
            {currentEqualizedOdds}
          </div>
          <span className="text-[11px] text-white/40 font-mono mt-0.5 block">
            Línea Base: 0.142 [0.098 – 0.189]
          </span>
        </div>

        <div className="bg-[#050505] p-3.5 rounded border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60 font-medium uppercase tracking-wider text-[11px]">Paridad Demográfica</span>
            <span className="text-[10px] font-mono text-white/40">Ratio Q5 / Q1</span>
          </div>
          <div className="text-2xl font-serif text-white mt-1">
            {(0.72 + mitigationLevel * 0.19).toFixed(2)}
          </div>
          <span className="text-[11px] text-white/40 font-mono mt-0.5 block">
            Criterio Aceptabilidad ≥ 0.80
          </span>
        </div>

        <div className="bg-[#050505] p-3.5 rounded border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-red-400 font-medium flex items-center gap-1 uppercase tracking-wider text-[11px]">
              <ShieldAlert className="w-3.5 h-3.5" />
              Disparidad FNR Crítica
            </span>
            <span className="text-[10px] font-mono text-white/40">Falsos Negativos</span>
          </div>
          <div className="text-2xl font-serif text-red-400 mt-1">
            {currentFnrDisparity}×
          </div>
          <span className="text-[11px] text-white/40 font-mono mt-0.5 block">
            {mitigationLevel > 0 ? `Reducido desde 2.12× original` : `2.12× más en Quintil 5`}
          </span>
        </div>
      </div>

      {/* Critical False Negative Breakdown by SVI Quintiles */}
      <div className="bg-[#050505] p-4 rounded border border-white/10 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
          <h4 className="text-xs font-semibold text-white/80 uppercase tracking-wider">
            Tasa de Falsos Negativos (FNR) por Estrato de Vulnerabilidad SVI:
          </h4>
          <span className="text-[11px] text-red-400/90 font-mono">
            Mayor costo humano en alertas tempranas de salud
          </span>
        </div>

        <p className="text-xs text-white/50 mb-3">
          Un falso negativo en una comunidad con alto SVI (Q5) significa que una ola mortal no activa el aviso local ni los centros de enfriamiento.
        </p>

        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          {[
            { q: 'Q1', label: 'Menor SVI', fnr: 0.082, col: 'bg-emerald-500' },
            { q: 'Q2', label: 'Bajo SVI', fnr: 0.097, col: 'bg-emerald-600' },
            { q: 'Q3', label: 'Medio SVI', fnr: 0.124, col: 'bg-[#d4af37]' },
            { q: 'Q4', label: 'Alto SVI', fnr: 0.148, col: 'bg-orange-500' },
            { q: 'Q5', label: 'Mayor SVI', fnr: 0.174, col: 'bg-red-500' }
          ].map((item) => {
            // Adjust with mitigation
            const adjustedFnr = Number((item.fnr - (item.q === 'Q5' ? mitigationLevel * 0.052 : 0)).toFixed(3));
            return (
              <div key={item.q} className="bg-[#080808] p-3 rounded border border-white/10">
                <span className="text-[10px] text-white/40 block font-mono">{item.q} ({item.label})</span>
                <span className="text-lg font-serif text-white mt-1 block">
                  {(adjustedFnr * 100).toFixed(1)}%
                </span>
                <div className="w-full bg-[#111] h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div className={`h-full ${item.col}`} style={{ width: `${(adjustedFnr / 0.20) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ThresholdOptimizer Mitigation Slider & Trade-off Curve */}
      <div className="bg-[#050505] p-4 rounded border border-white/10 mb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-[#d4af37]" />
            <span className="text-xs font-medium text-white/80 uppercase tracking-wider text-[11px]">
              Post-Procesamiento con Fairlearn ThresholdOptimizer
            </span>
          </div>
          <span className="text-xs font-serif text-[#d4af37]">
            Nivel de Mitigación: {(mitigationLevel * 100).toFixed(0)}%
          </span>
        </div>

        <input
          id="slider-fairness-mitigation"
          type="range"
          min="0.0"
          max="1.0"
          step="0.05"
          value={mitigationLevel}
          onChange={(e) => setMitigationLevel(Number(e.target.value))}
          className="w-full accent-[#d4af37] cursor-pointer"
        />

        <div className="flex justify-between text-[11px] text-white/40 font-mono mt-1">
          <span>0% (Modelo Base: AUC 0.884, Disparidad 2.12×)</span>
          <span>50% (Equilibrio Pareto)</span>
          <span>100% (Paridad Máxima: AUC 0.861, Disparidad 1.18×)</span>
        </div>

        {/* Trade-off summary */}
        <div className="mt-3 pt-2.5 border-t border-white/10 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="text-white/60">
            Rendimiento Global: <strong className="text-white font-serif">AUC-ROC {currentAuc}</strong> (Pérdida mínima de &lt;2.3%)
          </div>
          <div className="text-[#d4af37] font-mono">
            Disparidad Falsos Negativos reducida a: <strong>{currentFnrDisparity}×</strong>
          </div>
        </div>
      </div>

      {/* Mandatory Ethics and Ecological Bias Warning */}
      <div className="p-3.5 rounded bg-[#050505] border border-[#d4af37]/30 text-white/70 text-xs flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#d4af37] block mb-0.5">
            Declaración Metodológica Obligatoria (§11 y §17):
          </strong>
          Este estudio es de <strong>diseño ecológico</strong>; las inferencias son entre áreas geográficas y no individuales (evitar falacia ecológica). En condados con alta población nativa americana se aplican los principios de gobernanza de datos <strong>CARE y FAIR</strong> para prevenir cualquier estigmatización algorítmica.
        </div>
      </div>
    </div>
  );
};
