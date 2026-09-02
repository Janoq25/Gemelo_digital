import React from 'react';
import { ScenarioParams, StateData } from '../types';
import { calculateStateSimulatedRisk } from '../utils/simulationEngine';
import { Zap, Sun, ShieldCheck, Flame, RotateCcw, Activity } from 'lucide-react';

interface ScenarioSimulatorProps {
  params: ScenarioParams;
  onChangeParams: (newParams: ScenarioParams) => void;
  statesData: Record<string, StateData>;
  selectedStateId: string;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  params,
  onChangeParams,
  statesData,
  selectedStateId
}) => {
  const selectedState = statesData[selectedStateId];
  const selectedStateRisk = selectedState ? calculateStateSimulatedRisk(selectedState, params) : null;

  // Aggregate national metrics under this scenario
  const allStatesList = Object.values(statesData) as StateData[];
  let totalCritCount = 0;
  let avgExcessRate = 0;

  allStatesList.forEach(st => {
    const res = calculateStateSimulatedRisk(st, params);
    if (res.simulatedRisk >= 75) totalCritCount++;
    avgExcessRate += res.excessEdRate;
  });
  avgExcessRate = avgExcessRate / (allStatesList.length || 1);

  // Preset scenarios
  const applyPreset = (preset: 'baseline' | 'pnw2021' | 'texasGrid' | 'phoenixExtreme' | 'laCompound') => {
    switch (preset) {
      case 'baseline':
        onChangeParams({
          heatwaveDurationDays: 0,
          tempAnomalyF: 0,
          blackoutCustomerPercent: 0,
          seasonTiming: 'late',
          coolingInterventionEpsilon: 0.0
        });
        break;
      case 'pnw2021':
        onChangeParams({
          heatwaveDurationDays: 5,
          tempAnomalyF: 12,
          blackoutCustomerPercent: 8,
          seasonTiming: 'early', // Early PNW heat dome in June
          coolingInterventionEpsilon: 0.05
        });
        break;
      case 'texasGrid':
        onChangeParams({
          heatwaveDurationDays: 7,
          tempAnomalyF: 9,
          blackoutCustomerPercent: 32, // Large scale grid failure
          seasonTiming: 'late',
          coolingInterventionEpsilon: 0.10
        });
        break;
      case 'phoenixExtreme':
        onChangeParams({
          heatwaveDurationDays: 7,
          tempAnomalyF: 11,
          blackoutCustomerPercent: 12,
          seasonTiming: 'late',
          coolingInterventionEpsilon: 0.20
        });
        break;
      case 'laCompound':
        onChangeParams({
          heatwaveDurationDays: 5,
          tempAnomalyF: 8,
          blackoutCustomerPercent: 25, // Post-hurricane Ida / transformer overload
          seasonTiming: 'late',
          coolingInterventionEpsilon: 0.15
        });
        break;
    }
  };

  return (
    <div id="scenario-simulator-card" className="bg-[#080808] border border-white/10 rounded-xl p-5 shadow-xl">
      {/* Title and Preset Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-full bg-[#161616] border border-[#d4af37]/40 text-[#d4af37]">
            <Flame className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div>
            <h3 className="text-base font-serif italic text-white flex items-center gap-2">
              Composable Counterfactual Simulator (L4 Core Engine)
              <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37]">
                f_escenario(s, θ)
              </span>
            </h3>
            <p className="text-xs text-white/50">
              Perturba el estado del gemelo para evaluar el evento compuesto calor–apagón y resiliencia comunitaria.
            </p>
          </div>
        </div>

        <button
          id="btn-reset-scenario"
          onClick={() => applyPreset('baseline')}
          className="text-xs flex items-center gap-1.5 text-white/60 hover:text-white bg-[#111] hover:bg-[#1a1a1a] border border-white/20 px-3 py-1.5 rounded transition-colors self-start sm:self-auto uppercase tracking-wider text-[11px]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restablecer
        </button>
      </div>

      {/* Benchmark Presets */}
      <div className="mb-4">
        <span className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.2em] block mb-2">
          Escenarios Históricos & Sintéticos de Referencia:
        </span>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => applyPreset('pnw2021')}
            className="px-2.5 py-1 rounded bg-[#050505] border border-white/10 hover:border-[#d4af37]/50 text-white/70 hover:text-[#d4af37] transition-all text-[11px]"
          >
            Domo Térmico Noroeste 2021 (Temprano)
          </button>
          <button
            onClick={() => applyPreset('texasGrid')}
            className="px-2.5 py-1 rounded bg-[#050505] border border-white/10 hover:border-[#d4af37]/50 text-white/70 hover:text-[#d4af37] transition-all text-[11px]"
          >
            Colapso de Red Eléctrica (32% Corte)
          </button>
          <button
            onClick={() => applyPreset('phoenixExtreme')}
            className="px-2.5 py-1 rounded bg-[#050505] border border-white/10 hover:border-[#d4af37]/50 text-white/70 hover:text-[#d4af37] transition-all text-[11px]"
          >
            Megarracha Phoenix (7 días +11°F)
          </button>
          <button
            onClick={() => applyPreset('laCompound')}
            className="px-2.5 py-1 rounded bg-[#050505] border border-white/10 hover:border-[#d4af37]/50 text-white/70 hover:text-[#d4af37] transition-all text-[11px]"
          >
            Compuesto Louisiana (Calor + Apagón)
          </button>
        </div>
      </div>

      {/* Control Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {/* Heatwave Duration */}
        <div className="bg-[#050505] p-3.5 rounded border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-white/80 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Sun className="w-3.5 h-3.5 text-[#d4af37]" /> Duración de la Ola
            </span>
            <span className="font-serif text-[#d4af37] text-sm">
              {params.heatwaveDurationDays === 0 ? 'Sin ola' : `${params.heatwaveDurationDays} días`}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {([0, 3, 5, 7] as const).map((days) => (
              <button
                key={days}
                onClick={() => onChangeParams({ ...params, heatwaveDurationDays: days })}
                className={`py-1 rounded text-center font-mono text-xs transition-all ${
                  params.heatwaveDurationDays === days
                    ? 'bg-[#d4af37] text-black font-bold shadow'
                    : 'bg-[#111] border border-white/10 text-white/50 hover:text-white'
                }`}
              >
                {days === 0 ? 'Base' : `${days}d`}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-white/40 mt-2 leading-tight">
            Efecto DLNM: El riesgo no es solo instantáneo; se acumula en ventanas distribuidas de 21 días.
          </p>
        </div>

        {/* Temperature Anomaly */}
        <div className="bg-[#050505] p-3.5 rounded border border-white/10">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-medium text-white/80 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Flame className="w-3.5 h-3.5 text-[#d4af37]" /> Anomalía Térmica (°F)
            </span>
            <span className="font-serif text-[#d4af37] text-sm">
              +{params.tempAnomalyF} °F sobre p95
            </span>
          </div>
          <input
            id="slider-temp-anomaly"
            type="range"
            min="0"
            max="15"
            step="1"
            value={params.tempAnomalyF}
            onChange={(e) => onChangeParams({ ...params, tempAnomalyF: Number(e.target.value) })}
            className="w-full accent-[#d4af37] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-white/40 font-mono mt-1">
            <span>+0°F (Media)</span>
            <span>+7°F (Severo)</span>
            <span>+15°F (Extremo)</span>
          </div>
        </div>

        {/* EAGLE-I Blackout Injection */}
        <div className="bg-[#050505] p-3.5 rounded border border-white/10">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-medium text-white/80 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Zap className="w-3.5 h-3.5 text-[#d4af37]" /> Corte Eléctrico (EAGLE-I)
            </span>
            <span className="font-serif text-[#d4af37] text-sm">
              {params.blackoutCustomerPercent}% clientes
            </span>
          </div>
          <input
            id="slider-blackout-injection"
            type="range"
            min="0"
            max="50"
            step="2"
            value={params.blackoutCustomerPercent}
            onChange={(e) => onChangeParams({ ...params, blackoutCustomerPercent: Number(e.target.value) })}
            className="w-full accent-[#d4af37] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-white/40 font-mono mt-1">
            <span>0% (Normal)</span>
            <span>25% (Regional)</span>
            <span>50% (Colapso)</span>
          </div>
        </div>

        {/* Season Timing Acclimation */}
        <div className="bg-[#050505] p-3.5 rounded border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-white/80 uppercase tracking-wider text-[11px]">Aclimatación Estacional</span>
            <span className="font-serif text-[#d4af37] text-xs">
              {params.seasonTiming === 'early' ? 'Ola Temprana (+22% daño)' : 'Verano Avanzado'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onChangeParams({ ...params, seasonTiming: 'early' })}
              className={`py-1.5 px-2 rounded text-center text-xs transition-all ${
                params.seasonTiming === 'early'
                  ? 'bg-[#d4af37]/20 border border-[#d4af37]/60 text-[#d4af37] font-semibold'
                  : 'bg-[#111] border border-white/10 text-white/50 hover:text-white'
              }`}
            >
              Temprana (Mayo/Junio)
            </button>
            <button
              onClick={() => onChangeParams({ ...params, seasonTiming: 'late' })}
              className={`py-1.5 px-2 rounded text-center text-xs transition-all ${
                params.seasonTiming === 'late'
                  ? 'bg-[#d4af37]/20 border border-[#d4af37]/60 text-[#d4af37] font-semibold'
                  : 'bg-[#111] border border-white/10 text-white/50 hover:text-white'
              }`}
            >
              Tardía (Julio/Agosto)
            </button>
          </div>
          <p className="text-[10px] text-white/40 mt-2 leading-tight">
            Las primeras olas provocan mayor morbimortalidad al sorprender a la fisiología sin aclimatación previa.
          </p>
        </div>

        {/* Community Cooling Center Intervention (§9.3) */}
        <div className="bg-[#050505] p-3.5 rounded border border-white/10 md:col-span-2">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-medium text-white/80 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              Intervención: Red de Centros de Enfriamiento (Umbral de Efectividad ε)
            </span>
            <span className="font-serif text-[#d4af37] text-sm">
              ε = {(params.coolingInterventionEpsilon * 100).toFixed(0)}% reducción exposición
            </span>
          </div>
          <input
            id="slider-cooling-intervention"
            type="range"
            min="0.0"
            max="0.40"
            step="0.05"
            value={params.coolingInterventionEpsilon}
            onChange={(e) => onChangeParams({ ...params, coolingInterventionEpsilon: Number(e.target.value) })}
            className="w-full accent-[#d4af37] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-white/40 font-mono mt-1">
            <span>0% (Sin centros)</span>
            <span>15% (Cobertura base)</span>
            <span>40% (Red densa municipal)</span>
          </div>
          <p className="text-[10px] text-white/50 mt-1.5">
            <strong className="text-[#d4af37]">Análisis de Umbral (§9.3):</strong> Invierte la causalidad no verificable: evalúa qué eficacia mínima (ε) debe tener la red de refugios climáticos en cada ZCTA para mitigar el riesgo detectable.
          </p>
        </div>
      </div>

      {/* Real-time Simulated Impact Banner */}
      <div className="mt-4 pt-3.5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-[#050505] p-3 rounded border border-white/10">
          <span className="text-white/40 text-[10px] block uppercase tracking-[0.15em]">Estados Alerta Crítica</span>
          <span className="text-2xl font-serif text-red-400 flex items-center gap-1.5 mt-1">
            <Activity className="w-4 h-4 text-red-500" />
            {totalCritCount}
            <span className="text-xs text-white/40 font-mono"> / {allStatesList.length}</span>
          </span>
        </div>

        <div className="bg-[#050505] p-3 rounded border border-white/10">
          <span className="text-white/40 text-[10px] block uppercase tracking-[0.15em]">Exceso Urgencias</span>
          <span className="text-2xl font-serif text-[#d4af37] mt-1 block">
            +{avgExcessRate.toFixed(1)}
            <span className="text-xs text-white/40 font-mono"> / 100k</span>
          </span>
        </div>

        <div className="bg-[#050505] p-3 rounded border border-white/10">
          <span className="text-white/40 text-[10px] block uppercase tracking-[0.15em]">Interacción Sinérgica (H2)</span>
          <span className="text-2xl font-serif text-white/90 mt-1 block">
            {params.tempAnomalyF > 3 && params.blackoutCustomerPercent > 5 ? 'RERI = 2.48' : 'Aditiva (0)'}
          </span>
        </div>

        <div className="bg-[#050505] p-3 rounded border border-white/10">
          <span className="text-white/40 text-[10px] block uppercase tracking-[0.15em]">
            {selectedState ? selectedState.name : 'Estado Seleccionado'}
          </span>
          <span className="text-2xl font-serif text-[#d4af37] mt-1 block">
            {selectedStateRisk ? `${selectedStateRisk.simulatedRisk}/100` : '—'}
            <span className="text-[11px] text-white/50 font-mono ml-1.5">
              ({selectedStateRisk?.riskCategory})
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
