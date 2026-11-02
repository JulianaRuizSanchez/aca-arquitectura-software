import React, { useState } from 'react';
import {
  CLOUD_INFRASTRUCTURE_DECISIONS,
  CloudDecision,
} from '../data/architectureData';
import {
  Cloud,
  Server,
  Database,
  Lock,
  HardDrive,
  FileCode,
  AlertTriangle,
  Shield,
  Activity,
  Layers,
  ArrowRight,
  ExternalLink,
  Zap,
  CheckCircle2,
  Sliders,
  DollarSign,
  Cpu,
} from 'lucide-react';

export const CloudInfraAndMitigation: React.FC = () => {
  const [selectedDecisionId, setSelectedDecisionId] = useState<string>(
    CLOUD_INFRASTRUCTURE_DECISIONS[0].id
  );

  const selectedDecision =
    CLOUD_INFRASTRUCTURE_DECISIONS.find((d) => d.id === selectedDecisionId) ||
    CLOUD_INFRASTRUCTURE_DECISIONS[0];

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-sky-400 mb-1">
          <span>ARQUITECTURA CLOUD · MONOLITO MODULAR DDD</span>
          <span className="text-slate-600">·</span>
          <span>ANÁLISIS DE RIESGOS & PLAN DE MITIGACIÓN OPERATIVO</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Cloud className="w-5 h-5 text-sky-400" />
          <span>Infraestructura Cloud, Evaluación de Riesgos y Mitigación Operativa</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-4xl">
          Análisis arquitectónico y operacional de las 5 decisiones tecnológicas clave: Next.js + TypeScript Fullstack, Contenedores Administrados (Railway/Render), PostgreSQL con Drizzle ORM, Delegación de Identidad en Auth0 y Almacenamiento en Cloudflare R2 sin costos de transferencia de salida (Egress).
        </p>
      </div>

      {/* Visual Cloud Topology Card */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 text-xs">
          <span className="font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            Topología Cloud Integrada del Sistema de Gestión Académica (SGA)
          </span>
          <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
            Concurrencia: 300 Usuarios · SLA: 99.5%
          </span>
        </div>

        {/* Cloud Architecture Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          {/* Node 1: Auth0 */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px] font-bold">
              <Lock className="w-4 h-4" />
              <span>Auth0 IdP</span>
            </div>
            <div className="font-bold text-white text-xs">Autenticación & RBAC</div>
            <p className="text-[11px] text-slate-400">
              OIDC, MFA, RS256 JWT, claims inyectados y verificación local stateless sin latencia.
            </p>
            <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-amber-300">
              Cumplimiento SOC 2 / GDPR
            </div>
          </div>

          {/* Node 2: Next.js Web App */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-sky-500/40 space-y-2 md:col-span-2">
            <div className="flex items-center gap-2 text-sky-400 font-mono text-[11px] font-bold">
              <Server className="w-4 h-4" />
              <span>Railway / Render (2 Réplicas)</span>
            </div>
            <div className="font-bold text-white text-xs">Next.js + TypeScript Fullstack</div>
            <p className="text-[11px] text-slate-400">
              Monolito Modular DDD. Contenedores persistentes sin timeouts Serverless. Worker desacoplado para reportes pesados en PDF vía BullMQ/Redis.
            </p>
            <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-sky-300 flex items-center justify-between">
              <span>Docker OCI · Node 22</span>
              <span>Health checks /api/healthz</span>
            </div>
          </div>

          {/* Node 3: PostgreSQL + Drizzle */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px] font-bold">
              <Database className="w-4 h-4" />
              <span>PostgreSQL + Drizzle</span>
            </div>
            <div className="font-bold text-white text-xs">Persistencia Transaccional</div>
            <p className="text-[11px] text-slate-400">
              Drizzle ORM con SQL nativo compilado. Pool PgBouncer para 300 concurrentes y transacciones ACID con FOR UPDATE.
            </p>
            <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-emerald-300">
              Zero-Overhead · Latencia &lt; 10ms
            </div>
          </div>

          {/* Node 4: Cloudflare R2 */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-[11px] font-bold">
              <HardDrive className="w-4 h-4" />
              <span>Cloudflare R2</span>
            </div>
            <div className="font-bold text-white text-xs">Storage Masivo ($0 Egress)</div>
            <p className="text-[11px] text-slate-400">
              PDFs de actas y fotos subidas directamente vía URLs Prefirmadas (Presigned URLs) sin sobrecargar el backend.
            </p>
            <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-indigo-300">
              0.00 USD Egress Fee
            </div>
          </div>
        </div>
      </div>

      {/* 5 Cloud Decisions Selector Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-400" />
            <span>Las 5 Decisiones de Infraestructura Cloud Seleccionadas:</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Haga clic en una decisión para auditar sus riesgos y plan operativo
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {CLOUD_INFRASTRUCTURE_DECISIONS.map((dec) => {
            const isSelected = dec.id === selectedDecision.id;
            return (
              <button
                key={dec.id}
                onClick={() => setSelectedDecisionId(dec.id)}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-slate-900 border-sky-400 ring-1 ring-sky-400/40 shadow-lg shadow-sky-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                    Decisión #{dec.number}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {dec.technicalRisks.length} Riesgos
                  </span>
                </div>
                <div className="font-bold text-xs text-white line-clamp-2 leading-snug">
                  {dec.shortTitle}
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-2 truncate">
                  {dec.techStack.split('+')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Decision Deep-Dive Dossier */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 space-y-6 shadow-xl">
        {/* Header of Active Decision */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                Decisión #{selectedDecision.number}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300 font-semibold">{selectedDecision.architecturalRole}</span>
            </div>
            <h4 className="text-lg font-bold text-white tracking-tight">{selectedDecision.title}</h4>
            <div className="text-xs font-mono text-slate-400">
              Stack Tecnológico: <span className="text-sky-300">{selectedDecision.techStack}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 lg:max-w-xs shrink-0">
            <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Beneficio en Costos & SLA:</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {selectedDecision.costAndSlaBenefits}
            </p>
          </div>
        </div>

        {/* Justification */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-1.5">
          <div className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Justificación Arquitectónica Cloud:</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{selectedDecision.justification}</p>
        </div>

        {/* Technical Risk Matrix */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Matriz de Riesgos Técnicos Específicos ({selectedDecision.technicalRisks.length}):</span>
            </h5>
            <span className="text-[11px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              Evaluación Preventiva
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {selectedDecision.technicalRisks.map((riskItem, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white leading-snug">
                      {riskItem.risk}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="text-slate-400">Probabilidad:</span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-semibold ${
                        riskItem.probability === 'Alta'
                          ? 'text-rose-400 bg-rose-500/10'
                          : riskItem.probability === 'Media'
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-slate-300 bg-slate-800'
                      }`}
                    >
                      {riskItem.probability}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">Impacto:</span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-semibold ${
                        riskItem.impact === 'Crítico'
                          ? 'text-rose-400 bg-rose-500/10'
                          : riskItem.impact === 'Alto'
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-sky-300 bg-sky-500/10'
                      }`}
                    >
                      {riskItem.impact}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-800/80">
                    <span className="font-semibold text-rose-300 text-[11px]">Escenario: </span>
                    {riskItem.failureScenario}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Mitigation Plan */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Plan de Mitigación Operativo (Pilares de Resiliencia):</span>
            </h5>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Runbooks & Tácticas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedDecision.operationalMitigationPlan.map((plan, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                      Pilar: {plan.pillar}
                    </span>
                  </div>

                  <div className="font-bold text-white text-xs leading-snug">{plan.tactic}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{plan.implementationDetails}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Métrica Objetivo (SLO):</span>
                  <span className="text-emerald-400 font-semibold">{plan.targetMetric}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparative Matrix: Standard Cloud vs Selected Optimized Stack */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <span>Comparativa de Eficiencia Operativa: Stack Clásico vs Stack Optimizado Seleccionado</span>
          </h3>
          <span className="font-mono text-xs text-slate-400">300 Concurrentes · SGA</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 font-mono text-[11px] text-slate-400 uppercase">
              <tr>
                <th className="px-4 py-2.5">Dimensión Operativa</th>
                <th className="px-4 py-2.5">Enfoque Tradicional / Serverless Frágil</th>
                <th className="px-4 py-2.5 text-sky-400 font-bold">Stack Optimizado Propuesto</th>
                <th className="px-4 py-2.5 text-emerald-400">Impacto en SLA & Costo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              <tr>
                <td className="px-4 py-3 font-semibold text-white">Generación de Reportes en PDF</td>
                <td className="px-4 py-3 text-slate-400">AWS Lambda / Vercel Serverless (Timeout a 10s-60s)</td>
                <td className="px-4 py-3 text-sky-300 font-mono">Worker Contenedor en Railway/Render (Tiempo Ilimitado)</td>
                <td className="px-4 py-3 text-emerald-400 font-mono">Cero timeouts en actas de 500 alumnos</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-white">Costo de Transferencia de Archivos</td>
                <td className="px-4 py-3 text-slate-400">AWS S3 ($0.09 USD / GB descargado)</td>
                <td className="px-4 py-3 text-sky-300 font-mono">Cloudflare R2 ($0.00 Egress Fees)</td>
                <td className="px-4 py-3 text-emerald-400 font-mono">Ahorro del 100% en ancho de banda</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-white">Velocidad y Memoria del ORM</td>
                <td className="px-4 py-3 text-slate-400">Prisma ORM (Binario Rust, +50MB RAM, overhead query)</td>
                <td className="px-4 py-3 text-sky-300 font-mono">Drizzle ORM (Zero-Overhead, SQL nativo directo)</td>
                <td className="px-4 py-3 text-emerald-400 font-mono">Latencia 3x menor; SELECT FOR UPDATE nativo</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-white">Autenticación y Custodia Legal</td>
                <td className="px-4 py-3 text-slate-400">Base de datos local con bcrypt casero (Riesgo fuga de hash)</td>
                <td className="px-4 py-3 text-sky-300 font-mono">Auth0 Empresarial (SOC 2, MFA, RS256 Stateless)</td>
                <td className="px-4 py-3 text-emerald-400 font-mono">Cumplimiento normativo estricto; SLA 99.9%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-white">Tipado entre Cliente y Servidor</td>
                <td className="px-4 py-3 text-slate-400">Repositorios separados Frontend / Backend con DTOs duplicados</td>
                <td className="px-4 py-3 text-sky-300 font-mono">Next.js + TypeScript Fullstack con Zod compartido</td>
                <td className="px-4 py-3 text-emerald-400 font-mono">Cero errores de serialización; -40% tiempo dev</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
