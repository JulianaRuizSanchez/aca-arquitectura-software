import React, { useState } from 'react';
import { Header } from './components/Header';
import { VerdictAndComparison } from './components/VerdictAndComparison';
import { AdrExplorer } from './components/AdrExplorer';
import { UseCasesExplorer } from './components/UseCasesExplorer';
import { LogicalComponentModel } from './components/LogicalComponentModel';
import { ConceptualDataModel } from './components/ConceptualDataModel';
import { DeploymentAndSequence } from './components/DeploymentAndSequence';
import { RequirementsMatrix } from './components/RequirementsMatrix';
import { CapacitySimulator } from './components/CapacitySimulator';
import { TraceabilityAndRisks } from './components/TraceabilityAndRisks';
import { CloudInfraAndMitigation } from './components/CloudInfraAndMitigation';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dictamen');
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#0c0f17] text-slate-200 flex flex-col selection:bg-sky-500 selection:text-slate-950 font-sans overflow-x-hidden w-full max-w-full">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 min-w-0">
        {/* Dynamic Section Rendering */}
        {activeTab === 'dictamen' && <VerdictAndComparison />}
        {activeTab === 'trazabilidad' && <TraceabilityAndRisks />}
        {activeTab === 'infra_cloud' && <CloudInfraAndMitigation />}
        {activeTab === 'casos_uso' && <UseCasesExplorer />}
        {activeTab === 'componentes' && <LogicalComponentModel />}
        {activeTab === 'modelo_datos' && <ConceptualDataModel />}
        {activeTab === 'despliegue' && <DeploymentAndSequence />}
        {activeTab === 'adrs' && <AdrExplorer />}
        {activeTab === 'requisitos' && <RequirementsMatrix />}
        {activeTab === 'simulador' && <CapacitySimulator />}
      </main>

      {/* Clean Senior Engineering Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-400 font-semibold">SGA Architecture Dossier</span>
            <span>·</span>
            <span>Sistema de Gestión Académica</span>
            <span>·</span>
            <span>Estándares IEEE / ISO 25010</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>300 Usuarios Concurrentes</span>
            <span aria-hidden="true">·</span>
            <span>SLA 99.5%</span>
            <span aria-hidden="true">·</span>
            <span>Latencia &lt; 3.0s</span>
          </div>
        </div>
      </footer>

      {/* Full Document Export Modal */}
      <ExecutiveReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
}
