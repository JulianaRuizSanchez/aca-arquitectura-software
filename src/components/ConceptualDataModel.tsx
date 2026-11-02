import React, { useState } from 'react';
import { CONCEPTUAL_ENTITIES, ConceptualEntity } from '../data/architectureData';
import { Database, Key, Link2, CheckCircle2, ArrowRight, ShieldAlert, Layers } from 'lucide-react';

export const ConceptualDataModel: React.FC = () => {
  const [selectedEntityId, setSelectedEntityId] = useState<string>('ent-matricula');

  const selectedEntity = CONCEPTUAL_ENTITIES.find((e) => e.id === selectedEntityId) || CONCEPTUAL_ENTITIES[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-sky-400 mb-1">
          <span>MODELO DE DATOS CONCEPTUAL · SISTEMA DE GESTIÓN ACADÉMICA</span>
          <span className="text-slate-600">·</span>
          <span>10 ENTIDADES CANÓNICAS & CARDINALIDADES</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Database className="w-5 h-5 text-sky-400" />
          <span>Diagrama Entidad-Relación Conceptual (ER) & Restricciones</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-4xl">
          Estructura de persistencia relacional con límites de esquema por módulo (auth, academico, matricula, calificaciones), integridad referencial y restricciones ACID.
        </p>
      </div>

      {/* Visual ER Diagram Map */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
          <span className="font-mono text-slate-400 uppercase tracking-wider">
            Mapa Visual de Relaciones y Cardinalidades (Haga clic en una entidad para auditar sus atributos)
          </span>
          <span className="font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
            PostgreSQL Relacional Multi-Schema
          </span>
        </div>

        {/* Visual Entity Grid Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CONCEPTUAL_ENTITIES.map((ent) => {
            const isSelected = ent.id === selectedEntity.id;
            return (
              <button
                key={ent.id}
                onClick={() => setSelectedEntityId(ent.id)}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-slate-900 border-sky-500 ring-1 ring-sky-500/40 shadow-md shadow-sky-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>PK: {ent.primaryKey.split(' ')[0]}</span>
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                </div>
                <div className="font-bold text-sm text-white">{ent.name}</div>
                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{ent.module.split(' ')[0]}</div>
                <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-sky-400">
                  {ent.relationships.length} Relaciones
                </div>
              </button>
            );
          })}
        </div>

        {/* Visual Relationship Graph Summary */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
          <div className="font-mono text-slate-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Matriz de Cardinalidades Principales del SGA:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 font-mono text-[11px] text-slate-300">
            <div className="p-2 rounded bg-slate-900/70 border border-slate-800/80">
              <span className="text-sky-300 font-bold">Usuario</span> (1) ── (N) <span className="text-white font-bold">Rol</span>
              <div className="text-[10px] text-slate-400 mt-0.5">Vía tabla pivote auth.usuario_rol</div>
            </div>
            <div className="p-2 rounded bg-slate-900/70 border border-slate-800/80">
              <span className="text-sky-300 font-bold">Programa</span> (1) ── (N) <span className="text-white font-bold">Estudiante</span>
              <div className="text-[10px] text-slate-400 mt-0.5">Adscripción formal del estudiante</div>
            </div>
            <div className="p-2 rounded bg-slate-900/70 border border-slate-800/80">
              <span className="text-sky-300 font-bold">Programa</span> (N) ── (M) <span className="text-white font-bold">Asignatura</span>
              <div className="text-[10px] text-slate-400 mt-0.5">Plan de estudio con créditos y nivel</div>
            </div>
            <div className="p-2 rounded bg-slate-900/70 border border-slate-800/80">
              <span className="text-sky-300 font-bold">Asignatura</span> (1) ── (N) <span className="text-white font-bold">Grupo</span>
              <div className="text-[10px] text-slate-400 mt-0.5">Secciones por periodo lectivo</div>
            </div>
            <div className="p-2 rounded bg-slate-900/70 border border-slate-800/80">
              <span className="text-sky-300 font-bold">Docente</span> (1) ── (N) <span className="text-white font-bold">Grupo</span>
              <div className="text-[10px] text-slate-400 mt-0.5">Asignación académica horaria</div>
            </div>
            <div className="p-2 rounded bg-slate-900/70 border border-slate-800/80">
              <span className="text-sky-300 font-bold">Estudiante</span> (1) ── (N) <span className="text-white font-bold">Matrícula</span>
              <div className="text-[10px] text-slate-400 mt-0.5">1 Matrícula confirmada por periodo</div>
            </div>
            <div className="p-2 rounded bg-slate-900/70 border border-slate-800/80">
              <span className="text-sky-300 font-bold">Grupo</span> (1) ── (N) <span className="text-white font-bold">DetalleMatrícula</span>
              <div className="text-[10px] text-slate-400 mt-0.5">Control atómico de cupo_disponible</div>
            </div>
            <div className="p-2 rounded bg-slate-900/70 border border-slate-800/80">
              <span className="text-sky-300 font-bold">Grupo</span> (1) ── (N) <span className="text-white font-bold">Calificación</span>
              <div className="text-[10px] text-slate-400 mt-0.5">Evaluaciones por corte porcentual</div>
            </div>
            <div className="p-2 rounded bg-slate-900/70 border border-slate-800/80">
              <span className="text-sky-300 font-bold">Estudiante</span> (1) ── (N) <span className="text-white font-bold">Calificación</span>
              <div className="text-[10px] text-slate-400 mt-0.5">Historial y promedios ponderados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Entity Inspector */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 space-y-6">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono mb-1">
              <span className="text-sky-400 font-bold">Entidad Conceptual:</span>
              <span className="text-white font-bold">{selectedEntity.name}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">{selectedEntity.module}</span>
            </div>
            <p className="text-xs text-slate-300">{selectedEntity.description}</p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono shrink-0">
            <span className="text-slate-500 block text-[10px]">Primary Key (PK):</span>
            <span className="text-emerald-400 font-semibold">{selectedEntity.primaryKey}</span>
          </div>
        </div>

        {/* Attributes Table */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span>Atributos y Tipos de Datos (PostgreSQL DDL)</span>
          </h4>
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Atributo</th>
                  <th className="py-2.5 px-3">Tipo de Dato</th>
                  <th className="py-2.5 px-3">Restricción</th>
                  <th className="py-2.5 px-3">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                {selectedEntity.attributes.map((attr, i) => (
                  <tr key={i} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-semibold text-white flex items-center gap-1.5">
                      {attr.name === 'id' && <Key className="w-3 h-3 text-emerald-400" />}
                      <span>{attr.name}</span>
                    </td>
                    <td className="py-2.5 px-3 text-sky-300">{attr.type}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] ${
                          attr.isRequired ? 'bg-slate-800 text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {attr.isRequired ? 'NOT NULL' : 'NULLABLE'}
                        {attr.isUnique ? ' · UNIQUE' : ''}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">{attr.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Foreign Keys & Relationships */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-purple-400" />
              <span>Claves Foráneas (Foreign Keys)</span>
            </h4>
            {selectedEntity.foreignKeys.length > 0 ? (
              <div className="space-y-2">
                {selectedEntity.foreignKeys.map((fk, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-0.5">
                    <div className="font-mono text-purple-300 font-semibold">
                      {fk.field} → {fk.referencesEntity}(id)
                    </div>
                    <div className="text-[11px] text-slate-400">{fk.description}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs text-slate-500 font-mono">
                Entidad independiente sin claves foráneas salientes.
              </div>
            )}
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Cardinalidades con Otras Entidades</span>
            </h4>
            <div className="space-y-2">
              {selectedEntity.relationships.map((rel, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{rel.targetEntity}</span>
                    <span className="font-mono text-[11px] text-sky-400 font-bold bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
                      {rel.cardinality}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">{rel.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Business Rules */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            Reglas de Integridad y Negocio Asociadas a la Entidad
          </span>
          <ul className="space-y-1.5 text-xs text-slate-300 font-mono text-[11px]">
            {selectedEntity.businessRules.map((rule, rIdx) => (
              <li key={rIdx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
