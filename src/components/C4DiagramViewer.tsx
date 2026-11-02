import React, { useState } from 'react';
import { C4_COMPONENTS } from '../data/architectureData';
import { Cpu, Layers, Server, Database, Globe, Users, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

export const C4DiagramViewer: React.FC = () => {
  const [c4Level, setC4Level] = useState<'c1' | 'c2' | 'c3'>('c3');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('mod-matricula');

  const selectedModule = C4_COMPONENTS.find((m) => m.id === selectedModuleId) || C4_COMPONENTS[0];

  return (
    <div className="space-y-6">
      {/* Top Bar with C4 Level Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-400" />
            <span>Modelo Arquitectónico C4 & Bounded Contexts DDD</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visualización formal de la estructura del Sistema de Gestión Académica (SGA).
          </p>
        </div>

        {/* Level Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
          <button
            onClick={() => setC4Level('c1')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              c4Level === 'c1'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            C1: Contexto
          </button>
          <button
            onClick={() => setC4Level('c2')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              c4Level === 'c2'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            C2: Contenedores
          </button>
          <button
            onClick={() => setC4Level('c3')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              c4Level === 'c3'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            C3: Componentes Monolito
          </button>
        </div>
      </div>

      {/* C1: System Context View */}
      {c4Level === 'c1' && (
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-mono text-sky-400 uppercase tracking-wider">Nivel C1 · Diagrama de Contexto</span>
            <h3 className="text-base font-bold text-white mt-0.5">El SGA y su Entorno Universitario</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Actores */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-slate-400 block uppercase">1. Actores Humanos</span>
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-sky-400 font-semibold">
                  <Users className="w-4 h-4" />
                  <span>Estudiantes (300 concurrentes)</span>
                </div>
                <p className="text-slate-400">Consultas de pensum, inscripción de materias y visualización de notas.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <Users className="w-4 h-4" />
                  <span>Docentes y Profesores</span>
                </div>
                <p className="text-slate-400">Ingreso de cortes evaluativos, control de asistencia y cierre de actas.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-purple-400 font-semibold">
                  <Users className="w-4 h-4" />
                  <span>Coordinadores & Administradores</span>
                </div>
                <p className="text-slate-400">Programación de secciones, topes de cupo y auditoría institucional.</p>
              </div>
            </div>

            {/* Core System */}
            <div className="p-6 rounded-xl bg-gradient-to-b from-sky-500/10 to-slate-950 border-2 border-sky-500/50 text-center space-y-3 shadow-lg shadow-sky-500/5">
              <span className="text-xs font-mono text-sky-400 font-bold bg-sky-500/20 px-2 py-0.5 rounded">
                SISTEMA CENTRAL SGA
              </span>
              <h4 className="text-lg font-bold text-white">Sistema de Gestión Académica</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Centraliza estudiantes, docentes, matrículas y calificaciones. Diseñado bajo el patrón de Monolito Modular con SLA del 99.5% y respuesta &lt;3s.
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-400 border-t border-slate-800">
                Límite de Contexto Concurrente: 300 usuarios
              </div>
            </div>

            {/* Sistemas Externos */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-slate-400 block uppercase">2. Sistemas Externos Integrados</span>
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs">
                <div className="font-semibold text-white">LMS Institucional (Moodle / Canvas)</div>
                <p className="text-slate-400">Sincronización de matrículas y listas de estudiantes por sección.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs">
                <div className="font-semibold text-white">Pasarela de Pagos / Financiero</div>
                <p className="text-slate-400">Validación de paz y salvo financiero previo al proceso de matrícula.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs">
                <div className="font-semibold text-white">Servidor SMTP / Mensajería</div>
                <p className="text-slate-400">Despacho de comprobantes de matrícula y alertas de calificaciones.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* C2: Container Diagram */}
      {c4Level === 'c2' && (
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-mono text-sky-400 uppercase tracking-wider">Nivel C2 · Diagrama de Contenedores</span>
            <h3 className="text-base font-bold text-white mt-0.5">Topología de Despliegue Físico & Alta Disponibilidad (SLA 99.5%)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            {/* SPA Client */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-semibold">
                <Globe className="w-4 h-4" />
                <span>Single Page Application (SPA)</span>
              </div>
              <p className="text-slate-400">React + Tailwind CSS servido desde CDN / Edge Storage. UI responsive y optimista.</p>
              <div className="font-mono text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                Protocolo: HTTPS / TLS 1.3
              </div>
            </div>

            {/* Load Balancer */}
            <div className="p-4 rounded-xl bg-slate-950 border border-sky-500/40 space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Server className="w-4 h-4 text-sky-400" />
                <span>ALB / Reverse Proxy</span>
              </div>
              <p className="text-slate-400">Terminación TLS, balanceo Round-Robin hacia las 2 réplicas del monolito, /healthz checks cada 10s.</p>
              <div className="font-mono text-[10px] text-emerald-400 pt-1 border-t border-slate-800">
                Garantía: SLA 99.5% Uptime
              </div>
            </div>

            {/* Modular Monolith Backend */}
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Cpu className="w-4 h-4" />
                <span>API SGA (Monolito Modular)</span>
              </div>
              <p className="text-slate-400">2 Réplicas de contenedor OCI. Ejecución in-process de los 4 módulos con comunicación a velocidad de CPU (&lt;1ms).</p>
              <div className="font-mono text-[10px] text-emerald-300 pt-1 border-t border-slate-800">
                Capacidad: 1,200 req/s por réplica
              </div>
            </div>

            {/* Persistencia & Cache */}
            <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/40 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-semibold">
                <Database className="w-4 h-4" />
                <span>PostgreSQL + Redis + Storage</span>
              </div>
              <p className="text-slate-400">PgBouncer (pooling), PostgreSQL Multi-AZ (ACID, FOR UPDATE), Redis (L2 Cache + BullMQ worker queue).</p>
              <div className="font-mono text-[10px] text-purple-300 pt-1 border-t border-slate-800">
                Integridad: 100% ACID Nativo
              </div>
            </div>
          </div>
        </div>
      )}

      {/* C3: Component Diagram (Modular Monolith Internals) */}
      {c4Level === 'c3' && (
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-mono text-sky-400 uppercase tracking-wider">Nivel C3 · Diagrama de Componentes</span>
            <h3 className="text-base font-bold text-white mt-0.5">Arquitectura Interna del Monolito Modular (Bounded Contexts)</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Módulos desacoplados en el mismo proceso ejecutable con interfaces públicas explícitas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Module Selector List */}
            <div className="lg:col-span-5 space-y-2">
              {C4_COMPONENTS.map((comp) => {
                const isSelected = comp.id === selectedModuleId;
                const isHotspot = comp.type.includes('Hotspot');

                return (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedModuleId(comp.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-sky-500 ring-1 ring-sky-500/30'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-white">{comp.name}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isHotspot
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {comp.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{comp.responsibilities}</p>
                  </button>
                );
              })}
            </div>

            {/* Selected Module Detail */}
            <div className="lg:col-span-7 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[11px] font-mono text-sky-400 block mb-1">Bounded Context / Componente</span>
                <h4 className="text-base font-bold text-white">{selectedModule.name}</h4>
                <div className="text-xs text-slate-400 mt-1">{selectedModule.responsibilities}</div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Interfaz Pública Tipada (Facade Contract):
                  </span>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-sky-300 text-[11px] overflow-x-auto">
                    {selectedModule.interfaces}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Dependencias de Almacenamiento & Eventos:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedModule.dependencies.map((dep, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]"
                      >
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Stack Tecnológico & Táctica de Dominio:
                  </span>
                  <div className="text-slate-300 font-mono text-[11px] bg-slate-900/60 p-2 rounded border border-slate-800">
                    {selectedModule.tech}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
