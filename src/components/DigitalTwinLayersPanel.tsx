import React, { useState } from 'react';
import { DIGITAL_TWIN_LAYERS } from '../data/usStatesData';
import { Layers, CheckCircle, Database, RefreshCw, Cpu, GitCommit, LineChart } from 'lucide-react';

export const DigitalTwinLayersPanel: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5'>('L5');

  const activeInfo = DIGITAL_TWIN_LAYERS.find(l => l.layer === selectedLayer) || DIGITAL_TWIN_LAYERS[5];

  const getLayerIcon = (layer: string) => {
    switch (layer) {
      case 'L0': return <GitCommit className="w-4 h-4 text-emerald-400" />;
      case 'L1': return <Database className="w-4 h-4 text-cyan-400" />;
      case 'L2': return <RefreshCw className="w-4 h-4 text-blue-400" />;
      case 'L3': return <Cpu className="w-4 h-4 text-purple-400" />;
      case 'L4': return <Layers className="w-4 h-4 text-amber-400" />;
      case 'L5': return <LineChart className="w-4 h-4 text-rose-400" />;
      default: return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div id="digital-twin-layers-card" className="bg-[#080808] border border-white/10 rounded-xl p-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-full bg-[#161616] border border-[#d4af37]/40 text-[#d4af37]">
            <Layers className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div>
            <h3 className="text-base font-serif italic text-white flex items-center gap-2">
              Formal 6-Layer Digital Twin Architecture (§6)
              <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37]">
                L0 to L5 Closed-Loop System
              </span>
            </h3>
            <p className="text-xs text-white/50">
              ¿Por qué es un gemelo genuino y no solo un modelo offline? Estado persistente, sincronización y retroalimentación L5.
            </p>
          </div>
        </div>

        <div className="text-[11px] font-mono text-white/60 bg-[#050505] px-3 py-1.5 rounded border border-white/10">
          Estado: <span className="text-[#d4af37] font-semibold">Operativo en Producción</span>
        </div>
      </div>

      {/* Layer Stack Interactive Diagram */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
        {DIGITAL_TWIN_LAYERS.map((layer) => {
          const isSelected = selectedLayer === layer.layer;
          return (
            <button
              key={layer.layer}
              onClick={() => setSelectedLayer(layer.layer)}
              className={`p-3 rounded text-left transition-all border relative overflow-hidden ${
                isSelected
                  ? 'bg-[#141414] border-[#d4af37] shadow-md ring-1 ring-[#d4af37]/40'
                  : 'bg-[#050505] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                  {getLayerIcon(layer.layer)}
                  {layer.layer}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
              </div>
              <div className={`text-xs font-serif ${isSelected ? 'text-[#d4af37]' : 'text-white/70'} truncate`}>
                {layer.name.split('·')[0]}
              </div>
              <div className="text-[9px] text-white/40 mt-1 uppercase tracking-wider font-mono">
                {layer.status}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Layer Deep-Dive Card */}
      <div className="bg-[#050505] p-5 rounded border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded font-mono text-xs font-bold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/40">
              {activeInfo.layer}
            </span>
            <h4 className="text-base font-serif italic text-white">
              {activeInfo.name}
            </h4>
          </div>
          <div className="text-[11px] text-white/40 uppercase tracking-widest font-mono">
            Capa de Arquitectura del Gemelo
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Purpose & Defense */}
          <div className="space-y-3.5">
            <div>
              <span className="text-white/40 font-medium block mb-1 uppercase tracking-wider text-[10px]">
                Propósito Funcional:
              </span>
              <p className="text-white/80 leading-relaxed bg-[#0a0a0a] p-3 rounded border border-white/10">
                {activeInfo.purpose}
              </p>
            </div>

            <div>
              <span className="text-[#d4af37] font-medium block mb-1 uppercase tracking-wider text-[10px]">
                Defensa Ante el Jurado / Revisor (§6):
              </span>
              <p className="text-white/90 leading-relaxed bg-[#0e0e0e] p-3 rounded border border-[#d4af37]/30 italic font-serif">
                "{activeInfo.defenseArgument}"
              </p>
            </div>
          </div>

          {/* Technical Specifications */}
          <div>
            <span className="text-white/40 font-medium block mb-1 uppercase tracking-wider text-[10px]">
              Metadatos y Parámetros Operativos:
            </span>
            <div className="bg-[#0a0a0a] rounded border border-white/10 divide-y divide-white/5 font-mono text-xs">
              {Object.entries(activeInfo.details).map(([k, v]) => (
                <div key={k} className="flex justify-between items-center p-2.5">
                  <span className="text-white/40">{k}:</span>
                  <span className="text-white/90 font-semibold">{v}</span>
                </div>
              ))}
            </div>

            {/* Special Highlight for L5 */}
            {activeInfo.layer === 'L5' && (
              <div className="mt-3.5 p-3 rounded bg-[#0a0a0a] border border-[#d4af37]/30 text-xs text-white/70">
                <strong className="text-[#d4af37]">¿Por qué L5 es la joya del gemelo?</strong> Cada año que CDC EPHT publica nuevos consolidados anuales, el sistema rescata automáticamente de L0 sus predicciones emitidas en tiempo real, calcula el error de calibración y detecta si hubo deriva temporal o climática.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
