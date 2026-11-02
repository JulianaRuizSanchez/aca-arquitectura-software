import React, { useState } from 'react';
import { ARCHITECTURE_STYLES, ArchitectureStyle } from '../data/architectureData';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, Zap, Database, Server, Shield, Clock } from 'lucide-react';

export const VerdictAndComparison: React.FC = () => {
  const [selectedStyleId, setSelectedStyleId] = useState<string>('modular_monolith');

  const selectedStyle = ARCHITECTURE_STYLES.find((s) => s.id === selectedStyleId) || ARCHITECTURE_STYLES[0];

  const attributeLabels: Record<keyof ArchitectureStyle['scores'], string> = {
    latency: 'Latencia (< 3.0s)',
    concurrencyHandling: 'Manejo de 300 Concurrencias',
    availability: 'Disponibilidad (99.5% SLA)',
    scalability: 'Escalabilidad Elástica',
    transactionIntegrity: 'Integridad Transaccional (ACID)',
    devopsSimplicity: 'Simplicidad Operativa / DevOps',
    costEfficiency: 'Eficiencia de Costos (TCO)',
    maintainability: 'Mantenibilidad & Evolución',
  };

  return (
    <div className="space-y-8">
      {/* Executive Verdict Hero Card */}
      <div className="rounded-xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-sky-400 mb-3">
            <span className="uppercase tracking-wider font-semibold">Dictamen Oficial del Arquitecto de Software Senior</span>
            <span aria-hidden="true">·</span>
            <span>Estándar SEI / ISO 25010</span>
            <span aria-hidden="true">·</span>
            <span>Entorno: Sistema de Gestión Académica (SGA)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4">
            Veredicto: El <span className="text-sky-400">Monolito Modular con Bounded Contexts</span> es la Arquitectura Óptima
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-4xl mb-6">
            Para un sistema con <strong className="text-white">300 usuarios concurrentes</strong>, tiempo de respuesta <strong className="text-white">&lt; 3 segundos</strong> y disponibilidad del <strong className="text-white">99.5%</strong>, la adopción de microservicios representa un <strong className="text-amber-400">antipatrón de sobreingeniería y sobrecosto</strong>. Por otro lado, la arquitectura tradicional en capas resulta frágil a mediano plazo debido al acoplamiento espagueti entre matrículas y notas.
          </p>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
            <div>
              <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                <UsersIcon className="w-3.5 h-3.5 text-sky-400" />
                <span>Carga Concurrente</span>
              </div>
              <div className="text-xl font-bold font-mono tabular-nums text-white">300 req-sim</div>
              <div className="text-xs text-slate-400">~45–90 transacciones/s</div>
            </div>

            <div>
              <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tiempo de Respuesta</span>
              </div>
              <div className="text-xl font-bold font-mono tabular-nums text-emerald-400">&lt; 280ms (p95)</div>
              <div className="text-xs text-slate-400">Objetivo &lt; 3.0s cumplido</div>
            </div>

            <div>
              <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                <span>Disponibilidad SLA</span>
              </div>
              <div className="text-xl font-bold font-mono tabular-nums text-sky-400">99.5% (43.8h/año)</div>
              <div className="text-xs text-slate-400">2 réplicas + rolling deploy</div>
            </div>

            <div>
              <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-purple-400" />
                <span>Atomicidad Cupos</span>
              </div>
              <div className="text-xl font-bold font-mono tabular-nums text-purple-300">100% ACID</div>
              <div className="text-xs text-slate-400">Cero sobrecupos en matrícula</div>
            </div>
          </div>
        </div>
      </div>

      {/* Selector Tabs for 3 Architectural Styles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Evaluación Comparativa de Estilos Arquitectónicos</h2>
            <p className="text-xs text-slate-400">Contraste riguroso basado en atributos de calidad, complejidad y tamaño de carga.</p>
          </div>
          <div className="text-xs text-slate-400 font-mono hidden sm:block">
            Haga clic en un estilo para auditar su justificación técnica
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {ARCHITECTURE_STYLES.map((style) => {
            const isSelected = style.id === selectedStyleId;
            const isRecommended = style.verdict === 'RECOMENDADO';
            const isDiscouraged = style.verdict === 'DESACONSEJADO';

            return (
              <button
                key={style.id}
                onClick={() => setSelectedStyleId(style.id)}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-slate-900 border-sky-500 shadow-md shadow-sky-500/10 ring-1 ring-sky-500/30'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-400">
                    {style.id === 'modular_monolith' ? 'Opción A (Recomendada)' : style.id === 'layered' ? 'Opción B' : 'Opción C'}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      isRecommended
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : isDiscouraged
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {style.verdict}
                  </span>
                </div>

                <div className="font-semibold text-sm text-white mb-1">{style.name}</div>
                <div className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{style.tagline}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Architecture Detail Card */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-sky-400 uppercase tracking-wider">Análisis en Detalle</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-semibold text-white">{selectedStyle.name}</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
              {selectedStyle.verdictSummary}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs">
              <div className="text-slate-400 font-mono">Latencia Esperada</div>
              <div className="font-semibold text-white tabular-nums">{selectedStyle.latencyExpectation.split(' ')[1]}</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs">
              <div className="text-slate-400 font-mono">Sobrecosto DevOps</div>
              <div className="font-semibold text-white">{selectedStyle.devopsOverhead.split('.')[0]}</div>
            </div>
          </div>
        </div>

        {/* Quality Attributes Score Bars */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4">
            Evaluación Cuantitativa por Atributos de Calidad (Escala 1 - 10)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {(Object.keys(selectedStyle.scores) as (keyof ArchitectureStyle['scores'])[]).map((key) => {
              const score = selectedStyle.scores[key];
              const scoreColor =
                score >= 8.5 ? 'bg-emerald-500' : score >= 6.5 ? 'bg-amber-500' : 'bg-rose-500';
              const textColor =
                score >= 8.5 ? 'text-emerald-400' : score >= 6.5 ? 'text-amber-400' : 'text-rose-400';

              return (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{attributeLabels[key]}</span>
                    <span className={`font-mono font-bold tabular-nums ${textColor}`}>{score.toFixed(1)} / 10</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${scoreColor} transition-all duration-500 rounded-full`}
                      style={{ width: `${score * 10}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pros & Cons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Ventajas Técnicas para el SGA</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {selectedStyle.pros.map((pro, index) => (
                <li key={index} className="flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Riesgos, Sobrecostos y Desventajas</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {selectedStyle.cons.map((con, index) => (
                <li key={index} className="flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Behavior under 300 concurrent users constraint */}
        <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-2 text-sky-400 font-semibold">
            <Zap className="w-4 h-4" />
            <span>Comportamiento con 300 Usuarios Concurrentes & Transacciones de Matrícula</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {selectedStyle.whyFitsOrFailsFor300Users}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-slate-400 font-mono text-[11px]">
            <div>
              <span className="text-slate-500 block">Garantía Transaccional:</span>
              <span className="text-slate-200">{selectedStyle.transactionalGuarantee}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Cumplimiento SLA 99.5%:</span>
              <span className="text-slate-200">{selectedStyle.slaAvailabilityFit}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Presupuesto Infraestructura:</span>
              <span className="text-slate-200">{selectedStyle.costProfile}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Synthesis Table for Senior Architects */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white tracking-tight">Matriz Técnica de Decisión Arquitectónica (Trade-off Analysis)</h3>
          <p className="text-xs text-slate-400">Resumen ejecutivo frente a los 3 factores condicionantes de la solicitud del usuario.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Criterio Arquitectónico</th>
                <th className="py-3 px-4 text-emerald-400">Monolito Modular (Recomendado)</th>
                <th className="py-3 px-4 text-amber-400">Arquitectura en Capas</th>
                <th className="py-3 px-4 text-rose-400">Microservicios</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-normal">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Tamaño del Sistema (300 concurrentes)</td>
                <td className="py-3.5 px-4 text-emerald-300">Ajuste perfecto (2 instancias absorben el pico a 5% de CPU).</td>
                <td className="py-3.5 px-4">Ajuste adecuado en cómputo, pero débil en diseño.</td>
                <td className="py-3.5 px-4 text-rose-300">Sobredimensionamiento masivo (antipatrón).</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Latencia (&lt; 3.0s exigido)</td>
                <td className="py-3.5 px-4 text-emerald-300">In-Process (&lt; 1ms entre módulos). p95 total: ~180ms.</td>
                <td className="py-3.5 px-4">In-Process, pero con riesgo de N+1 queries descontroladas.</td>
                <td className="py-3.5 px-4 text-rose-300">Múltiples saltos HTTP (30–80ms c/u). Amenaza el SLA.</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Disponibilidad (99.5% = 43.8h/año)</td>
                <td className="py-3.5 px-4 text-emerald-300">Fácilmente alcanzado (&gt;99.8%) con 2 pods y ALB.</td>
                <td className="py-3.5 px-4">Alcanzable, pero con riesgo por despliegues acoplados.</td>
                <td className="py-3.5 px-4 text-rose-300">Disponibilidad compuesta decreciente ($0.999^N$).</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Integridad en Matrícula (Cero sobrecupos)</td>
                <td className="py-3.5 px-4 text-emerald-300">Transacciones ACID locales simples y deterministas.</td>
                <td className="py-3.5 px-4">ACID local disponible, pero lógica dispersa.</td>
                <td className="py-3.5 px-4 text-rose-300">Consistencia eventual frágil; requiere Sagas complejas.</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Complejidad y Costo Operativo (TCO)</td>
                <td className="py-3.5 px-4 text-emerald-300">Mínimo ($80–$180/mes, CI/CD de un solo pipeline).</td>
                <td className="py-3.5 px-4">Bajo en hosting, alto en deuda técnica posterior.</td>
                <td className="py-3.5 px-4 text-rose-300">Muy alto ($600–$1,500/mes en K8s, Jaeger, Gateways).</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Evolución y Escalabilidad Futura</td>
                <td className="py-3.5 px-4 text-emerald-300">Permite extraer Matrículas a microservicio si crece a 50k.</td>
                <td className="py-3.5 px-4">Extracción traumática por dependencias entrelazadas.</td>
                <td className="py-3.5 px-4">Aislado desde el inicio, pero a un costo desmedido.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}
