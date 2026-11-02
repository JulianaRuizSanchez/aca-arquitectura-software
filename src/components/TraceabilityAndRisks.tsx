import React, { useState } from 'react';
import {
  SGA_TRACEABILITY_MATRIX,
  TECHNICAL_RISKS_AND_SPOF,
  TraceabilityItem,
  TechnicalRisk,
} from '../data/architectureData';
import {
  CheckSquare,
  AlertTriangle,
  Shield,
  Zap,
  Activity,
  Layers,
  Search,
  Server,
  Lock,
  RefreshCw,
  Sliders,
  ChevronDown,
  ChevronUp,
  Database,
  CheckCircle2,
  Cpu,
} from 'lucide-react';

export const TraceabilityAndRisks: React.FC = () => {
  const [selectedRfFilter, setSelectedRfFilter] = useState<string>('ALL');
  const [selectedTraceId, setSelectedTraceId] = useState<string>(SGA_TRACEABILITY_MATRIX[0].id);
  const [activeRiskTab, setActiveRiskTab] = useState<string>(TECHNICAL_RISKS_AND_SPOF[0].id);

  const filteredTraceItems =
    selectedRfFilter === 'ALL'
      ? SGA_TRACEABILITY_MATRIX
      : SGA_TRACEABILITY_MATRIX.filter((item) => item.rfCode === selectedRfFilter);

  const activeTrace =
    SGA_TRACEABILITY_MATRIX.find((t) => t.id === selectedTraceId) || SGA_TRACEABILITY_MATRIX[0];

  const activeRisk =
    TECHNICAL_RISKS_AND_SPOF.find((r) => r.id === activeRiskTab) || TECHNICAL_RISKS_AND_SPOF[0];

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-sky-400 mb-1">
          <span>MATRIZ DE TRAZABILIDAD & GESTIÓN DE RIESGOS TÉCNICOS</span>
          <span className="text-slate-600">·</span>
          <span>ESTÁNDAR ISO/IEC 25010 & SEI ATAM</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-sky-400" />
          <span>Matriz de Trazabilidad (RF ↔ RNF ↔ Componentes) y Puntos Únicos de Falla (SPOF)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-4xl">
          Relación formal y bidireccional entre los requerimientos funcionales solicitados (Autenticación, Roles, Gestión de estudiantes, Matrícula, Calificaciones) y los requerimientos no funcionales (Seguridad, Rendimiento, Disponibilidad, Escalabilidad, Mantenibilidad) frente a los componentes lógicos del Monolito Modular, complementado con la identificación y mitigación rigurosa de 3 riesgos técnicos críticos.
        </p>
      </div>

      {/* SECTION 1: MATRIZ DE TRAZABILIDAD EN TABLA */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>1. Propuesta de Matriz de Trazabilidad en Formato de Tabla</span>
            </h3>
            <p className="text-xs text-slate-400">
              Mapeo de requerimientos con componentes lógicos, esquemas de BD, tácticas de diseño y validación.
            </p>
          </div>

          {/* Quick Filter Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs overflow-x-auto">
            <span className="text-[11px] font-mono text-slate-400 px-2 flex items-center gap-1">
              <Search className="w-3 h-3" /> Filtrar RF:
            </span>
            <button
              onClick={() => setSelectedRfFilter('ALL')}
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                selectedRfFilter === 'ALL'
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Todos (5)
            </button>
            {SGA_TRACEABILITY_MATRIX.map((item) => (
              <button
                key={item.rfCode}
                onClick={() => setSelectedRfFilter(item.rfCode)}
                className={`px-2.5 py-1 rounded text-xs font-mono cursor-pointer transition-colors ${
                  selectedRfFilter === item.rfCode
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {item.rfCode}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 border-b border-slate-800 font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-4 py-3 min-w-[200px]">
                    Requerimiento Funcional (RF)
                  </th>
                  <th scope="col" className="px-4 py-3 min-w-[280px]">
                    Requerimientos No Funcionales (RNF) & Criterio
                  </th>
                  <th scope="col" className="px-4 py-3 min-w-[240px]">
                    Componente Lógico & Esquema
                  </th>
                  <th scope="col" className="px-4 py-3 min-w-[220px]">
                    Interfaces Provistas
                  </th>
                  <th scope="col" className="px-4 py-3 min-w-[220px]">
                    Mecanismo de Verificación
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredTraceItems.map((item) => {
                  const isSelected = item.id === activeTrace.id;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedTraceId(item.id)}
                      className={`transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-sky-950/30 border-l-2 border-l-sky-400'
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Column 1: RF */}
                      <td className="px-4 py-3.5 align-top">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
                            {item.rfCode}
                          </span>
                        </div>
                        <div className="font-bold text-white mt-1 text-sm">{item.rfName}</div>
                      </td>

                      {/* Column 2: RNFs */}
                      <td className="px-4 py-3.5 align-top space-y-2">
                        {item.rnfMappings.map((m) => (
                          <div key={m.rnfCode} className="text-[11px] leading-relaxed">
                            <span className="font-mono font-semibold text-sky-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 mr-1.5">
                              {m.rnfCode} · {m.rnfName}
                            </span>
                            <span className="text-slate-300">{m.targetCriteria}</span>
                          </div>
                        ))}
                      </td>

                      {/* Column 3: Componente & Esquema */}
                      <td className="px-4 py-3.5 align-top space-y-1.5">
                        <div className="font-semibold text-white text-xs">{item.logicalComponent}</div>
                        <div className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-sky-400 border border-slate-800">
                          {item.componentType}
                        </div>
                        <div className="font-mono text-[11px] text-slate-400">
                          <span className="text-slate-400">Esquema:</span> <span className="text-sky-300">{item.dbSchema}</span>
                        </div>
                      </td>

                      {/* Column 4: Interfaces */}
                      <td className="px-4 py-3.5 align-top font-mono text-[11px] space-y-1">
                        {item.providedInterfaces.map((iface, i) => (
                          <div key={i} className="text-sky-300 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 truncate">
                            {iface}
                          </div>
                        ))}
                      </td>

                      {/* Column 5: Verificación */}
                      <td className="px-4 py-3.5 align-top text-xs text-slate-300 leading-relaxed">
                        <div className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item.verificationMethod}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Deep Dive Card for Selected Traceability Item */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 text-xs">
                Auditoría Detallada: {activeTrace.rfCode}
              </span>
              <span className="font-bold text-white text-sm">{activeTrace.rfName}</span>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Componente Responsable: <span className="text-sky-300 font-semibold">{activeTrace.logicalComponent}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeTrace.rnfMappings.map((rnf) => (
              <div key={rnf.rnfCode} className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-400">
                    {rnf.rnfCode} · {rnf.rnfName}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 leading-relaxed">
                  <span className="text-slate-400 font-medium">Criterio: </span>
                  {rnf.targetCriteria}
                </div>
                <div className="text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span className="text-emerald-400 font-mono text-[10px] uppercase font-bold">Táctica: </span>
                  {rnf.tacticApplied}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: RIESGOS TÉCNICOS Y PUNTOS ÚNICOS DE FALLA (SPOF) */}
      <section className="space-y-4 pt-4 border-t border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <span>RESILIENCIA, TOLERANCIA A FALLOS & ANÁLISIS DE IMPACTO</span>
          </div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>2. Identificación de 3 Riesgos Técnicos o Puntos Únicos de Falla (SPOF) y Mitigaciones</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-4xl">
            Evaluación preventiva de las vulnerabilidades estructurales en la arquitectura de Monolito Modular con PostgreSQL y Redis ante una concurrencia de 300 usuarios y alta contención transaccional.
          </p>
        </div>

        {/* Risk Tab Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {TECHNICAL_RISKS_AND_SPOF.map((risk) => {
            const isSelected = risk.id === activeRisk.id;
            return (
              <button
                key={risk.id}
                onClick={() => setActiveRiskTab(risk.id)}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500/80 ring-1 ring-amber-500/30 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {risk.riskCode}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      risk.severity === 'Crítica'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    Severidad {risk.severity}
                  </span>
                </div>
                <div className="font-bold text-sm text-white line-clamp-2 leading-snug">{risk.title}</div>
                <div className="text-[11px] font-mono text-slate-400 mt-2 truncate">
                  SPOF: {risk.spofComponent}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Risk Detailed Dossier */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 space-y-6 shadow-xl">
          {/* Header of Active Risk */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono mb-1">
                <span className="text-amber-400 font-bold">{activeRisk.riskCode}</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400">{activeRisk.category}</span>
                <span className="text-slate-600">·</span>
                <span className="text-rose-400 font-bold">Severidad {activeRisk.severity}</span>
              </div>
              <h4 className="text-lg font-bold text-white tracking-tight">{activeRisk.title}</h4>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-right sm:min-w-[220px]">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Componente Vulnerable (SPOF):</div>
              <div className="text-xs font-mono font-bold text-amber-300 mt-0.5">{activeRisk.spofComponent}</div>
            </div>
          </div>

          {/* Failure Scenario & SLA Impact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-1.5 font-mono text-xs text-rose-400 font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Escenario de Falla Potencial:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{activeRisk.failureScenario}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-1.5 font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">
                <Activity className="w-4 h-4" />
                <span>Impacto en SLA (99.5%) y Atributos de Calidad:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{activeRisk.impactOnSlaAndRnf}</p>
            </div>
          </div>

          {/* 3 Senior Mitigation Strategies */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Estrategias de Mitigación Arquitectónica (3 Tácticas Clave):</span>
              </h5>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Resiliencia Garantizada
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {activeRisk.mitigationStrategies.map((strat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-emerald-500/30">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-white text-xs leading-snug">{strat.tactic}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{strat.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Meta:</span>
                    <span className="text-emerald-400 font-semibold">{strat.targetMetric}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification / Chaos Engineering */}
          <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/30 flex items-start gap-3">
            <Zap className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-mono text-sky-400 font-bold uppercase tracking-wider">
                Mecanismo de Verificación & Pruebas de Resiliencia (Chaos Engineering):
              </span>
              <p className="text-slate-300 leading-relaxed">{activeRisk.verificationMechanism}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
