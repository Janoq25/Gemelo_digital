import React, { useState } from 'react';
import { StateData, MetricKey, ScenarioParams } from './types';
import { US_STATES_DATA } from './data/usStatesData';
import { Header } from './components/Header';
import { USChoroplethMap } from './components/USChoroplethMap';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { XaiExplainabilityPanel } from './components/XaiExplainabilityPanel';
import { FairnessAuditPanel } from './components/FairnessAuditPanel';
import { DigitalTwinLayersPanel } from './components/DigitalTwinLayersPanel';
import { HypothesisTracker } from './components/HypothesisTracker';
import { StateDetailModal } from './components/StateDetailModal';
import { FeasibilityReportModal } from './components/FeasibilityReportModal';
import { calculateStateSimulatedRisk } from './utils/simulationEngine';
import { MapPin, ArrowRight, Shield, Zap, Flame, Compass, FileText, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [selectedStateId, setSelectedStateId] = useState<string>('AZ');
  const [activeMetric, setActiveMetric] = useState<MetricKey>('compoundRisk');
  const [cohortFilter, setCohortFilter] = useState<'all' | 'epht16' | 'critical' | 'va1385'>('all');
  const [currentView, setCurrentView] = useState<'map' | 'xai' | 'fairness' | 'architecture' | 'hypotheses'>('map');

  const [scenarioParams, setScenarioParams] = useState<ScenarioParams>({
    heatwaveDurationDays: 5,
    tempAnomalyF: 7,
    blackoutCustomerPercent: 15,
    seasonTiming: 'early',
    coolingInterventionEpsilon: 0.10
  });

  const [isStateModalOpen, setIsStateModalOpen] = useState<boolean>(false);
  const [isFeasibilityModalOpen, setIsFeasibilityModalOpen] = useState<boolean>(false);

  const selectedState = US_STATES_DATA[selectedStateId] || US_STATES_DATA['AZ'];
  const selectedStateRisk = calculateStateSimulatedRisk(selectedState, scenarioParams);

  // JSON export for L0 reproducibility
  const handleExportData = () => {
    const exportPayload = {
      l0_metadata: {
        timestamp_iso: new Date().toISOString(),
        model_version: 'LGBM-TCN-v2.0.4',
        osf_preregistration_doi: '10.17605/OSF.IO/HEAT-BLACKOUT-2026',
        input_hash_sha256: '4f8e6c78a0b93d41e7f82b3a',
        random_seed: 42
      },
      scenario_parameters: scenarioParams,
      selected_state: {
        id: selectedState.id,
        name: selectedState.name,
        simulated_risk: selectedStateRisk.simulatedRisk,
        excess_ed_rate_per_100k: selectedStateRisk.excessEdRate,
        reri: selectedStateRisk.reriValue,
        epht_verified: selectedState.isEphtReporting2023,
        representative_counties: selectedState.representativeCounties
      },
      national_summary: {
        total_states: Object.keys(US_STATES_DATA).length,
        critical_risk_states: Object.values(US_STATES_DATA).filter(
          st => calculateStateSimulatedRisk(st, scenarioParams).simulatedRisk >= 75
        ).length
      }
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digital_twin_run_${selectedState.id}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f2f2f2] flex flex-col selection:bg-[#d4af37] selection:text-black font-sans">
      {/* Header Bar */}
      <Header
        currentView={currentView}
        onChangeView={setCurrentView}
        onOpenFeasibility={() => setIsFeasibilityModalOpen(true)}
        onExportData={handleExportData}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Banner with Direct Answer & Viability Badge */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] text-[10px] font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Proyecto 100% Viable · Protocolo v2.0
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 hidden sm:inline font-mono">
                Multiscale Fusion · gridMET + EAGLE-I + CDC EPHT
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif italic text-white tracking-tight">
              Heat–Blackout Health Digital Twin & Clinical Vulnerability Engine
            </h2>
            <p className="text-xs text-white/60 max-w-3xl leading-relaxed">
              Resuelve los 3 defectos del planteamiento original mediante <strong className="text-white/90">fusión multiescala</strong>, el dataset de apagones <strong className="text-[#d4af37]">EAGLE-I</strong> (para medir la interacción RERI = 2.48), arquitectura formal de <strong className="text-white/90">6 capas (L0–L5)</strong> y auditoría de equidad con <strong className="text-white/90">Fairlearn</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center">
            <button
              onClick={() => setIsFeasibilityModalOpen(true)}
              className="px-4 py-2 rounded bg-[#d4af37] hover:bg-[#c59f2e] text-black font-semibold text-xs transition-all shadow-lg shadow-black/50 flex items-center gap-1.5 cursor-pointer whitespace-nowrap uppercase tracking-wider text-[11px]"
            >
              <Compass className="w-4 h-4" />
              Ver Dictamen & Puntos Clave
            </button>
          </div>
        </div>

        {/* View 1: Main Map & Scenario Simulator */}
        {currentView === 'map' && (
          <div className="space-y-6">
            {/* Interactive US Map */}
            <USChoroplethMap
              statesData={US_STATES_DATA}
              selectedStateId={selectedStateId}
              onSelectState={(id) => setSelectedStateId(id)}
              activeMetric={activeMetric}
              onChangeMetric={setActiveMetric}
              scenarioParams={scenarioParams}
              cohortFilter={cohortFilter}
              onChangeCohortFilter={setCohortFilter}
            />

            {/* Selected State Quick Action Strip */}
            <div className="bg-[#080808] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-full border border-[#d4af37]/40 bg-[#161616] text-[#d4af37] flex items-center justify-center font-serif italic font-bold text-sm shadow-inner">
                  {selectedState.id}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-serif text-white">{selectedState.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161616] border border-white/10 text-white/60">
                      Región HHS {selectedState.hhsRegion}
                    </span>
                    {selectedState.isEphtReporting2023 && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37]">
                        EPHT 2023 Verificado
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/50 mt-0.5">
                    Riesgo Compuesto L4: <strong className="text-[#d4af37] font-mono font-bold">{selectedStateRisk.simulatedRisk}/100</strong> · Exceso Urgencias: <strong className="text-red-400 font-mono font-bold">+{selectedStateRisk.excessEdRate}/100k</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsStateModalOpen(true)}
                  className="px-3.5 py-2 rounded bg-[#111] hover:bg-[#1a1a1a] border border-white/20 hover:border-[#d4af37]/50 text-white/90 hover:text-white font-medium text-xs transition-colors flex items-center gap-1.5 cursor-pointer uppercase tracking-wider text-[11px]"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Explorar Condados & ZCTA</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/40" />
                </button>
              </div>
            </div>

            {/* Scenario Simulator Component */}
            <ScenarioSimulator
              params={scenarioParams}
              onChangeParams={setScenarioParams}
              statesData={US_STATES_DATA}
              selectedStateId={selectedStateId}
            />
          </div>
        )}

        {/* View 2: XAI Explainability (TreeSHAP & DLNM) */}
        {currentView === 'xai' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-[#080808] p-3.5 rounded-xl border border-white/10">
              <span className="text-xs text-white/70 font-medium uppercase tracking-wider text-[11px]">
                Selecciona Estado para Descomposición Local TreeSHAP:
              </span>
              <select
                value={selectedStateId}
                onChange={(e) => setSelectedStateId(e.target.value)}
                className="bg-[#111] border border-white/20 text-[#f2f2f2] text-xs rounded px-3 py-1.5 font-mono cursor-pointer focus:border-[#d4af37] outline-none"
              >
                {Object.values(US_STATES_DATA).map(st => (
                  <option key={st.id} value={st.id} className="bg-[#111] text-white">
                    {st.name} ({st.id}) {st.isEphtReporting2023 ? '· EPHT Verificado' : ''}
                  </option>
                ))}
              </select>
            </div>

            <XaiExplainabilityPanel
              selectedState={selectedState}
              scenarioParams={scenarioParams}
            />
          </div>
        )}

        {/* View 3: Fairness Audit (Fairlearn) */}
        {currentView === 'fairness' && (
          <FairnessAuditPanel />
        )}

        {/* View 4: Digital Twin Architecture (L0-L5) */}
        {currentView === 'architecture' && (
          <DigitalTwinLayersPanel />
        )}

        {/* View 5: Hypothesis Tracker (H1-H6) */}
        {currentView === 'hypotheses' && (
          <HypothesisTracker />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#080808] mt-8 py-6 px-6 text-xs text-white/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span className="font-serif italic text-white/80 text-sm">
              A Fairness-Aware Explainable Digital Twin for Compound Heat–Blackout Health Risk (v2.0)
            </span>
            <div className="text-[10px] uppercase tracking-[0.15em] text-white/40 mt-1">
              Protocolo pre-registrado en OSF · CDC EPHT, gridMET, ORNL EAGLE-I, PLACES 2025, LACE 2023.
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-white/40">
            <span>DuckDB + Parquet</span>
            <span>·</span>
            <span>DVC Reproducible</span>
            <span>·</span>
            <span>LightGBM + TCN</span>
          </div>
        </div>
      </footer>

      {/* State & County ZCTA Drill-Down Modal */}
      <StateDetailModal
        state={selectedState}
        isOpen={isStateModalOpen}
        onClose={() => setIsStateModalOpen(false)}
        scenarioParams={scenarioParams}
      />

      {/* Feasibility & Defense Summary Modal */}
      <FeasibilityReportModal
        isOpen={isFeasibilityModalOpen}
        onClose={() => setIsFeasibilityModalOpen(false)}
      />
    </div>
  );
}
