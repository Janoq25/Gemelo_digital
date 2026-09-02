import React, { useState } from 'react';
import { StateData, MetricKey, ScenarioParams } from '../types';
import { US_STATE_PATHS } from '../data/usMapPaths';
import { METRIC_DEFINITIONS } from '../data/usStatesData';
import { calculateStateSimulatedRisk } from '../utils/simulationEngine';
import { Info, Layers, Eye, AlertTriangle } from 'lucide-react';

interface USChoroplethMapProps {
  statesData: Record<string, StateData>;
  selectedStateId: string;
  onSelectState: (stateId: string) => void;
  activeMetric: MetricKey;
  onChangeMetric: (metric: MetricKey) => void;
  scenarioParams: ScenarioParams;
  cohortFilter: 'all' | 'epht16' | 'critical' | 'va1385';
  onChangeCohortFilter: (filter: 'all' | 'epht16' | 'critical' | 'va1385') => void;
}

export const USChoroplethMap: React.FC<USChoroplethMapProps> = ({
  statesData,
  selectedStateId,
  onSelectState,
  activeMetric,
  onChangeMetric,
  scenarioParams,
  cohortFilter,
  onChangeCohortFilter
}) => {
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);

  const metricDef = METRIC_DEFINITIONS.find(m => m.key === activeMetric) || METRIC_DEFINITIONS[0];

  // Helper to interpolate colors
  const getColorForValue = (val: number, min: number, max: number, colors: string[]) => {
    const ratio = Math.max(0, Math.min(1, (val - min) / (max - min || 1)));
    const index = Math.min(colors.length - 1, Math.floor(ratio * (colors.length - 1)));
    return colors[index];
  };

  const getStateMetricValue = (state: StateData): number => {
    switch (activeMetric) {
      case 'compoundRisk':
        return calculateStateSimulatedRisk(state, scenarioParams).simulatedRisk;
      case 'tmaxAnomaly':
        return scenarioParams.tempAnomalyF;
      case 'blackoutRate':
        return Math.min(100, state.blackoutRateBaseline + scenarioParams.blackoutCustomerPercent);
      case 'svi':
        return state.sviOverall;
      case 'chronicPrevalence':
        return state.placesChronicPrevalence;
      case 'lackAc':
        return state.laceLackAcPercent;
      case 'urbanHeatIsland':
        return state.landsatHeatIslandGini;
      default:
        return 50;
    }
  };

  const hoveredState = hoveredStateId ? statesData[hoveredStateId] : null;
  const hoveredRisk = hoveredState ? calculateStateSimulatedRisk(hoveredState, scenarioParams) : null;

  return (
    <div id="us-choropleth-container" className="bg-[#080808] border border-white/10 rounded-xl p-5 shadow-2xl relative overflow-hidden">
      {/* Top Header & Layer Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-lg font-serif italic text-white flex items-center gap-2">
              National Epidemiological & Climate Spatial Canvas
              <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-[#161616] border border-white/10 text-white/60">
                Albers USA CONUS + AK/HI
              </span>
            </h2>
          </div>
          <p className="text-xs text-white/50 mt-0.5">
            {metricDef.description} · <span className="text-[#d4af37] font-medium">Fuente: {metricDef.source}</span>
          </p>
        </div>

        {/* Cohort filters */}
        <div className="flex items-center gap-1 bg-[#050505] p-1 rounded border border-white/10 text-xs overflow-x-auto">
          <button
            id="filter-cohort-all"
            onClick={() => onChangeCohortFilter('all')}
            className={`px-3 py-1 rounded transition-all whitespace-nowrap text-[11px] uppercase tracking-wider ${
              cohortFilter === 'all'
                ? 'bg-[#d4af37] text-black font-semibold shadow'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Todos los Estados (50+DC)
          </button>
          <button
            id="filter-cohort-epht16"
            onClick={() => onChangeCohortFilter('epht16')}
            className={`px-3 py-1 rounded transition-all whitespace-nowrap flex items-center gap-1.5 text-[11px] uppercase tracking-wider ${
              cohortFilter === 'epht16'
                ? 'bg-[#d4af37] text-black font-semibold shadow'
                : 'text-white/50 hover:text-white'
            }`}
            title="16 Estados con reporte confirmado EPHT medida 440 en 2023"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Cohorte EPHT 2023 (16)
          </button>
          <button
            id="filter-cohort-va1385"
            onClick={() => onChangeCohortFilter('va1385')}
            className={`px-3 py-1 rounded transition-all whitespace-nowrap text-[11px] uppercase tracking-wider ${
              cohortFilter === 'va1385'
                ? 'bg-[#d4af37] text-black font-semibold shadow'
                : 'text-white/50 hover:text-white'
            }`}
            title="Serie diaria por estado población Veterans Affairs (Medida 1385)"
          >
            Centinela VA (Diario)
          </button>
          <button
            id="filter-cohort-critical"
            onClick={() => onChangeCohortFilter('critical')}
            className={`px-3 py-1 rounded transition-all whitespace-nowrap flex items-center gap-1 text-[11px] uppercase tracking-wider ${
              cohortFilter === 'critical'
                ? 'bg-red-600 text-white font-semibold shadow'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-red-300" />
            Alerta Crítica (≥75)
          </button>
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3.5 text-xs">
        <span className="text-white/40 mr-1 flex items-center gap-1 font-medium text-[11px] uppercase tracking-wider">
          <Eye className="w-3.5 h-3.5 text-[#d4af37]" /> Capa Activa:
        </span>
        {METRIC_DEFINITIONS.map((m) => {
          const isActive = m.key === activeMetric;
          return (
            <button
              key={m.key}
              id={`metric-btn-${m.key}`}
              onClick={() => onChangeMetric(m.key)}
              className={`px-2.5 py-1 rounded transition-all font-medium border text-[11px] uppercase tracking-wider ${
                isActive
                  ? 'bg-[#d4af37]/15 border-[#d4af37]/50 text-[#d4af37] shadow-sm font-semibold'
                  : 'bg-[#050505] border-white/10 text-white/50 hover:text-white hover:border-white/20'
              }`}
            >
              {m.shortLabel}
            </button>
          );
        })}
      </div>

      {/* SVG Map Canvas */}
      <div className="relative w-full aspect-[16/9.5] max-h-[520px] bg-[#050505] rounded border border-white/10 flex items-center justify-center p-2">
        <svg
          viewBox="0 0 960 600"
          className="w-full h-full select-none"
          style={{ filter: 'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.7))' }}
        >
          {/* Subtle grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#222222" strokeWidth="0.5" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="960" height="600" fill="url(#grid)" />

          {/* Render States */}
          {Object.entries(US_STATE_PATHS).map(([stateId, pathObj]) => {
            const state = statesData[stateId];
            if (!state) return null;

            const isSelected = selectedStateId === stateId;
            const isHovered = hoveredStateId === stateId;
            const val = getStateMetricValue(state);
            const fillColor = getColorForValue(val, metricDef.min, metricDef.max, metricDef.colorScale);

            // Filter dimming
            let isDimmed = false;
            if (cohortFilter === 'epht16' && !state.isEphtReporting2023) isDimmed = true;
            if (cohortFilter === 'critical') {
              const risk = calculateStateSimulatedRisk(state, scenarioParams).simulatedRisk;
              if (risk < 75) isDimmed = true;
            }

            return (
              <g key={stateId} className="transition-all cursor-pointer">
                <path
                  id={`state-path-${stateId}`}
                  d={pathObj.d}
                  fill={isDimmed ? '#141414' : fillColor}
                  fillOpacity={isDimmed ? 0.3 : isHovered ? 1 : 0.88}
                  stroke={isSelected ? '#d4af37' : isHovered ? '#ffffff' : '#262626'}
                  strokeWidth={isSelected ? 2.6 : isHovered ? 1.6 : 0.75}
                  strokeLinejoin="round"
                  onMouseEnter={() => setHoveredStateId(stateId)}
                  onMouseLeave={() => setHoveredStateId(null)}
                  onClick={() => onSelectState(stateId)}
                  className="transition-colors duration-150"
                  style={{
                    filter: isSelected
                      ? 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.8))'
                      : isHovered
                      ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))'
                      : undefined
                  }}
                />

                {/* State Label abbreviation */}
                {!['DC', 'RI', 'DE', 'MD', 'CT', 'MA', 'NJ', 'NH', 'VT'].includes(stateId) && (
                  <text
                    x={pathObj.labelX}
                    y={pathObj.labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isDimmed ? '#444444' : '#ffffff'}
                    fillOpacity={isDimmed ? 0.35 : 0.9}
                    fontSize="9.5"
                    fontWeight="600"
                    className="pointer-events-none font-mono"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                  >
                    {stateId}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredState && hoveredRisk && (
          <div
            id="state-hover-tooltip"
            className="absolute top-4 right-4 bg-[#0a0a0a]/95 border border-[#d4af37]/40 text-[#f2f2f2] p-3.5 rounded-xl shadow-2xl backdrop-blur-md w-72 pointer-events-none transition-all z-20"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <span className="text-xs font-mono font-bold text-[#d4af37] mr-1.5">[{hoveredState.id}]</span>
                <span className="text-sm font-serif italic text-white">{hoveredState.name}</span>
              </div>
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                hoveredRisk.riskCategory === 'Crítico' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
                hoveredRisk.riskCategory === 'Muy Alto' ? 'bg-orange-500/20 text-orange-300 border-orange-500/40' :
                hoveredRisk.riskCategory === 'Alto' ? 'bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/40' :
                'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {hoveredRisk.riskCategory}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div className="bg-[#050505] p-2.5 rounded border border-white/10">
                <span className="text-white/40 text-[10px] uppercase tracking-wider block">Riesgo L4</span>
                <span className="text-xl font-serif text-[#d4af37]">
                  {hoveredRisk.simulatedRisk}
                  <span className="text-[10px] text-white/40 font-mono"> / 100</span>
                </span>
              </div>
              <div className="bg-[#050505] p-2.5 rounded border border-white/10">
                <span className="text-white/40 text-[10px] uppercase tracking-wider block">Exceso ED</span>
                <span className="text-xl font-serif text-red-400">
                  +{hoveredRisk.excessEdRate}
                  <span className="text-[10px] text-white/40 font-mono"> / 100k</span>
                </span>
              </div>
            </div>

            <div className="mt-2 text-[11px] space-y-1 text-white/70 pt-2 border-t border-white/10">
              <div className="flex justify-between">
                <span className="text-white/40">Vulnerabilidad (SVI):</span>
                <span className="font-mono text-white/90">{(hoveredState.sviOverall * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Sin Aire Acondicionado:</span>
                <span className="font-mono text-white/90">{hoveredState.laceLackAcPercent.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">EPHT Tasa Real (#440):</span>
                <span className="font-mono text-white/90">
                  {hoveredState.ephtRate440 ? `${hoveredState.ephtRate440.toFixed(1)}/100k` : 'No reporta (2023)'}
                </span>
              </div>
              {hoveredState.representativeCounties.length > 0 && (
                <div className="text-[10px] text-[#d4af37] pt-1 uppercase tracking-wider font-mono">
                  Click para explorar {hoveredState.representativeCounties[0].name}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Legend in bottom-left */}
        <div className="absolute bottom-3 left-3 bg-[#050505]/95 border border-white/10 p-3 rounded text-xs backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between gap-4 mb-1.5">
            <span className="font-serif italic text-white/90 text-xs">{metricDef.shortLabel}</span>
            <span className="text-[10px] text-white/40 font-mono">{metricDef.unit}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-white/40 font-mono">{metricDef.format(metricDef.min)}</span>
            <div className="flex h-2.5 w-32 rounded overflow-hidden border border-white/20">
              {metricDef.colorScale.map((col, idx) => (
                <div key={idx} className="flex-1 h-full" style={{ backgroundColor: col }} />
              ))}
            </div>
            <span className="text-[10px] text-white/40 font-mono">{metricDef.format(metricDef.max)}</span>
          </div>
        </div>

        {/* Active Selection Indicator in bottom-right */}
        <div className="absolute bottom-3 right-3 bg-[#050505]/95 border border-white/10 px-3.5 py-1.5 rounded text-xs text-white/70 flex items-center gap-2 shadow-lg">
          <span className="text-white/40 text-[11px] uppercase tracking-wider">Estado Activo:</span>
          <span className="font-serif italic text-[#d4af37] text-sm">{statesData[selectedStateId]?.name || selectedStateId}</span>
          <span className="text-[10px] text-white/40 font-mono">({selectedStateId})</span>
        </div>
      </div>

      {/* Sub-bar showing key scientific notes */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 text-[11px] text-white/40 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0" />
          <span>
            <strong className="text-white/80">Fusión de dos escalas:</strong> Dinámica temporal calibrada en serie diaria VA (Medida 1385) y modificadores espaciales condales en EPHT y PLACES.
          </span>
        </div>
        <div className="font-mono text-white/40 text-[10px] uppercase tracking-wider">
          16 Estados Reportantes (2023) · Efectos Fijos Estatales Activados
        </div>
      </div>
    </div>
  );
};
