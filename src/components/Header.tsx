import React, { useRef, useEffect } from 'react';
import {
  Layers,
  ShieldCheck,
  Cpu,
  Sliders,
  FileText,
  Download,
  Database,
  Server,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Cloud,
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenReport }) => {
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  const navItems = [
    { id: 'dictamen', label: 'Dictamen & Estilos', icon: Layers },
    { id: 'trazabilidad', label: 'Trazabilidad & SPOF', icon: CheckSquare },
    { id: 'infra_cloud', label: 'Infra Cloud & Mitigación', icon: Cloud },
    { id: 'casos_uso', label: 'Casos de Uso (4 Actores)', icon: FileText },
    { id: 'componentes', label: 'Componentes Lógicos', icon: Cpu },
    { id: 'modelo_datos', label: 'Modelo de Datos (ER)', icon: Database },
    { id: 'despliegue', label: 'Despliegue & Secuencia', icon: Server },
    { id: 'adrs', label: 'Decisiones ADR (4)', icon: ShieldCheck },
    { id: 'requisitos', label: '12 RF / 12 RNF', icon: FileText },
    { id: 'simulador', label: 'Simulador SLA', icon: Sliders },
  ];

  // Auto-scroll active tab into view when changed
  useEffect(() => {
    if (activeTabRef.current && tabsScrollRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeTab]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (tabsScrollRef.current) {
      const scrollAmount = 260;
      tabsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0c0f17]/95 backdrop-blur-md border-b border-slate-800 shadow-lg shadow-black/20 w-full max-w-full">
      {/* Top Bar: Wordmark + Global SLA indicator + Export CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="flex items-center justify-between gap-4 h-15">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0 min-w-0">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono font-bold text-sm shrink-0">
              SGA
            </span>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-white truncate">
                Dossier de Arquitectura de Software
              </h1>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block truncate">
                Sistema de Gestión Académica · Monolito Modular
              </p>
            </div>
          </div>

          {/* Right Action: SLA Info Badge + Export Button */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>300 Concurrentes</span>
              <span className="text-slate-600">·</span>
              <span className="text-sky-300 font-semibold">SLA 99.5%</span>
            </div>

            <button
              onClick={onOpenReport}
              className="flex items-center gap-2 px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm shadow-sky-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar Dictamen</span>
              <span className="sm:hidden">Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dedicated Scrollable Tabs Bar (Responsive Horizontal Scroll) */}
      <div className="w-full bg-[#0a0d14] relative">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 relative flex items-center">
          {/* Scroll Left Button (visible on hover or when needed) */}
          <button
            onClick={() => handleScroll('left')}
            className="hidden sm:flex items-center justify-center w-7 h-7 rounded-md bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 shrink-0 mr-1.5 transition-colors cursor-pointer"
            aria-label="Desplazar pestañas a la izquierda"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Horizontal Scrollable Tabs Container */}
          <div
            ref={tabsScrollRef}
            tabIndex={0}
            role="region"
            aria-label="Pestañas del dossier de arquitectura"
            className="flex-1 overflow-x-auto custom-scrollbar scroll-smooth py-2 flex items-center gap-1.5 sm:gap-2 px-1 focus:outline-none"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  ref={isActive ? activeTabRef : null}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-300 border-sky-500/40 shadow-sm shadow-sky-500/10 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border-slate-800/60 bg-slate-950/40'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-sky-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => handleScroll('right')}
            className="hidden sm:flex items-center justify-center w-7 h-7 rounded-md bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 shrink-0 ml-1.5 transition-colors cursor-pointer"
            aria-label="Desplazar pestañas a la derecha"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
