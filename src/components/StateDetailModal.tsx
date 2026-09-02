import React from 'react';
import { StateData, ScenarioParams } from '../types';
import { calculateStateSimulatedRisk, calculateCountySimulatedRisk } from '../utils/simulationEngine';
import { X, MapPin, Building2, Shield, HeartPulse, Wind, ThermometerSnowflake, Check } from 'lucide-react';

interface StateDetailModalProps {
  state: StateData | null;
  isOpen: boolean;
  onClose: () => void;
  scenarioParams: ScenarioParams;
}

export const StateDetailModal: React.FC<StateDetailModalProps> = ({
  state,
  isOpen,
  onClose,
  scenarioParams
}) => {
  if (!isOpen || !state) return null;

  const stateRisk = calculateStateSimulatedRisk(state, scenarioParams);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div
        id="state-detail-dialog"
        className="bg-[#080808] border border-white/15 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#161616] border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center font-serif italic text-xl">
              {state.id}
            </div>
            <div>
              <h2 className="text-xl font-serif italic text-white flex items-center gap-2.5">
                {state.name}
                <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded border border-white/10 bg-[#050505] text-white/60">
                  Región HHS {state.hhsRegion} · FIPS {state.fips}
                </span>
              </h2>
              <p className="text-xs text-white/50">
                Perfil Epidemiológico y Desagregación ZCTA a Nivel Condado (Etapa C)
              </p>
            </div>
          </div>

          <button
            id="close-state-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full bg-[#141414] hover:bg-[#202020] text-white/60 hover:text-white transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6 text-xs">
          {/* Top Key Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#050505] p-3.5 rounded border border-white/10">
              <span className="text-white/40 block text-[10px] uppercase tracking-[0.15em]">Riesgo Simulado L4</span>
              <span className="text-2xl font-serif text-[#d4af37] block mt-1">
                {stateRisk.simulatedRisk}
                <span className="text-xs text-white/40 font-mono"> / 100</span>
              </span>
              <span className="text-[10px] text-[#d4af37]/80 font-serif italic">{stateRisk.riskCategory}</span>
            </div>

            <div className="bg-[#050505] p-3.5 rounded border border-white/10">
              <span className="text-white/40 block text-[10px] uppercase tracking-[0.15em]">Tasa EPHT Real (#440)</span>
              <span className="text-2xl font-serif text-white block mt-1">
                {state.ephtRate440 ? `${state.ephtRate440.toFixed(1)}` : 'N/A'}
                <span className="text-xs text-white/40 font-mono"> / 100k</span>
              </span>
              <span className="text-[10px] text-white/40">
                {state.isEphtReporting2023 ? 'Reporte 2023 Verificado' : 'No reporta (Usa VA #1385)'}
              </span>
            </div>

            <div className="bg-[#050505] p-3.5 rounded border border-white/10">
              <span className="text-white/40 block text-[10px] uppercase tracking-[0.15em]">Centinela VA (#1385)</span>
              <span className="text-2xl font-serif text-white block mt-1">
                {state.vaSentinelRate1385.toFixed(1)}
                <span className="text-xs text-white/40 font-mono"> / 100k</span>
              </span>
              <span className="text-[10px] text-white/40">Serie Diaria de Referencia</span>
            </div>

            <div className="bg-[#050505] p-3.5 rounded border border-white/10">
              <span className="text-white/40 block text-[10px] uppercase tracking-[0.15em]">Exceso Urgencias</span>
              <span className="text-2xl font-serif text-red-400 block mt-1">
                +{stateRisk.excessEdRate}
                <span className="text-xs text-white/40 font-mono"> / 100k</span>
              </span>
              <span className="text-[10px] text-red-400/80">Proyección bajo escenario</span>
            </div>
          </div>

          {/* SVI 4 Themes & Baselines */}
          <div className="bg-[#050505] p-4 rounded border border-white/10">
            <h3 className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#d4af37]" />
              Desglose de Vulnerabilidad Social CDC SVI 2022 (Temas 1 a 4)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="bg-[#0a0a0a] p-3 rounded border border-white/10">
                <span className="text-[10px] text-white/40 block uppercase tracking-wider">Tema 1: Socioeconómico</span>
                <span className="text-xl font-serif text-white mt-1 block">
                  {(state.sviTheme1_Socioeconomic * 100).toFixed(0)}%
                </span>
                <span className="text-[9px] text-white/40">Pobreza, desempleo, ingreso</span>
              </div>
              <div className="bg-[#0a0a0a] p-3 rounded border border-white/10">
                <span className="text-[10px] text-white/40 block uppercase tracking-wider">Tema 2: Composición</span>
                <span className="text-xl font-serif text-white mt-1 block">
                  {(state.sviTheme2_Household * 100).toFixed(0)}%
                </span>
                <span className="text-[9px] text-white/40">&gt;65 años solos, discapacidad</span>
              </div>
              <div className="bg-[#0a0a0a] p-3 rounded border border-white/10">
                <span className="text-[10px] text-white/40 block uppercase tracking-wider">Tema 3: Minorías</span>
                <span className="text-xl font-serif text-white mt-1 block">
                  {(state.sviTheme3_RacialMinority * 100).toFixed(0)}%
                </span>
                <span className="text-[9px] text-white/40">Raza, etnicidad, lengua</span>
              </div>
              <div className="bg-[#0a0a0a] p-3 rounded border border-white/10">
                <span className="text-[10px] text-white/40 block uppercase tracking-wider">Tema 4: Vivienda</span>
                <span className="text-xl font-serif text-white mt-1 block">
                  {(state.sviTheme4_HousingTransport * 100).toFixed(0)}%
                </span>
                <span className="text-[9px] text-white/40">Hacinamiento, sin vehículo</span>
              </div>
            </div>
          </div>

          {/* Representative Urban Counties & ZCTA Downscaling */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-white/80 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#d4af37]" />
                Desagregación ZCTA a Nivel Condado & Validación Externa
              </h3>
              <span className="text-[11px] font-mono text-[#d4af37]">
                Contraste contra CDC HHI #1504
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {state.representativeCounties.map((county) => {
                const simulatedCountyRisk = calculateCountySimulatedRisk(county, scenarioParams);
                return (
                  <div
                    key={county.fips}
                    className="bg-[#050505] p-4 rounded border border-white/10 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-base font-serif italic text-white flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                          {county.name}
                        </h4>
                        <span className="text-[10px] text-white/40 font-mono">
                          FIPS {county.fips} · ZCTA {county.zctaSample} · Pop: {county.population.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-serif text-[#d4af37]">
                          {simulatedCountyRisk} / 100
                        </span>
                        <span className="text-[9px] text-white/40 block font-mono">Riesgo L4 ZCTA</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                      <div className="bg-[#0a0a0a] p-2 rounded border border-white/10">
                        <span className="text-white/40 block text-[9px] font-mono">CDC HHI</span>
                        <span className="font-serif text-white text-sm">
                          P{county.hhiRank}
                        </span>
                      </div>
                      <div className="bg-[#0a0a0a] p-2 rounded border border-white/10">
                        <span className="text-white/40 block text-[9px] font-mono">Sin A/C</span>
                        <span className="font-serif text-[#d4af37] text-sm">
                          {county.lackAc.toFixed(1)}%
                        </span>
                      </div>
                      <div className="bg-[#0a0a0a] p-2 rounded border border-white/10">
                        <span className="text-white/40 block text-[9px] font-mono">Isla Calor</span>
                        <span className="font-serif text-white text-sm">
                          {county.urbanHeatIslandGini.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Policy Intervention Feasibility */}
                    <div className="p-2.5 rounded bg-[#0a0a0a] border border-[#d4af37]/30 text-[11px] text-white/80 flex items-center justify-between">
                      <span>
                        <strong className="text-[#d4af37]">Umbral Intervención (§9.3):</strong> ε = {(county.interventionFeasibilityEpsilon * 100).toFixed(0)}%
                      </span>
                      <span className="text-[10px] font-mono text-[#d4af37] bg-[#141414] px-2 py-0.5 rounded border border-[#d4af37]/40">
                        {county.interventionFeasibilityEpsilon <= 0.12 ? 'Alta Viabilidad' : 'Requiere Mayor Red'}
                      </span>
                    </div>

                    {county.calHeatScoreMatch !== undefined && (
                      <div className="p-2.5 rounded bg-[#0a0a0a] border border-white/10 text-[11px] text-white/70 flex justify-between">
                        <span>CalHeatScore Oficial: <strong className="text-white">{county.calHeatScoreMatch.toFixed(1)} / 4.0</strong></span>
                        <span className="font-mono text-white/40">API Pública OEHHA</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Methodological Context Note */}
          <div className="p-3.5 rounded bg-[#050505] border border-white/10 text-xs text-white/50">
            <strong className="text-white/80">Estrategia de Modelado:</strong> Este estado se modela con efectos fijos estatales para absorber discrepancias administrativas de codificación entre sistemas de vigilancia estatales (evitando el sesgo de rango observado de 4.2 a 57.7 por 100,000 en EPHT).
          </div>
        </div>
      </div>
    </div>
  );
};
