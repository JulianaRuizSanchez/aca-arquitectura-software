import React, { useState } from 'react';
import { LOGICAL_COMPONENTS, LogicalComponent } from '../data/architectureData';
import { Cpu, Layers, Database, ArrowRight, ShieldCheck, CheckCircle2, Zap, GitBranch, Key, BookOpen, Calendar, Award, FileSpreadsheet, Eye } from 'lucide-react';

export const LogicalComponentModel: React.FC = () => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(LOGICAL_COMPONENTS[0].id);

  const selectedModule = LOGICAL_COMPONENTS.find((m) => m.id === selectedModuleId) || LOGICAL_COMPONENTS[0];

  const getModuleIcon = (id: string) => {
    switch (id) {
      case 'comp-auth':
        return Key;
      case 'comp-academica':
        return BookOpen;
      case 'comp-matricula':
        return Calendar;
      case 'comp-calificaciones':
        return Award;
      case 'comp-reportes':
        return FileSpreadsheet;
      case 'comp-auditoria':
        return Eye;
      default:
        return Cpu;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-sky-400 mb-1">
          <span>ARQUITECTURA DE SOFTWARE · MODELO DE COMPONENTES LÓGICOS</span>
          <span className="text-slate-600">·</span>
          <span>ESTILO: MONOLITO MODULAR</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Cpu className="w-5 h-5 text-sky-400" />
          <span>Estructura de Componentes Lógicos, Interfaces y Dependencias</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-4xl">
          Organización formal de los 6 módulos autónomos del SGA: límites de contexto (Bounded Contexts), interfaces públicas tipadas, esquemas de persistencia aislados y flujo de eventos desacoplado sin dependencias circulares.
        </p>
      </div>

      {/* High-Level Visual Architecture Map */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-5">
        <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
          <span className="font-mono text-slate-400 uppercase tracking-wider">
            Diagrama Visual de Componentes & Flujo de Invocación In-Process (DAG)
          </span>
          <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            0% Dependencias Circulares
          </span>
        </div>

        {/* Visual Architectural Stack Diagram */}
        <div className="space-y-3 font-mono text-xs">
          {/* Layer 1: API Gateway / Presentation */}
          <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/30 text-center text-sky-300 font-semibold">
            Capa de Presentación / Endpoints REST (Controladores HTTP, Validación Zod, OpenAPI)
          </div>

          {/* Layer 2: Core Domain Modules with dependency connectors */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-[11px]">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-200">
              <span className="text-sky-400 block font-bold">1. Autenticación</span>
              <span className="text-slate-500 text-[10px]">IRbacService</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-200">
              <span className="text-emerald-400 block font-bold">2. Gestión Académica</span>
              <span className="text-slate-500 text-[10px]">IAcademicCatalogService</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-rose-500/40 text-slate-200">
              <span className="text-rose-400 block font-bold">3. Matrículas (ACID)</span>
              <span className="text-slate-500 text-[10px]">IEnrollmentService</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-200">
              <span className="text-purple-400 block font-bold">4. Calificaciones</span>
              <span className="text-slate-500 text-[10px]">IGradingService</span>
            </div>
          </div>

          {/* Layer 3: Support & Reporting */}
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-center text-amber-300 text-[11px]">
            5. Módulo de Reportes & Consultas (Lecturas Agregadas, Vistas Read-Only, BullMQ Worker)
          </div>

          {/* Layer 4: Event Bus & Audit */}
          <div className="p-2.5 rounded bg-slate-950 border border-emerald-500/30 text-center text-emerald-300 text-[11px]">
            6. Módulo de Auditoría Inmutable (Event Listeners en Memoria → Append-Only Table)
          </div>
        </div>

        {/* Modular Grid of the 6 Components */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
          {LOGICAL_COMPONENTS.map((comp) => {
            const isSelected = comp.id === selectedModule.id;
            const Icon = getModuleIcon(comp.id);
            const isHotspot = comp.type.includes('Hotspot');

            return (
              <button
                key={comp.id}
                onClick={() => setSelectedModuleId(comp.id)}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-slate-900 border-sky-500 ring-1 ring-sky-500/30 shadow-md shadow-sky-500/10'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">
                      {comp.type === 'Core Domain' ? 'Núcleo' : comp.type === 'Cross-Cutting' ? 'Transversal' : 'Soporte'}
                    </span>
                  </div>

                  {isHotspot && (
                    <span className="text-[10px] font-mono text-rose-300 bg-rose-500/15 px-1.5 py-0.5 rounded border border-rose-500/30">
                      Concurrencia Crítica
                    </span>
                  )}
                </div>

                <div className="font-bold text-sm text-white mb-1 leading-snug">{comp.name}</div>
                <div className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{comp.summary}</div>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] font-mono">
                  <span className="text-slate-500">Schema: {comp.databaseSchema.split(' ')[0]}</span>
                  <span className="text-sky-400 hover:underline">Ver Contratos →</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Module Deep-Dive Inspector */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 space-y-6">
        {/* Module Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-sky-400 uppercase tracking-wider">Inspección de Módulo</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-semibold text-emerald-400">{selectedModule.type}</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">{selectedModule.name}</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">{selectedModule.summary}</p>
          </div>

          <div className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs shrink-0 font-mono">
            <span className="text-slate-500 block text-[11px]">Esquema de Base de Datos:</span>
            <span className="text-purple-300 font-semibold">{selectedModule.databaseSchema}</span>
          </div>
        </div>

        {/* Responsibilities */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Responsabilidades del Componente</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {selectedModule.responsibilities.map((resp, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-200 leading-relaxed flex items-start gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                <span>{resp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Provided Interfaces (Facade Contracts) */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-2.5 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interfaces Provistas (Public API / Contratos del Módulo)</span>
          </h4>
          <div className="space-y-3">
            {selectedModule.providedInterfaces.map((iface, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-300">{iface.name}</span>
                  <span className="text-[11px] text-slate-400">{iface.description}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#080b11] border border-slate-800/80 font-mono text-[11px] text-emerald-300 space-y-1 overflow-x-auto">
                  {iface.methods.map((method, mIdx) => (
                    <div key={mIdx} className="whitespace-nowrap">
                      {method}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dependencies (Consumed Interfaces) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
              <span>Dependencias Hacia Otros Módulos (Consumo)</span>
            </h4>
            {selectedModule.consumedInterfaces.length > 0 ? (
              <div className="space-y-2">
                {selectedModule.consumedInterfaces.map((dep, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-white font-semibold">
                      <span>{dep.module}</span>
                      <span className="font-mono text-[11px] text-sky-400">{dep.interfaceName}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{dep.purpose}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs text-slate-500 font-mono">
                Componente autónomo de base (no consume interfaces de otros módulos de negocio).
              </div>
            )}
          </div>

          {/* Domain Events */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-amber-400" />
              <span>Eventos de Dominio Asíncronos (In-Process Bus)</span>
            </h4>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                <span className="text-[11px] font-mono text-amber-400 block mb-1">Eventos Publicados:</span>
                {selectedModule.domainEventsPublished.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedModule.domainEventsPublished.map((ev) => (
                      <span key={ev} className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[11px]">
                        {ev}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500 text-[11px] font-mono">Ninguno</span>
                )}
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                <span className="text-[11px] font-mono text-sky-400 block mb-1">Eventos Suscritos:</span>
                {selectedModule.domainEventsSubscribed.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedModule.domainEventsSubscribed.map((ev) => (
                      <span key={ev} className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-300 font-mono text-[11px]">
                        {ev}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500 text-[11px] font-mono">Ninguno</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Architectural Tactics Applied */}
        <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20 space-y-2">
          <span className="text-xs font-mono text-sky-400 uppercase tracking-wider block font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            Tácticas de Arquitectura Implementadas para Cumplir los RNFs (300 concurrentes, &lt;3s, 99.5% SLA)
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
            {selectedModule.tactics.map((tac, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 font-mono leading-relaxed">
                • {tac}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
