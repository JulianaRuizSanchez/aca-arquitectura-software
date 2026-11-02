import React, { useState } from 'react';
import {
  DEPLOYMENT_NODES,
  ENROLLMENT_SEQUENCE_STEPS,
  ENROLLMENT_EXCEPTION_STEPS,
  DeploymentNode,
  SequenceStep,
} from '../data/architectureData';
import { Server, ShieldCheck, Lock, Globe, Database, Cpu, ArrowRight, Play, RefreshCw, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export const DeploymentAndSequence: React.FC = () => {
  const [subTab, setSubTab] = useState<'deployment' | 'sequence'>('deployment');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-alb');
  const [sequenceMode, setSequenceMode] = useState<'success' | 'exception'>('success');

  const selectedNode = DEPLOYMENT_NODES.find((n) => n.id === selectedNodeId) || DEPLOYMENT_NODES[0];

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'client':
        return Globe;
      case 'network':
        return Lock;
      case 'compute':
        return Cpu;
      case 'cache':
        return Server;
      case 'database':
        return Database;
      default:
        return Server;
    }
  };

  const currentSteps = sequenceMode === 'success' ? ENROLLMENT_SEQUENCE_STEPS : ENROLLMENT_EXCEPTION_STEPS;
  const totalLatency = currentSteps.reduce((acc, step) => acc + step.latencyMs, 0);

  return (
    <div className="space-y-8">
      {/* Top Banner and Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-sky-400 mb-1">
            <span>ARQUITECTURA DE SOFTWARE · INFRAESTRUCTURA & DINÁMICA</span>
            <span className="text-slate-600">·</span>
            <span>SGA MONOLITO MODULAR</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Server className="w-5 h-5 text-sky-400" />
            <span>Modelo de Despliegue Seguro & Diagrama de Secuencia de Matrícula</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Topología física con canales HTTPS/TLS 1.3 y vista cronológica de mensajes para el proceso crítico de inscripción.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 shrink-0">
          <button
            onClick={() => setSubTab('deployment')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              subTab === 'deployment'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Modelo de Despliegue (HTTPS)
          </button>
          <button
            onClick={() => setSubTab('sequence')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              subTab === 'sequence'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Secuencia: Matrícula Crítica
          </button>
        </div>
      </div>

      {/* VIEW 1: DEPLOYMENT MODEL */}
      {subTab === 'deployment' && (
        <div className="space-y-6">
          {/* Visual Deployment Architecture Map */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-6">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
              <span className="font-mono text-slate-400 uppercase tracking-wider">
                Topología Física de Nodos & Canales Seguros (HTTPS / TLS 1.3)
              </span>
              <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                SLA Objetivo: 99.5% Uptime Mensual
              </span>
            </div>

            {/* Visual Pipeline Flow */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* Step 1: Clients */}
              <div
                onClick={() => setSelectedNodeId('node-client')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedNodeId === 'node-client'
                    ? 'bg-slate-900 border-sky-500 ring-1 ring-sky-500/40'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Globe className="w-5 h-5 text-sky-400" />
                  <span className="text-[10px] font-mono text-slate-400">Público</span>
                </div>
                <div className="font-bold text-sm text-white">300 Clientes Web</div>
                <div className="text-xs text-slate-400 mt-1">Navegadores Desktop / Móviles</div>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-emerald-400">
                  Canal: HTTPS / TLS 1.3
                </div>
              </div>

              {/* Step 2: ALB / WAF */}
              <div
                onClick={() => setSelectedNodeId('node-alb')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedNodeId === 'node-alb'
                    ? 'bg-slate-900 border-sky-500 ring-1 ring-sky-500/40'
                    : 'bg-slate-950 border-sky-500/30 hover:border-sky-500/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Lock className="w-5 h-5 text-emerald-400" />
                  <span className="text-[10px] font-mono text-emerald-400">DMZ / WAF</span>
                </div>
                <div className="font-bold text-sm text-white">Load Balancer (ALB)</div>
                <div className="text-xs text-slate-400 mt-1">Terminación TLS & Health Checks</div>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-sky-400">
                  VPC Privada / HTTP/2 TLS
                </div>
              </div>

              {/* Step 3: Dual Backend Containers */}
              <div
                onClick={() => setSelectedNodeId('node-backend-1')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedNodeId.startsWith('node-backend')
                    ? 'bg-slate-900 border-sky-500 ring-1 ring-sky-500/40'
                    : 'bg-slate-950 border-emerald-500/30 hover:border-emerald-500/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Cpu className="w-5 h-5 text-purple-400" />
                  <span className="text-[10px] font-mono text-purple-300">2x Réplicas</span>
                </div>
                <div className="font-bold text-sm text-white">Backend Monolito</div>
                <div className="text-xs text-slate-400 mt-1">Módulos en Memoria (In-Process)</div>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-purple-300">
                  In-Process &lt; 0.5ms
                </div>
              </div>

              {/* Step 4: Managed PostgreSQL Multi-AZ */}
              <div
                onClick={() => setSelectedNodeId('node-db-primary')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedNodeId.startsWith('node-db')
                    ? 'bg-slate-900 border-sky-500 ring-1 ring-sky-500/40'
                    : 'bg-slate-950 border-purple-500/30 hover:border-purple-500/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Database className="w-5 h-5 text-sky-400" />
                  <span className="text-[10px] font-mono text-sky-400">Multi-AZ</span>
                </div>
                <div className="font-bold text-sm text-white">PostgreSQL Multi-AZ</div>
                <div className="text-xs text-slate-400 mt-1">PgBouncer Pool (ACID Locking)</div>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-sky-300">
                  Wire Protocol SSL / AES-256
                </div>
              </div>
            </div>

            {/* Network Security Legend Strip */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-[11px]">
              <div className="flex items-center gap-2 text-emerald-400">
                <Lock className="w-4 h-4 shrink-0" />
                <span>Canal Externo: HTTPS / TLS 1.3 con certificados HSTS</span>
              </div>
              <div className="flex items-center gap-2 text-sky-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Canal Interno: Subnet Privada aislada sin IP pública</span>
              </div>
              <div className="flex items-center gap-2 text-purple-400">
                <Database className="w-4 h-4 shrink-0" />
                <span>Cifrado en Reposo: AES-256 en PostgreSQL y Redis</span>
              </div>
            </div>
          </div>

          {/* Node Inspector Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Selector List */}
            <div className="lg:col-span-5 space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Componentes de la Topología de Despliegue:
              </span>
              {DEPLOYMENT_NODES.map((node) => {
                const isSelected = node.id === selectedNode.id;
                const Icon = getNodeIcon(node.iconType);
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-sky-500 ring-1 ring-sky-500/30'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-sky-400" />
                        <span className="font-semibold text-white">{node.name}</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{node.role}</div>
                    <div className="mt-1 text-[10px] font-mono text-emerald-400">{node.channel}</div>
                  </button>
                );
              })}
            </div>

            {/* Right Node Detail Card */}
            <div className="lg:col-span-7 rounded-xl bg-slate-900/80 border border-slate-800 p-6 space-y-5">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-1">
                  <span>NODO SELECCIONADO</span>
                  <span className="text-slate-600">·</span>
                  <span>{selectedNode.channel}</span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">{selectedNode.name}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedNode.role}</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-mono text-slate-400 text-[11px] block mb-0.5">Tecnología de Ejecución:</span>
                  <span className="text-white font-mono text-[11px]">{selectedNode.technology}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-mono text-slate-400 text-[11px] block mb-0.5">Canal y Protocolo de Red:</span>
                  <span className="text-emerald-400 font-mono text-[11px] font-semibold">{selectedNode.channel}</span>
                </div>

                <div>
                  <span className="font-mono text-slate-400 text-[11px] block mb-1 uppercase tracking-wider">
                    Mecanismos de Seguridad Aplicados:
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    {selectedNode.securityFeatures.map((sec, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-950/50 p-2 rounded border border-slate-800/80 text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{sec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-sky-500/5 border border-sky-500/20 text-[11px] font-mono">
                  <span className="text-sky-400 block font-semibold mb-0.5">Contribución a la Alta Disponibilidad (99.5% SLA):</span>
                  <span className="text-slate-200">{selectedNode.redundancySLA}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SEQUENCE DIAGRAM */}
      {subTab === 'sequence' && (
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>Vista de Secuencia Cronológica: Matrícula de un Estudiante en Asignatura</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Proceso transaccional crítico que valida reglas de negocio, cupos concurrentes y garantiza 0 sobrecupos.
              </p>
            </div>

            {/* Toggle Scenario */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 shrink-0">
              <button
                onClick={() => setSequenceMode('success')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  sequenceMode === 'success'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Flujo Exitoso (Happy Path)
              </button>
              <button
                onClick={() => setSequenceMode('exception')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  sequenceMode === 'exception'
                    ? 'bg-rose-500 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Excepción (Cupo Agotado)
              </button>
            </div>
          </div>

          {/* Sequence Participants Diagram Header */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
            <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-300 font-bold">
              👤 Estudiante (Actor)
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-bold">
              🖥️ Interfaz Web (SPA)
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold">
              ⚙️ Backend API (Matrículas)
            </div>
            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold">
              🗄️ PostgreSQL (ACID)
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold col-span-2 sm:col-span-1">
              📝 Módulo Auditoría
            </div>
          </div>

          {/* Sequence Timeline Steps */}
          <div className="space-y-3">
            {currentSteps.map((step, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all text-xs ${
                  step.isAlternative
                    ? 'bg-rose-500/5 border-rose-500/30 text-slate-200'
                    : step.isCritical
                    ? 'bg-slate-900/90 border-slate-800 text-slate-200'
                    : 'bg-slate-950/60 border-slate-850 text-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                      Paso {step.stepNumber}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      {step.from} → {step.to} · <span className="text-sky-300 font-semibold">{step.protocol}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto font-mono text-[11px]">
                    <span className="text-slate-500">Latencia estimada:</span>
                    <span className="text-emerald-400 font-bold tabular-nums">+{step.latencyMs} ms</span>
                  </div>
                </div>

                <div className="font-bold text-sm text-white mb-1 font-mono">{step.label}</div>
                <p className="text-slate-300 leading-relaxed font-sans text-xs">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Total Latency Benchmark Banner */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="font-bold text-white block">Evaluación de Rendimiento del Proceso de Matrícula:</span>
                <span className="text-slate-400">
                  Tiempo de ejecución total medido: <strong className="text-emerald-400 font-mono">~{totalLatency} ms</strong> frente al límite exigido de <strong className="text-white font-mono">&lt; 3,000 ms (RNF-02)</strong>.
                </span>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono font-bold text-xs shrink-0 text-center">
              Cumple RNF-02 con 96% de Margen
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
