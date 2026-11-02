import React, { useState } from 'react';
import {
  OFFICIAL_FUNCTIONAL_REQUIREMENTS,
  OFFICIAL_NON_FUNCTIONAL_REQUIREMENTS,
  FunctionalRequirement,
  NonFunctionalRequirement,
} from '../data/architectureData';
import { FileText, SlidersHorizontal, CheckCircle2, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export const RequirementsMatrix: React.FC = () => {
  const [activeReqType, setActiveReqType] = useState<'rf' | 'rnf'>('rf');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>('rf-05'); // Expand matricula by default

  const modules = ['all', 'Estudiantes', 'Docentes', 'Matrículas', 'Calificaciones', 'Transversal'];
  const categories = [
    'all',
    'Rendimiento',
    'Disponibilidad',
    'Escalabilidad',
    'Seguridad',
    'Integridad',
    'Mantenibilidad',
    'Recuperabilidad',
    'Auditoría',
  ];

  const filteredRF = OFFICIAL_FUNCTIONAL_REQUIREMENTS.filter((rf) => {
    const matchesModule = selectedModule === 'all' || rf.module === selectedModule;
    const matchesSearch =
      rf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rf.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rf.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesSearch;
  });

  const filteredRNF = OFFICIAL_NON_FUNCTIONAL_REQUIREMENTS.filter((rnf) => {
    const matchesCategory = selectedCategory === 'all' || rnf.category === selectedCategory;
    const matchesSearch =
      rnf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rnf.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rnf.targetMetric.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rnf.architecturalTactic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner and Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" />
            <span>Matriz de Ingeniería de Requisitos (12 RF & 12 RNF)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Mapeo formal de requerimientos hacia tácticas arquitectónicas (SEI ATAM / ISO 25010).
          </p>
        </div>

        {/* Segmented Switcher RF vs RNF */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => {
              setActiveReqType('rf');
              setExpandedId('rf-05');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeReqType === 'rf'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            12 Funcionales (RF)
          </button>
          <button
            onClick={() => {
              setActiveReqType('rnf');
              setExpandedId('rnf-01');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeReqType === 'rnf'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            12 No Funcionales (RNF)
          </button>
        </div>
      </div>

      {/* Secondary Filter & Search Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Module or Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          <span className="text-slate-500 text-[11px] font-mono shrink-0 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" />
            Filtrar:
          </span>
          {activeReqType === 'rf'
            ? modules.map((mod) => (
                <button
                  key={mod}
                  onClick={() => setSelectedModule(mod)}
                  className={`px-2.5 py-1 rounded text-xs whitespace-nowrap cursor-pointer transition-colors ${
                    selectedModule === mod
                      ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/40'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
                  }`}
                >
                  {mod === 'all' ? 'Todos los Módulos' : mod}
                </button>
              ))
            : categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded text-xs whitespace-nowrap cursor-pointer transition-colors ${
                    selectedCategory === cat
                      ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/40'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
                  }`}
                >
                  {cat === 'all' ? 'Todas las Categorías' : cat}
                </button>
              ))}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Buscar en ${activeReqType === 'rf' ? 'RFs' : 'RNFs'}...`}
          className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 shrink-0 sm:w-60"
        />
      </div>

      {/* Table / List Container */}
      {activeReqType === 'rf' ? (
        <div className="space-y-3">
          {filteredRF.map((rf) => {
            const isExpanded = expandedId === rf.id;
            return (
              <div
                key={rf.id}
                className={`rounded-xl border transition-all ${
                  isExpanded
                    ? 'bg-slate-900/90 border-sky-500/50 shadow-md shadow-sky-500/5'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : rf.id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded">
                      {rf.code}
                    </span>
                    <div>
                      <div className="font-semibold text-sm text-white flex items-center gap-2">
                        <span>{rf.name}</span>
                        <span className="text-[11px] font-normal text-slate-400">· {rf.module}</span>
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">{rf.description}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                        rf.criticality === 'Crítica'
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : rf.criticality === 'Alta'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {rf.criticality}
                    </span>
                    <button className="text-xs text-sky-400 hover:underline font-mono">
                      {isExpanded ? 'Ocultar' : 'Detalles'}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 space-y-3 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                        <span className="font-mono text-slate-400 text-[11px] block mb-1">
                          Entradas & Salidas del Sistema:
                        </span>
                        <p className="text-slate-200 leading-relaxed">{rf.inputsOutputs}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                        <span className="font-mono text-amber-400 text-[11px] block mb-1 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          Riesgo de Concurrencia (300 usuarios):
                        </span>
                        <p className="text-slate-200 leading-relaxed">{rf.concurrencyRisk}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-sky-500/5 border border-sky-500/20">
                      <span className="font-mono text-sky-400 text-[11px] block mb-1 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-sky-400" />
                        Táctica Arquitectónica Implementada en Monolito Modular:
                      </span>
                      <p className="text-slate-200 font-mono text-[11px] leading-relaxed">
                        {rf.architecturalTactic}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRNF.map((rnf) => {
            const isExpanded = expandedId === rnf.id;
            return (
              <div
                key={rnf.id}
                className={`rounded-xl border transition-all ${
                  isExpanded
                    ? 'bg-slate-900/90 border-sky-500/50 shadow-md shadow-sky-500/5'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : rnf.id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      {rnf.code}
                    </span>
                    <div>
                      <div className="font-semibold text-sm text-white flex items-center gap-2">
                        <span>{rnf.name}</span>
                        <span className="text-[11px] font-normal text-slate-400">· {rnf.category}</span>
                      </div>
                      <div className="text-xs text-emerald-300 font-mono line-clamp-1 mt-0.5">
                        Métrica: {rnf.targetMetric}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {rnf.category}
                    </span>
                    <button className="text-xs text-sky-400 hover:underline font-mono">
                      {isExpanded ? 'Ocultar' : 'Detalles'}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 space-y-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                      <span className="font-mono text-slate-400 text-[11px] block mb-1">
                        Contexto Específico en el SGA:
                      </span>
                      <p className="text-slate-200 leading-relaxed">{rnf.contextSGA}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-sky-500/5 border border-sky-500/20">
                        <span className="font-mono text-sky-400 text-[11px] block mb-1 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                          Táctica Arquitectónica (SEI / Bass):
                        </span>
                        <p className="text-slate-200 font-mono text-[11px] leading-relaxed">
                          {rnf.architecturalTactic}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                        <span className="font-mono text-emerald-400 text-[11px] block mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Método de Verificación & QA:
                        </span>
                        <p className="text-slate-200 font-mono text-[11px] leading-relaxed">
                          {rnf.verificationMethod}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
