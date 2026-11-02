import React, { useState } from 'react';
import { ARCHITECTURAL_DECISIONS, ADR } from '../data/architectureData';
import { ShieldCheck, FileCheck, CheckCircle2, AlertOctagon, Sparkles, Filter, ChevronRight, Layers, Database, Cpu, Cloud } from 'lucide-react';

export const AdrExplorer: React.FC = () => {
  const [selectedAdrId, setSelectedAdrId] = useState<string>(ARCHITECTURAL_DECISIONS[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredAdrs = ARCHITECTURAL_DECISIONS.filter(
    (adr) =>
      adr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adr.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adr.decision.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedAdr = ARCHITECTURAL_DECISIONS.find((adr) => adr.id === selectedAdrId) || ARCHITECTURAL_DECISIONS[0];

  const getAdrIcon = (id: string) => {
    switch (id) {
      case 'adr-01':
        return Layers;
      case 'adr-02':
        return Database;
      case 'adr-03':
        return Cpu;
      case 'adr-04':
        return Cloud;
      default:
        return FileCheck;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            <span>Decisiones Arquitectónicas Justificadas (Architecture Decision Records - ADRs)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            4 decisiones formales bajo estándar IEEE / Michael Nygard que resuelven los atributos de calidad del SGA.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar ADRs..."
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of ADRs */}
        <div className="lg:col-span-4 space-y-2">
          {filteredAdrs.map((adr) => {
            const isSelected = adr.id === selectedAdr.id;
            const Icon = getAdrIcon(adr.id);

            return (
              <button
                key={adr.id}
                onClick={() => setSelectedAdrId(adr.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-slate-900 border-sky-500 ring-1 ring-sky-500/30'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-sky-400 font-semibold">{adr.number}</span>
                  <span className="text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {adr.status}
                  </span>
                </div>
                <div className="font-semibold text-xs text-white line-clamp-2 leading-snug mb-1">
                  {adr.title}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Fecha: {adr.date}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-400' : 'text-slate-600'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-8 rounded-xl bg-slate-900/80 border border-slate-800 p-6 space-y-6">
          {/* Header */}
          <div className="border-b border-slate-800 pb-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-sky-400 mb-2">
              <span className="font-bold">{selectedAdr.number}</span>
              <span className="text-slate-600">·</span>
              <span>{selectedAdr.status}</span>
              <span className="text-slate-600">·</span>
              <span>Fecha: {selectedAdr.date}</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">{selectedAdr.title}</h3>
          </div>

          {/* Contexto */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              1. Contexto & Planteamiento del Problema
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-lg border border-slate-800/80">
              {selectedAdr.context}
            </p>
          </div>

          {/* Drivers */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              2. Fuerzas Conductoras (Decision Drivers)
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {selectedAdr.decisionDrivers.map((driver, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-950/30 border border-slate-800/60 text-slate-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                  <span>{driver}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Considered Options */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              3. Opciones Consideradas y Trade-offs
            </h4>
            <div className="space-y-2.5">
              {selectedAdr.consideredOptions.map((opt, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border text-xs ${
                    opt.name.includes('(Elegida)')
                      ? 'bg-sky-500/5 border-sky-500/40 text-slate-200'
                      : 'bg-slate-950/30 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="font-semibold text-white mb-1 flex items-center justify-between">
                    <span>{opt.name}</span>
                    {opt.name.includes('(Elegida)') && (
                      <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                        DECISIÓN SELECCIONADA
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/60">
                    <div>
                      <span className="text-[11px] font-medium text-emerald-400 block mb-0.5">Pros:</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{opt.pros}</p>
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-amber-400 block mb-0.5">Contras:</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{opt.cons}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decision */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>4. Decisión Arquitectónica Adoptada</span>
            </h4>
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-emerald-500/5 p-4 rounded-lg border border-emerald-500/20 whitespace-pre-line font-mono text-[12px]">
              {selectedAdr.decision}
            </div>
          </div>

          {/* Consequences: Positive vs Tradeoffs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="text-xs font-mono uppercase text-emerald-400 font-semibold">
                Consecuencias Positivas
              </h5>
              <ul className="space-y-2 text-xs text-slate-300">
                {selectedAdr.consequencesPositive.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-mono uppercase text-amber-400 font-semibold">
                Compromisos & Mitigaciones (Trade-offs)
              </h5>
              <ul className="space-y-2 text-xs text-slate-300">
                {selectedAdr.consequencesNegativeOrTradeoffs.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quality Attributes Impact */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              5. Impacto en Atributos de Calidad (RNFs)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {selectedAdr.qualityAttributesImpacted.map((qa, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                  <div className="font-mono text-sky-400 font-semibold mb-1">{qa.attribute}</div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">{qa.impact}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Validation Tactics */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1.5">
            <div className="font-mono text-slate-400 uppercase text-[11px] flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-sky-400" />
              <span>Tácticas de Verificación Empírica</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
              {selectedAdr.validationTactics}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
