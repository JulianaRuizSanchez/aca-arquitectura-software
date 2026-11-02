import React, { useState } from 'react';
import { USE_CASES, UseCase } from '../data/architectureData';
import { Users, Shield, BookOpen, GraduationCap, ArrowRight, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export const UseCasesExplorer: React.FC = () => {
  const [selectedActor, setSelectedActor] = useState<string>('all');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(USE_CASES[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const actors = [
    { id: 'all', label: 'Todos los Actores', icon: Users },
    { id: 'Administrador', label: 'Administrador', icon: Shield },
    { id: 'Coordinador Académico', label: 'Coordinador Académico', icon: Layers },
    { id: 'Docente', label: 'Docente', icon: BookOpen },
    { id: 'Estudiante', label: 'Estudiante', icon: GraduationCap },
  ];

  const filteredCases = USE_CASES.filter((cu) => {
    const matchesActor = selectedActor === 'all' || cu.actor === selectedActor;
    const matchesSearch =
      cu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cu.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cu.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesActor && matchesSearch;
  });

  const selectedCase = USE_CASES.find((cu) => cu.id === selectedCaseId) || USE_CASES[0];

  const getActorColor = (actor: string) => {
    switch (actor) {
      case 'Administrador':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'Coordinador Académico':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'Docente':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Estudiante':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-400" />
            <span>Casos de Uso Principales por Actor (SGA Monolito Modular)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Definición detallada para Administrador, Coordinador Académico, Docente y Estudiante con trazabilidad a RF y RNF.
          </p>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar caso de uso..."
          className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 w-full md:w-64"
        />
      </div>

      {/* Actor Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {actors.map((actor) => {
          const Icon = actor.icon;
          const isSelected = selectedActor === actor.id;
          return (
            <button
              key={actor.id}
              onClick={() => setSelectedActor(actor.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-colors border ${
                isSelected
                  ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{actor.label}</span>
            </button>
          );
        })}
      </div>

      {/* Visual Use Case System Boundary Diagram */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2.5">
          <span className="font-mono text-slate-400 uppercase tracking-wider">
            Diagrama Visual de Casos de Uso (UML / Límite del Sistema SGA)
          </span>
          <span className="font-mono text-sky-400 text-[11px]">
            Haga clic en un caso de uso para cargar su flujo detallado
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Column 1: Administrador */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-rose-500/30 space-y-2.5">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs border-b border-slate-800/80 pb-2">
              <Shield className="w-4 h-4" />
              <span>Administrador</span>
            </div>
            <div className="space-y-1.5">
              {USE_CASES.filter(c => c.actor === 'Administrador').map(cu => (
                <button
                  key={cu.id}
                  onClick={() => setSelectedCaseId(cu.id)}
                  className={`w-full text-left p-2 rounded-lg text-[11px] font-mono transition-all cursor-pointer border ${
                    selectedCaseId === cu.id
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-semibold'
                      : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  ⬡ {cu.code}: {cu.name}
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Coordinador Académico */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-purple-500/30 space-y-2.5">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs border-b border-slate-800/80 pb-2">
              <Layers className="w-4 h-4" />
              <span>Coordinador Académico</span>
            </div>
            <div className="space-y-1.5">
              {USE_CASES.filter(c => c.actor === 'Coordinador Académico').map(cu => (
                <button
                  key={cu.id}
                  onClick={() => setSelectedCaseId(cu.id)}
                  className={`w-full text-left p-2 rounded-lg text-[11px] font-mono transition-all cursor-pointer border ${
                    selectedCaseId === cu.id
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 font-semibold'
                      : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  ⬡ {cu.code}: {cu.name}
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Docente */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs border-b border-slate-800/80 pb-2">
              <BookOpen className="w-4 h-4" />
              <span>Docente</span>
            </div>
            <div className="space-y-1.5">
              {USE_CASES.filter(c => c.actor === 'Docente').map(cu => (
                <button
                  key={cu.id}
                  onClick={() => setSelectedCaseId(cu.id)}
                  className={`w-full text-left p-2 rounded-lg text-[11px] font-mono transition-all cursor-pointer border ${
                    selectedCaseId === cu.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-semibold'
                      : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  ⬡ {cu.code}: {cu.name}
                </button>
              ))}
            </div>
          </div>

          {/* Column 4: Estudiante */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-sky-500/30 space-y-2.5">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs border-b border-slate-800/80 pb-2">
              <GraduationCap className="w-4 h-4" />
              <span>Estudiante</span>
            </div>
            <div className="space-y-1.5">
              {USE_CASES.filter(c => c.actor === 'Estudiante').map(cu => (
                <button
                  key={cu.id}
                  onClick={() => setSelectedCaseId(cu.id)}
                  className={`w-full text-left p-2 rounded-lg text-[11px] font-mono transition-all cursor-pointer border ${
                    selectedCaseId === cu.id
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 font-semibold'
                      : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  ⬡ {cu.code}: {cu.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left List + Right Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cases List */}
        <div className="lg:col-span-5 space-y-2">
          {filteredCases.map((cu) => {
            const isSelected = cu.id === selectedCase.id;
            return (
              <button
                key={cu.id}
                onClick={() => setSelectedCaseId(cu.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-sky-500 ring-1 ring-sky-500/30'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-sky-400 font-semibold">{cu.code}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getActorColor(cu.actor)}`}>
                    {cu.actor}
                  </span>
                </div>
                <div className="font-semibold text-xs text-white line-clamp-1 mb-1">{cu.name}</div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{cu.summary}</p>
                <div className="flex items-center gap-1 mt-2 text-[10px] font-mono text-slate-500">
                  <span>Módulo: {cu.moduleInCharge}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Case Detail Pane */}
        <div className="lg:col-span-7 rounded-xl bg-slate-900/80 border border-slate-800 p-6 space-y-5">
          {/* Top Title & Metadata */}
          <div className="border-b border-slate-800 pb-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono mb-2">
              <span className="text-sky-400 font-bold">{selectedCase.code}</span>
              <span className="text-slate-600">·</span>
              <span className={`px-2 py-0.5 rounded border ${getActorColor(selectedCase.actor)}`}>
                Actor: {selectedCase.actor}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 font-sans">{selectedCase.moduleInCharge}</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">{selectedCase.name}</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedCase.summary}</p>
          </div>

          {/* Preconditions */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              Precondiciones
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {selectedCase.preconditions.map((prec, i) => (
                <li key={i} className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                  <span>{prec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Flow */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Flujo Principal de Ejecución (Paso a Paso)</span>
            </h4>
            <div className="space-y-1.5">
              {selectedCase.mainFlow.map((step, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono text-[11px] leading-relaxed">
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* Alternative Flows */}
          {selectedCase.alternativeFlows && selectedCase.alternativeFlows.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Flujos Alternativos & Manejo de Excepciones</span>
              </h4>
              <div className="space-y-1.5">
                {selectedCase.alternativeFlows.map((alt, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200 font-mono text-[11px] leading-relaxed">
                    {alt}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Postconditions */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              Postcondiciones
            </h4>
            <ul className="space-y-1 text-xs text-slate-300">
              {selectedCase.postconditions.map((post, i) => (
                <li key={i} className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{post}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Traceability to Requirements */}
          <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-mono text-slate-500 text-[11px] block mb-1">
                Requerimientos Funcionales Vinculados:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCase.relatedRF.map((rf) => (
                  <span key={rf} className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-300 font-mono text-[11px]">
                    {rf}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-mono text-slate-500 text-[11px] block mb-1">
                Requerimientos No Funcionales (Atributos):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCase.relatedRNF.map((rnf) => (
                  <span key={rnf} className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[11px]">
                    {rnf}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
