import React, { useState } from 'react';
import { X, Copy, Check, Download, Printer, FileText } from 'lucide-react';
import {
  ARCHITECTURE_STYLES,
  ARCHITECTURAL_DECISIONS,
  OFFICIAL_FUNCTIONAL_REQUIREMENTS,
  OFFICIAL_NON_FUNCTIONAL_REQUIREMENTS,
} from '../data/architectureData';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const markdownReport = `# DICTAMEN Y MEMORIA DE ARQUITECTURA DE SOFTWARE
## PROYECTO: SISTEMA DE GESTIÓN ACADÉMICA (SGA)
**Rol:** Arquitecto de Software Senior  
**Alcance:** Estudiantes, Docentes, Matrículas y Calificaciones  
**Restricciones de Calidad:** 300 usuarios concurrentes | Latencia < 3.0s | Disponibilidad 99.5% (SLA) | Arquitectura Escalable  
**Fecha:** Noviembre 2026  
**Estándar:** ISO/IEC 25010 / SEI ATAM (Architecture Tradeoff Analysis Method)

---

### 1. DICTAMEN ARQUITECTÓNICO EJECUTIVO

**VEREDICTO TÉCNICO:** Se determina como opción definitiva y óptima el **MONOLITO MODULAR con Bounded Contexts basados en Domain-Driven Design (DDD) y Arquitectura Hexagonal**.

#### Justificación Basada en Atributos de Calidad, Complejidad y Tamaño:
1. **Tamaño del Sistema & Concurrencia (300 usuarios):**
   - Una concurrencia de 300 usuarios simultáneos en una aplicación web interactiva representa un caudal aproximado de **30 a 90 transacciones/segundo (TPS)**.
   - Dos instancias de un Monolito Modular desplegadas en contenedores ligeros absorben este pico operando por debajo del 15% de utilización de CPU.
   - Adoptar **Microservicios** para esta escala representa un antipatrón de sobreingeniería masiva: requeriría clústeres Kubernetes, API Gateways, Service Mesh, observabilidad distribuida y colas Kafka, elevando los costos de infraestructura hasta 5x y consumiendo el presupuesto universitario en orquestación técnica en lugar de valor funcional.

2. **Tiempo de Respuesta (< 3.0 segundos):**
   - El Monolito Modular resuelve las consultas y orquestaciones mediante **llamadas en memoria (In-Process)** con latencias sub-milisegundo (< 0.5ms).
   - En microservicios, el flujo de validación de una matrícula requiere encadenar peticiones de red entre Servicios de Estudiantes, Malla Curricular, Cupos de Sección y Financiero. Cada salto introduce 30-80ms más tiempo de serialización JSON/gRPC, poniendo en riesgo el percentil p95 ante contención.

3. **Disponibilidad del 99.5% (SLA):**
   - Un SLA del 99.5% autoriza hasta **43.8 horas de indisponibilidad anual** (o 3.65 horas al mes).
   - El Monolito Modular cumple holgadamente este estándar desplegando 2 réplicas tras un Application Load Balancer con comprobaciones de estado (/healthz) y base de datos relacional Multi-AZ con failover automatizado (< 60s).
   - En microservicios, la disponibilidad global es el producto de las disponibilidades individuales (ej. 5 microservicios al 99.8% arrojan una disponibilidad compuesta de apenas 99.0%, violando el SLA).

4. **Descarte de la Arquitectura en Capas Tradicional (N-Tier):**
   - Si bien una arquitectura en capas soporta 300 usuarios, carece de fronteras de dominio. A medida que el SGA evoluciona, los servicios de Matrícula terminan dependiendo directamente de entidades de Docentes y Calificaciones, degenerando rápidamente en un "Big Ball of Mud" de alto costo de refactorización.

---

### 2. MATRIZ COMPARATIVA DE ESTILOS ARQUITECTÓNICOS

| Criterio / Atributo | Monolito Modular (Recomendado) | Arquitectura en Capas | Microservicios Distribuidos |
| :--- | :--- | :--- | :--- |
| **Ajuste para 300 Usuarios** | Óptimo (100% capacidad) | Aceptable | Sobredimensionado (Antipatrón) |
| **Latencia de Respuesta** | In-Process (< 1ms intermódulo) | In-Process | 4-6 saltos de red HTTP (alto overhead) |
| **Integridad en Matrícula** | Transacciones ACID locales | Transacciones ACID locales | Consistencia eventual / Sagas complejas |
| **Disponibilidad SLA 99.5%** | Uptime proyectado > 99.8% | > 99.5% | Compleja por fallos en cascada |
| **Costo Operativo (TCO)** | Bajo ($80 - $180 USD/mes) | Bajo ($60 - $150 USD/mes) | Muy Alto ($600 - $1,500 USD/mes) |
| **Mantenibilidad & Evolución** | Alta (Límites DDD estrictos) | Baja (Riesgo de acoplamiento) | Alta (pero costo no justificado) |

---

### 3. DECISIONES ARQUITECTÓNICAS JUSTIFICADAS (ADRs)

#### ADR-001: Adopción del Monolito Modular con Bounded Contexts y Arquitectura Hexagonal
- **Estado:** Aprobado (Definitivo).
- **Contexto:** Necesidad de centralizar Estudiantes, Docentes, Matrículas y Calificaciones para 300 usuarios concurrentes sin incurrir en la sobrecarga de microservicios ni en el desorden de capas.
- **Decisión:** Implementar un único artefacto desplegable dividido en módulos autónomos con contratos e interfaces públicas tipadas y eventos de dominio en memoria.
- **Impacto:** Latencia p95 < 250ms, despliegue continuo simple y posibilidad de extraer el módulo de Matrículas a microservicio si en el futuro la universidad crece a 50,000 concurrentes.

#### ADR-002: Persistencia y Concurrencia Crítica en Matrículas (PostgreSQL ACID + Row-Level Locking y PgBouncer)
- **Estado:** Aprobado (Definitivo).
- **Contexto:** 300 estudiantes intentan matricular simultáneamente secciones con cupos limitados (riesgo de condiciones de carrera y sobrecupos).
- **Decisión:** Base de datos relacional PostgreSQL con bloqueo pesimista a nivel de fila (\`SELECT ... FOR UPDATE\`) en transacciones atómicas sub-30ms, respaldado por PgBouncer con pool de 100 conexiones.
- **Impacto:** Cero sobrecupos garantizados (100% integridad transaccional), eliminando la necesidad de bloqueos distribuidos.

#### ADR-003: Caching Distribuido y Desacoplamiento Asíncrono (Redis L2 + Background Workers)
- **Estado:** Aprobado (Definitivo).
- **Contexto:** Más del 75% del tráfico en inscripciones es de lectura repetitiva (oferta de asignaturas y horarios). Tareas pesadas (PDFs de actas y envío de correos) no deben bloquear la respuesta HTTP.
- **Decisión:** Redis como caché de segundo nivel para el catálogo académico y cola BullMQ para generación de boletines/actas en segundo plano.
- **Impacto:** Reducción del 70% de lecturas a la BD, respuesta de consulta de catálogo en < 15ms y liberación del hilo HTTP en < 100ms.

#### ADR-004: Topología de Despliegue y Alta Disponibilidad (Contenedores Multi-Instancia, ALB y SLA 99.5%)
- **Estado:** Aprobado (Definitivo).
- **Contexto:** Garantizar disponibilidad anual ≥ 99.5% (máx. 43.8h de indisponibilidad) con tolerancia a caídas de nodo.
- **Decisión:** 2 réplicas de contenedor tras Application Load Balancer con distribución Round-Robin, health checks cada 10 segundos, sesiones Stateless vía JWT y base de datos con réplica standby Multi-AZ.
- **Impacto:** Zero-downtime rolling updates y auto-recuperación en caso de fallo de instancia.

---

### 4. CASOS DE USO PRINCIPALES POR ACTOR (MONOLITO MODULAR)

#### A. Administrador
1. **CU-ADM-01: Gestionar Usuarios, Roles y Permisos (RF-01, RF-02, RF-12)**
   - *Precondición:* Sesión activa con credenciales de Administrador en canal HTTPS.
   - *Flujo Principal:* Selecciona usuario $\rightarrow$ Asigna rol (administrador, coordinador académico, docente, estudiante) y permisos específicos $\rightarrow$ Valida unicidad de identidad $\rightarrow$ Persiste en esquema \`auth\` $\rightarrow$ Emite evento a bitácora de auditoría.
   - *Postcondición:* Usuario autorizado con principio de menor privilegio; bitácora inmutable actualizada.

2. **CU-ADM-02: Gestionar Programas Académicos y Planes de Estudio (RF-05, RF-11)**
   - *Precondición:* Aprobación curricular institucional vigente.
   - *Flujo Principal:* Registra código, nombre y créditos del programa $\rightarrow$ Asocia asignaturas por semestre $\rightarrow$ Valida grafo acíclico de prerrequisitos $\rightarrow$ Persiste en \`academico\` $\rightarrow$ Invalida caché de catálogo en Redis.
   - *Postcondición:* Catálogo disponible para planificación sin dependencias circulares.

3. **CU-ADM-03: Auditar Eventos Críticos y Trazabilidad Institucional (RF-11, RF-12, RNF-10)**
   - *Precondición:* Permiso de auditoría institucional.
   - *Flujo Principal:* Aplica filtros por usuario, fecha, acción o entidad $\rightarrow$ Consulta índice de auditoría en < 200ms $\rightarrow$ Exporta bitácora verificada con hash SHA-256.

#### B. Coordinador Académico
1. **CU-COORD-01: Configurar Periodos, Grupos y Oferta Académica (RF-04, RF-06, RF-11)**
   - *Precondición:* Periodo académico aperturado y asignaturas creadas.
   - *Flujo Principal:* Selecciona periodo y asignatura $\rightarrow$ Crea grupo con cupo máximo (ej. 35) $\rightarrow$ Asigna docente y aula/enlace $\rightarrow$ Valida no solapamiento de horarios $\rightarrow$ Habilita oferta.
   - *Excepción:* Si el docente ya posee cruce de horario, el sistema rechaza y solicita reasignación.

2. **CU-COORD-02: Gestionar Expedientes de Estudiantes y Docentes (RF-03, RF-04, RF-11)**
   - *Flujo Principal:* Búsqueda y filtrado por documento/nombre $\rightarrow$ Consulta expediente $\rightarrow$ Actualiza datos o estado (Activo/Inactivo) $\rightarrow$ Registra evento en auditoría.

3. **CU-COORD-03: Generar Reportes Consolidados de Matrícula y Rendimiento (RF-10, RF-11, RNF-02)**
   - *Flujo Principal:* Selecciona tipo de reporte $\rightarrow$ Filtra por periodo y programa $\rightarrow$ Consulta vista optimizada de sólo lectura $\rightarrow$ Descarga archivo CSV o PDF generado en segundo plano.

#### C. Docente
1. **CU-DOC-01: Consultar Grupos Asignados y Lista de Estudiantes (RF-04, RF-06, RF-11, RNF-11)**
   - *Flujo Principal:* Inicia sesión $\rightarrow$ Accede a su carga lectiva vigente $\rightarrow$ Selecciona grupo $\rightarrow$ Visualiza lista de estudiantes inscritos. Aislamiento estricto: no puede ver grupos ajenos.

2. **CU-DOC-02: Registrar y Actualizar Calificaciones por Corte (RF-08, RF-11, RF-12, RNF-07)**
   - *Precondición:* Docente titular del grupo y fechas de corte vigentes.
   - *Flujo Principal:* Abre planilla del grupo $\rightarrow$ Ingresa calificaciones numéricas (0.0 a 5.0) $\rightarrow$ Valida rangos $\rightarrow$ Confirma guardado $\rightarrow$ Transacción ACID actualiza tabla \`calificaciones\` $\rightarrow$ Recalcula promedio ponderado $\rightarrow$ Emite evento de auditoría.

#### D. Estudiante
1. **CU-EST-01: Realizar Matrícula Académica en Tiempo Real (RF-06, RF-07, RF-12, RNF-02, RNF-07)**
   - *Precondición:* Estudiante activo y en ventana hábil de matrícula.
   - *Flujo Principal (Crítico):* Consulta oferta de grupos $\rightarrow$ Selecciona asignaturas $\rightarrow$ Confirma matrícula $\rightarrow$ El sistema bloquea pesimistamente el grupo (\`SELECT ... FOR UPDATE\`) $\rightarrow$ Verifica cupo > 0 $\rightarrow$ Valida no duplicados (\`UNIQUE(estudiante_id, grupo_id, periodo_id)\`) $\rightarrow$ Decrementa cupo $\rightarrow$ Inserta matrícula $\rightarrow$ COMMIT transaccional $\rightarrow$ Emite comprobante en < 1.0s.
   - *Excepción:* Si el cupo se agotó en la misma milésima de segundo, hace ROLLBACK y notifica "Cupo agotado" sin inconsistencias.

2. **CU-EST-02: Consultar Resultados Académicos y Horarios (RF-09, RF-11, RNF-02, RNF-11)**
   - *Flujo Principal:* Selecciona periodo $\rightarrow$ Consulta asignaturas matriculadas, horarios de clase y calificaciones de cortes publicados $\rightarrow$ Respuesta en < 300ms protegida por el identificador del token JWT.

---

### 5. MODELO DE COMPONENTES LÓGICOS DEL MONOLITO MODULAR

El sistema se estructura en **6 módulos de alta cohesión y bajo acoplamiento** comunicados mediante interfaces tipadas y eventos de dominio en memoria:

1. **Módulo de Autenticación & Control de Acceso (RBAC) [Transversal]:**
   - *Responsabilidades:* Inicios/cierres de sesión (RF-01), hashing Argon2id, middleware RBAC para roles (RF-02, RNF-01, RNF-11), tokens JWT stateless.
   - *Interfaces Provistas:* \`IAuthService\` (login, logout, verifyToken), \`IRbacService\` (hasPermission, getUserRoles, assignRole).
   - *Dependencias Consumidas:* \`IAuditService\`.
   - *Esquema BD:* \`auth\` (\`usuario\`, \`rol\`, \`usuario_rol\`).

2. **Módulo de Gestión Académica [Core Domain]:**
   - *Responsabilidades:* CRUD de estudiantes y docentes (RF-03, RF-04), programas, planes de estudio y asignaturas (RF-05), periodos lectivos y grupos con cupos y horarios (RF-06), motor de búsqueda y filtros (RF-11).
   - *Interfaces Provistas:* \`IAcademicCatalogService\` (getSubjectDetails, getGroupAvailability, getStudyPlan, searchStudents, searchTeachers), \`IGroupManagementService\` (createGroup, updateGroupCapacity, validateScheduleOverlap).
   - *Dependencias Consumidas:* \`IRbacService\`, \`IAuditService\`.
   - *Esquema BD:* \`academico\` (\`estudiante\`, \`docente\`, \`programa\`, \`plan_estudio\`, \`asignatura\`, \`periodo\`, \`grupo\`).
   - *Táctica:* Caché L2 en Redis para el catálogo e índices GIN/B-Tree en PostgreSQL.

3. **Módulo de Matrículas [Core Domain - Hotspot Concurrente]:**
   - *Responsabilidades:* Inscripción de asignaturas y grupos (RF-07), validación de cupos atómicos bajo concurrencia extrema (RNF-07), prevención de matrículas duplicadas.
   - *Interfaces Provistas:* \`IEnrollmentService\` (enrollStudent, cancelEnrollment, getStudentEnrollments, checkAvailableQuotas).
   - *Dependencias Consumidas:* \`IAcademicCatalogService\`, \`IAuditService\`.
   - *Esquema BD:* \`matricula\` (\`matricula\`, \`detalle_matricula\`).
   - *Táctica:* Transacciones ACID con \`SELECT ... FOR UPDATE\` y restricción compuesta \`UNIQUE\`. Cero sobrecupos.

4. **Módulo de Calificaciones [Core Domain]:**
   - *Responsabilidades:* Captura y modificación de calificaciones por docentes (RF-08), cálculo de promedios ponderados y cortes, consulta de notas y horarios para estudiantes (RF-09).
   - *Interfaces Provistas:* \`IGradingService\` (submitGrades, getGroupRosterWithGrades, closeGradingPeriod), \`IStudentResultsService\` (getStudentAcademicHistory, getTermGrades, getStudentSchedule).
   - *Dependencias Consumidas:* \`IEnrollmentService\`, \`IAcademicCatalogService\`, \`IAuditService\`.
   - *Esquema BD:* \`calificaciones\` (\`evaluacion\`, \`calificacion\`, \`corte_periodo\`, \`acta_definitiva\`).
   - *Táctica:* Operaciones Bulk-Upsert SQL y filtrado contextual por ID de usuario.

5. **Módulo de Reportes & Consultas [Support Domain]:**
   - *Responsabilidades:* Reportes consolidados de matriculados, grupos, asignaturas y resultados académicos (RF-10) con filtros por periodo y programa (RF-11), exportación CSV/PDF (RNF-08).
   - *Interfaces Provistas:* \`IReportingService\` (generateEnrollmentReport, generateGroupOccupancyReport, generateAcademicResultsReport, exportReportToCSV, exportReportToPDF).
   - *Dependencias Consumidas:* \`IAcademicCatalogService\`, \`IEnrollmentService\`, \`IGradingService\`.
   - *Esquema BD:* Vistas de sólo lectura (Read-Only Views) con paginación optimizada.
   - *Táctica:* Procesamiento en Background Worker (BullMQ/Redis) para no degradar el tiempo de respuesta.

6. **Módulo de Auditoría & Trazabilidad [Cross-Cutting]:**
   - *Responsabilidades:* Bitácora inmutable de eventos críticos (inicios de sesión, cambios de roles, matrículas y modificaciones de notas) con usuario, fecha, acción y registro afectado (RF-12, RNF-10).
   - *Interfaces Provistas:* \`IAuditService\` (logEvent, queryAuditTrail, verifyAuditIntegrity).
   - *Dependencias Consumidas:* Ninguna (servicio terminal de registro).
   - *Esquema BD:* \`auditoria\` (\`bitacora_eventos\`, \`hash_integridad\`).
   - *Táctica:* Persistencia asíncrona desacoplada mediante Domain Event Listeners y tabla Append-Only.

---

### 6. MODELO DE DATOS CONCEPTUAL (10 ENTIDADES CANÓNICAS & CARDINALIDADES)

El SGA implementa una persistencia relacional en **PostgreSQL con esquemas lógicos modulares** (\`auth\`, \`academico\`, \`matricula\`, \`calificaciones\`, \`auditoria\`), garantizando aislamiento y transacciones ACID locales:

#### Las 10 Entidades Principales del SGA:
1. **Usuario (\`auth.usuario\`):** Identificador \`id (UUID PK)\`, \`email (UNIQUE)\`, \`password_hash (Argon2id)\`, \`estado\`, \`ultimo_login\`.
2. **Rol (\`auth.rol\`):** \`id (UUID PK)\`, \`codigo (UNIQUE)\` (\`ADMIN\`, \`COORDINADOR\`, \`DOCENTE\`, \`ESTUDIANTE\`), \`nombre\`, \`descripcion\`.
3. **Estudiante (\`academico.estudiante\`):** \`id (UUID PK)\`, \`codigo_estudiantil (UNIQUE)\`, \`documento_identidad (UNIQUE)\`, \`nombres\`, \`apellidos\`, \`estado_academico\` (*Activo, Inactivo*), \`usuario_id (FK)\`, \`programa_id (FK)\`.
4. **Docente (\`academico.docente\`):** \`id (UUID PK)\`, \`documento_identidad (UNIQUE)\`, \`nombres\`, \`apellidos\`, \`especialidad\`, \`estado\`, \`usuario_id (FK)\`.
5. **Programa (\`academico.programa\`):** \`id (UUID PK)\`, \`codigo (UNIQUE)\`, \`nombre\`, \`nivel_formacion\`, \`total_creditos\`.
6. **Asignatura (\`academico.asignatura\`):** \`id (UUID PK)\`, \`codigo (UNIQUE)\`, \`nombre\`, \`creditos (INT > 0)\`, \`semestre_nivel\`.
7. **PeriodoAcadémico (\`academico.periodo\`):** \`id (UUID PK)\`, \`codigo (UNIQUE)\` (ej. 2026-1), \`fecha_inicio\`, \`fecha_fin\`, \`estado\` (*Planeación, Matrículas, En Curso, Cerrado*).
8. **Grupo (\`academico.grupo\`):** \`id (UUID PK)\`, \`codigo_grupo\`, \`cupo_maximo\`, \`cupo_disponible (INT >= 0)\`, \`horario\`, \`aula_o_enlace\`, \`asignatura_id (FK)\`, \`periodo_id (FK)\`, \`docente_id (FK)\`.
9. **Matrícula (\`matricula.matricula\`):** \`id (UUID PK)\`, \`fecha_registro\`, \`total_creditos_inscritos\`, \`estado\`, \`estudiante_id (FK)\`, \`periodo_id (FK)\`. Restricción: \`UNIQUE(estudiante_id, periodo_id)\`. Se compone de \`matricula.detalle_matricula (matricula_id FK, grupo_id FK)\`.
10. **Calificación (\`calificaciones.calificacion\`):** \`id (UUID PK)\`, \`corte_evaluativo\`, \`porcentaje_ponderacion\`, \`valor_nota (0.0 a 5.0)\`, \`fecha_registro\`, \`estado\`, \`estudiante_id (FK)\`, \`grupo_id (FK)\`, \`docente_id (FK)\`.

#### Matriz de Cardinalidades:
- **Usuario (1) ── (N) Rol:** Vía tabla intermedia asociativa \`auth.usuario_rol\`.
- **Usuario (1) ── (1) Estudiante / Docente:** Vínculo de credenciales con el perfil personal.
- **Programa (1) ── (N) Estudiante:** Un programa contiene múltiples estudiantes formalmente adscritos.
- **Programa (N) ── (M) Asignatura:** Plan de estudios que define las asignaturas requeridas por carrera.
- **Asignatura (1) ── (N) Grupo:** Una materia se oferta en múltiples secciones por periodo académico.
- **Docente (1) ── (N) Grupo:** Un profesor orienta varios grupos sin cruce simultáneo de horario.
- **PeriodoAcadémico (1) ── (N) Grupo:** Delimita la vigencia lectiva de la oferta académica.
- **Estudiante (1) ── (N) Matrícula:** Exactamente una matrícula por periodo lectivo por estudiante.
- **Grupo (1) ── (N) DetalleMatrícula:** Gestiona el cupo_disponible bajo reserva concurrente.
- **Grupo (1) ── (N) Calificación ── (1) Estudiante:** Registro de notas por corte evaluativo para cada matriculado.

---

### 7. MODELO DE DESPLIEGUE FÍSICO Y CANALES DE COMUNICACIÓN SEGUROS (HTTPS)

Para atender a **300 usuarios concurrentes**, con tiempo de respuesta **< 3 segundos** y disponibilidad mensual **≥ 99.5% (SLA)**, el sistema se despliega en una arquitectura redundante multi-zona activa-activa:

\`\`\`
[ 300 Clientes Web ] ──( HTTPS / TLS 1.3 - Puerto 443 )──> [ Application Load Balancer / WAF ]
                                                                       |
                            +------------------------------------------+------------------------------------------+
                            | Subnet Privada VPC                                                                  |
                            v                                                                                     v
             [ Backend Contenedor 1 (Monolito) ]                                                   [ Backend Contenedor 2 (Monolito) ]
             - Auth, Gestión, Matrículas, Notas                                                   - Auth, Gestión, Matrículas, Notas
             - Stateless JWT, In-Process (< 0.5ms)                                                 - Stateless JWT, In-Process (< 0.5ms)
                            |                                                                                     |
                            +------------------------------------------+------------------------------------------+
                                                                       | Wire Protocol SSL (verify-full)
                                                                       v
                                                [ PostgreSQL 16 Multi-AZ (PgBouncer Pool) ]
                                                - Primaria Zona A + Standby Replica síncrona en Zona B
                                                - Cifrado en Reposo: AES-256
                                                                       |
                                                +----------------------+----------------------+
                                                |                                             |
                                                v                                             v
                                  [ Redis 7 L2 Cache & BullMQ ]                 [ S3/GCS Object Storage ]
\`\`\`

#### Nodos y Canales de Comunicación Seguros:
1. **Canal Clientes Web → ALB:**
   - **Protocolo:** \`HTTPS / TLS 1.3\` obligatorio (Puerto 443).
   - **Seguridad:** Certificado SSL/TLS con cipher suites modernas, cabeceras HSTS (\`Strict-Transport-Security\`), Content-Security-Policy (CSP), flags \`HttpOnly\`, \`Secure\` y \`SameSite=Strict\`.
   - **Perímetro:** Web Application Firewall (WAF) con reglas anti-DDoS, rate-limiting y mitigación de inyecciones SQL/XSS.
2. **Canal ALB → Contenedores Backend (2 Réplicas):**
   - **Protocolo:** Balanceo Round-Robin a través de subred privada interna (sin IP pública).
   - **Disponibilidad (RNF-03):** Health checks periódicos cada 10s en \`/healthz\`. En caso de caída de una réplica, la conmutación se realiza en < 2 segundos sin pérdida de servicio. Despliegues rolling (*Zero-Downtime*).
3. **Canal Backend → PostgreSQL Relacional:**
   - **Protocolo:** PostgreSQL Native Wire Protocol cifrado con \`SSL/TLS (sslmode=verify-full)\`.
   - **Pool de Conexiones:** PgBouncer con pool de 100 conexiones transaccionales compartidas eficientemente por los 300 usuarios.
   - **Cifrado en Reposo:** Cifrado de volumen \`AES-256\` y failover automático Multi-AZ síncrono (RPO=0, RTO < 60s).
4. **Canal Backend → Redis 7 (L2 Cache & BullMQ):**
   - **Protocolo:** TCP cifrado y autenticado en memoria RAM dentro de la VPC para descarga del 70% de lecturas a la base de datos.

---

### 8. VISTA DE SECUENCIA CRÍTICA: PROCESO DE MATRÍCULA DE UN ESTUDIANTE

Alineado con **RF-07**, **RNF-02 (< 3s)** y **RNF-07 (Integridad ACID y cero sobrecupos)**, se describe el orden cronológico paso a paso entre los participantes:

#### Participantes:
- **Estudiante (Actor):** Usuario final que solicita la inscripción.
- **Interfaz Web (SPA):** Cliente React en el navegador.
- **Backend API (Módulo de Matrículas):** Orquestador transaccional dentro del Monolito Modular.
- **PostgreSQL Relacional:** Motor de base de datos con control de concurrencia ACID.
- **Módulo de Auditoría:** Bitácora inmutable de eventos de dominio.

#### Orden Cronológico Paso a Paso (Flujo Exitoso - 110 ms):
1. **t = 0 ms:** El **Estudiante** selecciona la sección deseada en la UI y presiona *"Confirmar Matrícula"*.
2. **t = +45 ms:** La **Interfaz Web** despacha una solicitud \`POST /api/matriculas\` vía canal seguro **HTTPS / TLS 1.3** con payload JSON \`{ estudianteId, grupoId, periodoId }\` y cabecera \`Authorization: Bearer <token>\`.
3. **t = +46 ms:** El **Backend API** valida criptográficamente la firma del JWT en memoria (< 1 ms), verificando que el usuario posea el rol \`ESTUDIANTE\` y esté activo (RF-01, RF-02).
4. **t = +51 ms:** El Módulo de Matrículas inicia la transacción en PostgreSQL:  
   \`BEGIN TRANSACTION; ISOLATION LEVEL READ COMMITTED;\`
5. **t = +63 ms (Bloqueo Pesimista):** El backend ejecuta:  
   \`SELECT cupo_disponible FROM academico.grupo WHERE id = :grupoId FOR UPDATE;\`  
   *Mecanismo de Concurrencia Crítico:* PostgreSQL adquiere un candado exclusivo a nivel de fila (*Row Lock*). Las demás peticiones concurrentes sobre el mismo grupo esperan serializadas en cola, impidiendo que dos estudiantes tomen el último cupo al mismo tiempo.
6. **t = +66 ms:** PostgreSQL retorna el valor de \`cupo_disponible\` bajo candado exclusivo.
7. **t = +68 ms (Validación de Reglas de Negocio en Dominio):** El backend evalúa:
   - ¿Cupo disponible mayor a cero? (\`cupo_disponible > 0\`) → SÍ.
   - ¿Estudiante en estado académico Activo? → SÍ.
   - ¿Estudiante sin matrícula previa en el mismo curso/grupo? → SÍ (garantizado además por constraint \`UNIQUE(estudiante_id, grupo_id, periodo_id)\`).
8. **t = +76 ms:** El backend ejecuta el decremento atómico:  
   \`UPDATE academico.grupo SET cupo_disponible = cupo_disponible - 1 WHERE id = :grupoId;\`
9. **t = +85 ms:** El backend inserta los registros oficiales:  
   \`INSERT INTO matricula.matricula (id, estudiante_id, periodo_id, ...) VALUES (...);\`  
   \`INSERT INTO matricula.detalle_matricula (matricula_id, grupo_id) VALUES (...);\`
10. **t = +95 ms:** Se confirma la transacción:  
    \`COMMIT;\` → Libera de inmediato el bloqueo pesimista en PostgreSQL para la siguiente solicitud encolada.
11. **t = +96 ms:** El Módulo de Matrículas despacha en memoria el evento \`StudentEnrolledEvent\`. El Módulo de Auditoría lo recibe y lo persiste de forma asíncrona en \`auditoria.bitacora_eventos\` sin demorar la respuesta al estudiante (RF-12, RNF-10).
12. **t = +110 ms:** El **Backend API** responde a la Interfaz Web con código \`HTTP 201 Created\` y el comprobante \`{ estado: "Confirmada", comprobante: "MAT-2026-8921" }\`.  
    *Tiempo total:* **110 ms** (supera con 96% de margen el límite de < 3.0s de RNF-02).
13. **t = +125 ms:** La **Interfaz Web** renderiza el comprobante de matrícula oficial y el horario actualizado.

#### Flujo de Excepción (Cupo Agotado en Milisegundos):
- Si en el paso 7 \`cupo_disponible == 0\` (porque otro estudiante confirmó una milésima de segundo antes):
  - El backend ejecuta inmediatamente \`ROLLBACK;\`.
  - Devuelve \`HTTP 409 Conflict\` con mensaje: *\"El grupo seleccionado ha completado su capacidad máxima\"*.
  - **Garantía:** Cero sobrecupos, preservando la consistencia estricta de la base de datos (RNF-07).

---

### 9. SÍNTESIS OFICIAL DE REQUERIMIENTOS (12 RF & 12 RNF)

#### Requerimientos Funcionales Oficiales (RF):
1. **RF-01. Autenticación:** Inicios y cierres de sesión con credenciales individuales.
2. **RF-02. Roles y permisos:** Administrador, coordinador académico, docente y estudiante.
3. **RF-03. Gestión de estudiantes:** Registrar, consultar, actualizar y desactivar estudiantes.
4. **RF-04. Gestión de docentes:** Registrar, consultar, actualizar y desactivar docentes.
5. **RF-05. Programas y asignaturas:** Programas, planes de estudio y asignaturas con códigos y créditos.
6. **RF-06. Grupos y periodos:** Periodos lectivos, grupos, cupos, docentes, horarios y aulas.
7. **RF-07. Matrícula académica:** Inscripción, validación de cupos y prevención de duplicados.
8. **RF-08. Registro de calificaciones:** Docente registra y actualiza notas dentro de sus permisos.
9. **RF-09. Consulta de resultados:** Estudiante consulta matriculadas, horarios y calificaciones.
10. **RF-10. Reportes:** Estudiantes matriculados, grupos, asignaturas y resultados con filtros.
11. **RF-11. Búsqueda y filtros:** Búsqueda por IDs, nombres, programa, periodo o estado.
12. **RF-12. Auditoría:** Bitácora inmutable de inicios de sesión, roles, matrículas y notas.

#### Requerimientos No Funcionales Oficiales (RNF):
1. **RNF-01. Seguridad:** HTTPS obligatorio, contraseñas no en texto plano y control RBAC.
2. **RNF-02. Rendimiento:** ≥ 95% de consultas comunes ≤ 3 segundos con hasta 300 usuarios concurrentes.
3. **RNF-03. Disponibilidad:** Disponibilidad mensual objetivo ≥ 99.5% (máx. 3.65h de indisponibilidad).
4. **RNF-04. Escalabilidad:** Aumento elástico de recursos y crecimiento sin rediseño.
5. **RNF-05. Mantenibilidad:** Separación de responsabilidades, bajo acoplamiento y cohesión modular.
6. **RNF-06. Usabilidad y accesibilidad:** Interfaz adaptable a PC y móviles, contraste y operación por teclado.
7. **RNF-07. Integridad y consistencia:** Preservar consistencia de datos ante solicitudes simultáneas en matrícula y notas.
8. **RNF-08. Interoperabilidad:** Interfaces documentadas API REST para integración futura.
9. **RNF-09. Respaldo y recuperación:** Copias de seguridad periódicas y restauración ante fallos.
10. **RNF-10. Trazabilidad:** Relación explícita entre requerimientos, decisiones (ADRs), componentes y pruebas.
11. **RNF-11. Privacidad:** Acceso a datos personales y académicos limitado estrictamente al rol.
12. **RNF-12. Compatibilidad:** Funcionamiento en navegadores comunes recientes y diferentes tamaños de pantalla.

---

### 10. MATRIZ DE TRAZABILIDAD BIDIRECCIONAL & GESTIÓN DE RIESGOS TÉCNICOS (SPOF)

#### A. Propuesta de Matriz de Trazabilidad en Formato de Tabla
Relaciona los requerimientos funcionales y no funcionales solicitados con los componentes lógicos del Monolito Modular:

| Requerimiento Funcional (RF) | Requerimientos No Funcionales (RNF) Asociados | Componente Lógico Responsable | Esquema BD & Interfaces Provistas | Mecanismo de Verificación |
| :--- | :--- | :--- | :--- | :--- |
| **RF-01. Autenticación**<br>Inicios y cierres de sesión con credenciales individuales. | • **RNF-01 (Seguridad):** Argon2id + HTTPS + JWT Stateless.<br>• **RNF-02 (Rendimiento):** Validación de firma < 1ms.<br>• **RNF-03 (Disponibilidad):** Stateless sin sesión pegajosa.<br>• **RNF-04 (Escalabilidad):** Escalado horizontal lineal.<br>• **RNF-05 (Mantenibilidad):** Bounded context aislado. | **Módulo de Autenticación & Control de Acceso (RBAC)**<br>*(Cross-Cutting)* | **Esquema:** \`auth\` (\`usuario\`, \`rol\`)<br>**Interfaces:** \`IAuthService\` (\`login\`, \`logout\`, \`verifyToken\`) | Pruebas de penetración OWASP ZAP, verificación de firma criptográfica y pruebas de carga con k6 a 300 usuarios. |
| **RF-02. Roles y permisos**<br>Administrador, coordinador, docente y estudiante. | • **RNF-01 (Seguridad):** Principio de menor privilegio.<br>• **RNF-02 (Rendimiento):** Resolución O(1) en memoria < 0.2ms.<br>• **RNF-03 (Disponibilidad):** Autorización ininterrumpida.<br>• **RNF-04 (Escalabilidad):** Verificación distribuida sin locks.<br>• **RNF-05 (Mantenibilidad):** Catálogo de permisos tipado. | **Módulo de Autenticación & Control de Acceso (RBAC)**<br>*(Cross-Cutting)* | **Esquema:** \`auth\` (\`rol\`, \`permiso\`, \`rol_permiso\`)<br>**Interfaces:** \`IRbacService\` (\`hasPermission\`, \`getUserRoles\`, \`assignRole\`) | Pruebas unitarias de matriz RBAC al 100% de cobertura y pruebas de integración en middleware interceptor. |
| **RF-03. Gestión de estudiantes**<br>Registrar, consultar, actualizar y desactivar estudiantes. | • **RNF-01 (Seguridad):** Aislamiento de datos personales.<br>• **RNF-02 (Rendimiento):** Búsquedas indexadas < 150ms.<br>• **RNF-03 (Disponibilidad):** Desvío a réplica de lectura.<br>• **RNF-04 (Escalabilidad):** Paginación por cursor (> 100k reg).<br>• **RNF-05 (Mantenibilidad):** Agregado DDD Estudiante puro. | **Módulo de Gestión Académica**<br>*(Core Domain)* | **Esquema:** \`academico\` (\`estudiante\`, \`programa\`)<br>**Interfaces:** \`IAcademicCatalogService\`, \`IStudentManagementService\` | Pruebas de integración con Testcontainers PostgreSQL y benchmarks de latencia p95 con k6. |
| **RF-07. Matrícula académica**<br>Inscripción, validación de cupos y prevención de duplicados. | • **RNF-01 (Seguridad):** Inyección de identidad desde JWT.<br>• **RNF-02 (Rendimiento):** Transacción sub-35ms, total < 1.0s.<br>• **RNF-03 (Disponibilidad):** PgBouncer pooler + timeout 2s.<br>• **RNF-04 (Escalabilidad):** Módulo desacoplado extraíble.<br>• **RNF-05 (Mantenibilidad):** Aggregate Root con Domain Events. | **Módulo de Matrículas (Hotspot Concurrente)**<br>*(Core Domain)* | **Esquemas:** \`matricula\` (\`matricula\`, \`detalle_matricula\`) y \`academico\` (\`grupo\`)<br>**Interfaces:** \`IEnrollmentService\` (\`enrollStudent\`, \`cancelEnrollment\`, \`checkAvailableQuotas\`) | Pruebas de estrés y condición de carrera concurrentes con k6 (300 VU simultáneos sobre el último cupo) para verificar cero sobrecupos. |
| **RF-08. Registro de calificaciones**<br>Docente registra y actualiza notas en sus grupos. | • **RNF-01 (Seguridad):** Aislamiento estricto docente-grupo.<br>• **RNF-02 (Rendimiento):** Bulk-Upsert SQL en < 300ms.<br>• **RNF-03 (Disponibilidad):** Transacciones aisladas por grupo.<br>• **RNF-04 (Escalabilidad):** Recalculo asíncrono de medias.<br>• **RNF-05 (Mantenibilidad):** Servicio GradeCalculator puro. | **Módulo de Calificaciones**<br>*(Core Domain)* | **Esquema:** \`calificaciones\` (\`calificacion\`, \`evaluacion\`, \`acta\`)<br>**Interfaces:** \`IGradingService\` (\`submitGrades\`, \`getGroupRosterWithGrades\`, \`closeGradingPeriod\`) | Pruebas unitarias de cálculo ponderado al 100% de cobertura y pruebas de integración transaccional con auditoría cruzada. |

---

#### B. Identificación de 3 Riesgos Técnicos o Puntos Únicos de Falla (SPOF) y Mitigaciones

##### 1. SPOF-01: Punto Único de Falla y Saturación de Conexiones en el Nodo Primario de PostgreSQL
- **Componente Afectado:** PostgreSQL Relacional Centralizado (Master Node).
- **Categoría & Severidad:** Base de Datos & Persistencia | Severidad Crítica.
- **Escenario de Falla:** Al centralizar todos los módulos en una única base de datos compartida, un fallo de hardware en el nodo primario o el agotamiento del pool de conexiones ante 300 usuarios concurrentes paraliza simultáneamente la autenticación, las matrículas y el registro de calificaciones.
- **Impacto en SLA (RNF-03) y Rendimiento (RNF-02):** Ruptura total del SLA del 99.5% de disponibilidad (máx. 3.65h al mes) e incremento de tiempos de respuesta por encima del umbral de 3.0s debido al encolamiento de conexiones.
- **Estrategias de Mitigación Arquitectónica (3 Tácticas):**
  1. *Topología Multi-AZ con Failover Síncrono Automático:* Desplegar la base de datos en configuración Multi-AZ (ej. AWS RDS / Cloud SQL) con réplica Standby síncrona en una segunda zona de disponibilidad. En caso de caída del maestro, el DNS conmuta automáticamente en < 60 segundos con RPO=0 (cero pérdida de datos).
  2. *Multiplexación de Conexiones mediante PgBouncer:* Interponer PgBouncer en modo transaccional (\`pool_mode = transaction\`) entre las réplicas backend y PostgreSQL. Esto permite atender 300 hilos concurrentes consumiendo únicamente entre 80 y 100 conexiones reales al motor, protegiendo la memoria RAM del servidor.
  3. *Segregación de Consultas a Réplica de Sólo Lectura (Read Replica):* Derivar todo el tráfico de reportes consolidados (RF-10) y consultas de expediente (RF-09) hacia la réplica de lectura, blindando el nodo primario para escrituras críticas.
- **Mecanismo de Verificación:** Pruebas de Chaos Engineering forzando un reinicio (*kill -9*) del nodo primario durante una prueba de carga k6 a 300 usuarios, comprobando conmutación en < 60s y cero registros huérfanos.

##### 2. SPOF-02: Contención Extrema por Bloqueos de Fila (Lock Contention) en Grupos de Alta Demanda en Matrícula
- **Componente Afectado:** Fila bloqueada en \`academico.grupo\` mediante \`SELECT ... FOR UPDATE\`.
- **Categoría & Severidad:** Concurrencia Crítica & Consistencia | Severidad Alta.
- **Escenario de Falla:** En el momento de apertura de inscripciones, si 150 estudiantes intentan matricular simultáneamente el mismo grupo popular con cupo limitado, las transacciones intentan adquirir el candado exclusivo de fila. Esto genera una cola profunda de transacciones bloqueadas (*Lock Queue*), reteniendo workers HTTP y pudiendo disparar timeouts superiores a los 3.0 segundos permitidos.
- **Impacto en Rendimiento (RNF-02) y Consistencia (RNF-07):** Riesgo de superar los 3.0s de latencia en el percentil p95 y posible saturación del Event Loop en los servidores de aplicación.
- **Estrategias de Mitigación Arquitectónica (3 Tácticas):**
  1. *Transacciones Transaccionales Ultracortas (< 35ms):* Validar la elegibilidad del estudiante (estado activo, prerrequisitos, programa) en memoria de la aplicación ANTES de iniciar la transacción de base de datos. El bloqueo \`FOR UPDATE\` se retiene únicamente durante 10 a 25ms para evaluar \`cupo_disponible\` y decrementar.
  2. *Timeout de Bloqueo Estricto (\`lock_timeout = 2s\`):* Configurar \`SET LOCAL lock_timeout = '2s';\` en PostgreSQL. Si una transacción no obtiene el candado en 2 segundos debido a saturación, la transacción se aborta limpiamente devolviendo \`HTTP 409 Conflict\` estructurado (*"Alta demanda en el grupo, reintentando..."*), impidiendo que el hilo se quede colgado.
  3. *Ventanas Escalonadas de Matrícula (Staggered Cohorts):* Apertura segmentada por franjas horarias basadas en semestre o promedio académico (ej. 75 estudiantes por franja), distribuyendo el pico de concurrencia a lo largo de la jornada.
- **Mecanismo de Verificación:** Prueba de condición de carrera con k6 inyectando 300 peticiones simultáneas sobre un único grupo con 5 cupos; verificar que 5 solicitudes concluyan exitosas (\`HTTP 201\`), 295 en conflicto controlado (\`HTTP 409\`), y cero tiempos de respuesta superiores a 2.5s.

##### 3. SPOF-03: Avalancha por Falla o Caída de la Capa de Caché (Redis Cache Stampede & Thundering Herd)
- **Componente Afectado:** Redis 7 L2 In-Memory Cache (Clúster de Catálogo y Horarios).
- **Categoría & Severidad:** Caché & Resiliencia | Severidad Alta.
- **Escenario de Falla:** Si la instancia de Redis experimenta un reinicio imprevisto o expiración simultánea de claves en plena inscripción, el 75% del tráfico de consulta que normalmente responde desde memoria en < 15ms impactará de golpe contra PostgreSQL (*Thundering Herd*), saturando el CPU y el disco del motor relacional.
- **Impacto en Rendimiento (RNF-02) y Disponibilidad (RNF-03):** Picos de latencia de hasta 8 segundos, degradando la experiencia de usuario y pudiendo inducir una caída en cascada hacia la persistencia principal.
- **Estrategias de Mitigación Arquitectónica (3 Tácticas):**
  1. *Patrón Cache-Aside con Mutex/Probabilistic Refresh (Early Expiration):* Cuando una clave de catálogo está próxima a expirar, sólo una petición adquiere un candado distribuido para refrescar PostgreSQL, mientras las restantes siguen consumiendo la versión anterior en memoria (*Stale-While-Revalidate*).
  2. *Fallback Resiliente con Circuit Breaker y Caché Local en Memoria de Instancia:* Si Redis no responde en < 100ms, el Circuit Breaker conmuta de inmediato a una pequeña caché LRU en la RAM del contenedor backend (TTL 30s), amortiguando el 80% de las consultas y protegiendo la base de datos relacional.
  3. *Redis Sentinel / Réplica Standby con Failover Automático:* Despliegue de Redis con réplica síncrona y conmutación automática en menos de 5 segundos ante fallos de nodo.
- **Mecanismo de Verificación:** Simulación de caída abrupta de Redis durante una prueba de carga de 300 usuarios con k6; verificación de que el Circuit Breaker mantiene la latencia global < 800ms y la utilización de CPU de PostgreSQL por debajo del 40%.

---

### 11. ARQUITECTURA CLOUD, EVALUACIÓN DE RIESGOS Y PLAN DE MITIGACIÓN OPERATIVO

En calidad de Arquitecto de Software Cloud, se dictamina y formaliza el análisis operacional de las **5 decisiones técnicas de infraestructura** seleccionadas para el SGA concurrente (Monolito Modular con Domain-Driven Design):

#### Decisión 1: Frontend y Backend Unificado con Next.js y TypeScript (Tipado Estricto E2E)
- **Rol Arquitectónico:** Monolito fullstack unificado en monorepo con Next.js 15 (App Router, Server Actions, Route Handlers) y TypeScript 5.5 + Zod 3.
- **Justificación Cloud:** Tipado estricto de extremo a extremo sin desincronización de DTOs de red. Ahorro de $120/mes al consolidar infraestructura y acelerar el desarrollo en un 40%.
- **Riesgos Técnicos:**
  1. *Server-Client Leaks:* Fuga accidental de dependencias de base de datos o secretos en componentes con directiva \`'use client'\`, inflando el bundle o exponiendo variables.
  2. *Saturación por SSR Dinámico:* Competencia de CPU entre renderizado HTML dinámico y transacciones de matrícula/notas en el proceso Node.js ante 300 usuarios concurrentes.
  3. *Acoplamiento de Bounded Contexts:* Importación anárquica entre carpetas de módulos sin respetar interfaces públicas.
- **Plan de Mitigación Operativo:**
  - *Aislamiento con "server-only" y Zod:* Paquete \`server-only\` en todas las capas de persistencia y servicios de dominio. Validación Zod bidireccional en tiempo de compilación y ejecución.
  - *Estrategia Híbrida (ISR + Client-Side Fetching):* Pre-renderizado estático (ISR) de catálogo y oferta de asignaturas; Client-Side Data Fetching con React Query para paneles autenticados, manteniendo el uso de CPU de Node.js < 25%.
  - *Arquitectura Hexagonal Interna:* Módulos estructurados con \`public-api.ts\` y linters de fronteras (\`eslint-plugin-boundaries\`).
  - *SLO & Observabilidad:* Instrumentación OpenTelemetry; TTFB p95 < 400ms y LCP < 1.8s.

#### Decisión 2: Despliegue en Contenedores Administrados (Railway o Render)
- **Rol Arquitectónico:** Plataforma PaaS de contenedores OCI (Docker) con ejecución persistente de Node.js 22 LTS, eliminando las restricciones de tiempo de ejecución de Serverless.
- **Justificación Cloud:** Soporta la generación de reportes masivos en PDF (actas, boletines de 500 alumnos) y exportaciones CSV pesadas sin los timeouts de 10s-60s de AWS Lambda o Vercel. Mantiene pools de conexión calientes hacia PostgreSQL.
- **Riesgos Técnicos:**
  1. *Bloqueo del Event Loop de Node.js:* Generación síncrona de PDFs en el hilo principal congela la atención de los otros 300 usuarios.
  2. *Saturación de RAM (Out-Of-Memory - OOM):* Renderizado de reportes pesados consume más de 2GB de memoria, forzando reinicios del contenedor en horas de alta demanda.
  3. *Downtime en Instancia Única:* Mantenimientos de proveedor en instancia única causan caídas de 2 a 5 minutos, violando el SLA del 99.5%.
- **Plan de Mitigación Operativo:**
  - *Desacoplamiento Web vs Worker:* 2 réplicas del contenedor Web para tráfico interactivo HTTP + 1 contenedor Worker Service independiente dedicado a procesar colas BullMQ/Redis (Puppeteer/@react-pdf).
  - *Multi-Instancia con Health Checks:* 2 réplicas mínimas tras el balanceador interno con comprobaciones periódicas en \`/api/healthz\` (conmutación en < 2s ante fallo).
  - *Límites y Alertas OOM:* \`--max-old-space-size=1536\` y alarmas automáticas al alcanzar el 75% de RAM por más de 3 minutos.
  - *Runbook de Escalamiento Vertical:* Procedimiento de escala inmediata a 4GB/8GB en 1 clic (< 90 segundos) durante apertura de inscripciones.

#### Decisión 3: Base de Datos PostgreSQL con Drizzle ORM (Máxima Velocidad & Tipado SQL Nativo)
- **Rol Arquitectónico:** Persistencia relacional transaccional ACID con acceso tipado sin overhead de abstracción intermediaria.
- **Justificación Cloud:** Drizzle compila directamente a SQL nativo sin binarios Rust intermediarios (+50MB de ahorro de RAM frente a Prisma). Permite transacciones pesimistas \`SELECT ... FOR UPDATE\` nativas para matrícula atómica.
- **Riesgos Técnicos:**
  1. *Connection Starvation:* Conexiones directas desde múltiples contenedores saturan el \`max_connections\` de PostgreSQL con 300 concurrentes.
  2. *Migraciones Bloqueantes:* Comandos de alteración de tablas en producción generan un \`ACCESS EXCLUSIVE LOCK\` en tablas críticas (\`academico.grupo\`).
  3. *Seq Scans en Búsquedas:* Búsquedas de alumnos o calificaciones sin índices compuestos disparan el CPU al 100%.
- **Plan de Mitigación Operativo:**
  - *PgBouncer en Modo Transaccional:* Pooler \`pool_mode = transaction\` limitando a 15 conexiones por contenedor, atendiendo 300 concurrentes con menos de 40 conexiones reales al motor.
  - *Pipeline de Migraciones Seguras:* Prohibir \`drizzle-kit push\` en producción. Migraciones revisadas en Pull Request y aplicadas con \`CREATE INDEX CONCURRENTLY\` y \`lock_timeout = '2s'\`.
  - *SLO & Query Tracker:* Rastrear consultas con \`pg_stat_statements\`; p95 de transacción de matrícula < 35ms.
  - *Runbook de Bloqueos:* Detección y terminación automática de conexiones \`idle in transaction\` > 10s con \`pg_terminate_backend()\`.

#### Decisión 4: Delegación de Autenticación y RBAC a Auth0 (Cumplimiento Normativo Estricto)
- **Rol Arquitectónico:** Proveedor de identidad (IdP) empresarial de grado bancario (OIDC / OAuth 2.0 / RS256 JWT / Universal Login).
- **Justificación Cloud:** Cumplimiento normativo estricto (SOC 2, GDPR, ISO 27001) sin almacenar hashes de contraseñas localmente. Protección nativa contra ataques de fuerza bruta y MFA para administradores y docentes.
- **Riesgos Técnicos:**
  1. *Latencia Externa:* Consultar \`/userinfo\` en Auth0 en cada request suma 80-200ms de latencia de red.
  2. *Desincronización de Estado:* Un estudiante desactivado en el SGA local podría seguir usando su token de Auth0 hasta la expiración.
  3. *Escalabilidad de Costos MAU:* Superar el tier gratuito de 7,500 MAU durante periodos de inscripción masiva.
- **Plan de Mitigación Operativo:**
  - *Validación Stateless Local:* Descarga y caché en memoria RAM de las claves públicas JWKS de Auth0. Verificación criptográfica local en sub-milisegundo (< 0.5ms) sin llamadas de red a Auth0.
  - *Custom Claims & Validación de Estado Local:* Auth0 Post-Login Action inyecta roles y \`usuario_id\` en el token. El Módulo de Matrícula valida en su transacción el estado \`estado_academico = Activo\` en PostgreSQL, neutralizando tokens huérfanos.
  - *Webhooks Bidireccionales:* Sincronización en tiempo real vía Webhooks firmados con HMAC-SHA256 para eventos de usuario.
  - *Resiliencia de Sesión:* Los tokens emitidos son autónomos y válidos por 60 min, blindando al SGA ante caídas transitorias del portal de Auth0.

#### Decisión 5: Almacenamiento de Archivos Masivos en Cloudflare R2 ($0 Costos de Egress)
- **Rol Arquitectónico:** Almacenamiento de objetos masivo compatible con AWS S3 API para fotos de carné, actas oficiales, soportes de matrícula y boletines.
- **Justificación Cloud:** Cloudflare R2 cobra **$0.00 USD en tarifas de transferencia de salida (Zero Egress)** frente a los $0.09/GB de AWS S3. Ahorro del 100% en ancho de banda al descargar miles de boletines y fotos.
- **Riesgos Técnicos:**
  1. *Fuga de Privacidad:* Buckets configurados erróneamente con acceso público exponen actas o documentos personales (violando RNF-11).
  2. *Cuello de Botella Proxy en Backend:* Subir o descargar archivos pasando a través del servidor Next.js satura la RAM y el ancho de banda del contenedor.
  3. *Archivos Huérfanos:* Archivos subidos que se cancelan en el formulario y quedan sin referencia en base de datos.
- **Plan de Mitigación Operativo:**
  - *URLs Prefirmadas (Presigned URLs):* Subida y descarga directa entre navegador y Cloudflare R2 con URLs temporales (expiración a 5 min y validación de Content-Type/Size). Cero consumo de ancho de banda y RAM en el servidor Next.js.
  - *Bucket Estrictamente Privado:* Acceso público 100% deshabilitado. La lectura de documentos confidenciales requiere autorización previa del backend antes de emitir la Presigned Download URL.
  - *Reglas de Ciclo de Vida (Lifecycle Rules):* Eliminación automática de archivos en \`/uploads/temp/\` con más de 24 horas sin asociar.
  - *Edge Caching para Fotos Públicas:* Distribución de fotos de perfil autorizadas a través de Cloudflare CDN con caché perimetral (tiempo de carga < 80ms).`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdownReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdownReport], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Dictamen_Arquitectura_SGA_Senior.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c0f17] border border-slate-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Dossier Arquitectónico Completo · Exportación & Dictamen
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Preview */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-xs text-slate-300 leading-relaxed bg-slate-950/80 whitespace-pre-wrap select-text">
          {markdownReport}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 font-mono">
            Formato: Markdown Estructurado / Listo para Comité Académico
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado al Portapapeles' : 'Copiar Texto'}</span>
            </button>

            <button
              onClick={downloadMarkdown}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar .md</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
