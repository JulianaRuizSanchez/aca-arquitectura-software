export interface ArchitectureStyle {
  id: 'modular_monolith' | 'layered' | 'microservices';
  name: string;
  tagline: string;
  verdict: 'RECOMENDADO' | 'DESACONSEJADO' | 'NO RECOMENDADO';
  verdictSummary: string;
  scores: {
    latency: number;
    concurrencyHandling: number;
    availability: number;
    scalability: number;
    transactionIntegrity: number;
    devopsSimplicity: number;
    costEfficiency: number;
    maintainability: number;
  };
  pros: string[];
  cons: string[];
  whyFitsOrFailsFor300Users: string;
  latencyExpectation: string;
  slaAvailabilityFit: string;
  transactionalGuarantee: string;
  devopsOverhead: string;
  costProfile: string;
}

export interface ADR {
  id: string;
  number: string;
  title: string;
  status: 'Aprobado (Definitivo)' | 'Propuesto';
  date: string;
  context: string;
  decisionDrivers: string[];
  consideredOptions: {
    name: string;
    pros: string;
    cons: string;
  }[];
  decision: string;
  consequencesPositive: string[];
  consequencesNegativeOrTradeoffs: string[];
  qualityAttributesImpacted: {
    attribute: string;
    impact: string;
  }[];
  validationTactics: string;
}

export interface FunctionalRequirement {
  id: string;
  code: string;
  name: string;
  module: 'Autenticación & Seguridad' | 'Gestión Académica' | 'Matrículas' | 'Calificaciones' | 'Reportes' | 'Auditoría';
  description: string;
  inputsOutputs: string;
  criticality: 'Alta' | 'Media' | 'Crítica';
  concurrencyRisk: string;
  architecturalTactic: string;
}

export interface NonFunctionalRequirement {
  id: string;
  code: string;
  category: 'Seguridad' | 'Rendimiento' | 'Disponibilidad' | 'Escalabilidad' | 'Mantenibilidad' | 'Usabilidad' | 'Integridad' | 'Interoperabilidad' | 'Respaldo' | 'Trazabilidad' | 'Privacidad' | 'Compatibilidad';
  name: string;
  targetMetric: string;
  contextSGA: string;
  architecturalTactic: string;
  verificationMethod: string;
}

export interface UseCase {
  id: string;
  code: string;
  actor: 'Administrador' | 'Coordinador Académico' | 'Docente' | 'Estudiante';
  name: string;
  summary: string;
  preconditions: string[];
  mainFlow: string[];
  alternativeFlows?: string[];
  postconditions: string[];
  relatedRF: string[];
  relatedRNF: string[];
  moduleInCharge: string;
}

export interface LogicalComponent {
  id: string;
  name: string;
  type: 'Core Domain' | 'Support Domain' | 'Cross-Cutting' | 'Core Domain (Hotspot)';
  summary: string;
  responsibilities: string[];
  providedInterfaces: {
    name: string;
    description: string;
    methods: string[];
  }[];
  consumedInterfaces: {
    module: string;
    interfaceName: string;
    purpose: string;
  }[];
  domainEventsPublished: string[];
  domainEventsSubscribed: string[];
  databaseSchema: string;
  relatedRF: string[];
  relatedRNF: string[];
  tactics: string[];
}

export const ARCHITECTURE_STYLES: ArchitectureStyle[] = [
  {
    id: 'modular_monolith',
    name: 'Monolito Modular (Domain-Driven Bounded Contexts)',
    tagline: 'Máxima cohesión interna, comunicación in-process sin latencia de red y aislamiento estricto de dominios.',
    verdict: 'RECOMENDADO',
    verdictSummary: 'Elección óptima para 300 usuarios concurrentes, SLA 99.5% y respuesta <3s. Ofrece el aislamiento de negocio de microservicios sin su castigo operativo ni latencia de red.',
    scores: {
      latency: 9.8,
      concurrencyHandling: 9.5,
      availability: 9.2,
      scalability: 8.8,
      transactionIntegrity: 10.0,
      devopsSimplicity: 9.5,
      costEfficiency: 9.6,
      maintainability: 9.2,
    },
    pros: [
      'Llamadas entre módulos en memoria (In-Process Calls, <1ms), eliminando por completo la sobrecarga de serialización HTTP/gRPC.',
      'Transacciones ACID locales para matrículas concurrentes: control atómico de cupos sin requerir Sagas distribuidas ni Two-Phase Commit.',
      'Límites estrictos de contexto (Bounded Contexts) que impiden el código espagueti y permiten extraer módulos a microservicios a futuro si el tráfico se multiplica por 100.',
      'Despliegue atómico simplificado: 2 contenedores en réplica activa tras un ALB cumplen holgadamente el 99.5% de disponibilidad a un costo mínimo.',
      'Monitoreo y observabilidad centralizados en un único proceso sin necesidad de tracing distribuido complejo.',
    ],
    cons: [
      'Requiere disciplina del equipo de desarrollo para no saltarse las interfaces públicas entre módulos (se mitiga con linters de arquitectura tipo ArchUnit o boundaries en TypeScript/ESLint).',
      'El escalado horizontal replica todo el artefacto (aunque con 300 concurrentes, 2 instancias consumen menos de 2 vCPU y 4GB RAM en total).',
    ],
    whyFitsOrFailsFor300Users: '300 usuarios concurrentes generan ~30-90 req/s. Un solo hilo optimizado en Node/Java/Go despacha más de 1,500 req/s en memoria. Dos instancias redundantes soportan holgadamente este pico con latencia p95 < 250ms.',
    latencyExpectation: 'p95: 120ms - 350ms (muy por debajo del umbral exigido de 3.0s).',
    slaAvailabilityFit: '99.5% alcanzado con 2 réplicas + rolling deployment sin downtime y failover automático en la base de datos.',
    transactionalGuarantee: 'ACID nativo (SERIALIZABLE / REPEATABLE READ) en PostgreSQL. Cero sobrecupos garantizados.',
    devopsOverhead: 'Bajo. Un pipeline CI/CD único, un clúster ligero de contenedores o App Service/Cloud Run.',
    costProfile: 'Económico y altamente eficiente (~$60 - $180 USD/mes en infraestructura cloud).',
  },
  {
    id: 'layered',
    name: 'Arquitectura Tradicional en Capas (N-Tier / Capa de Datos-Negocio-Presentación)',
    tagline: 'Separación técnica horizontal clásica (Controladores -> Servicios -> Repositorios).',
    verdict: 'DESACONSEJADO',
    verdictSummary: 'Suficiente para soportar el rendimiento de 300 usuarios, pero propensa a la degradación por acoplamiento cruzado y "Big Ball of Mud" entre dominios complejos (Matrículas vs Calificaciones).',
    scores: {
      latency: 9.0,
      concurrencyHandling: 8.5,
      availability: 8.8,
      scalability: 7.0,
      transactionIntegrity: 9.5,
      devopsSimplicity: 9.0,
      costEfficiency: 9.2,
      maintainability: 5.2,
    },
    pros: [
      'Facilidad de comprensión inicial para desarrolladores junior con poca experiencia en Domain-Driven Design.',
      'Comparte el despliegue simple y las transacciones ACID locales de un monolito.',
      'Herramientas y frameworks estándar en el mercado con soporte nativo out-of-the-box.',
    ],
    cons: [
      'Acoplamiento anárquico: los servicios de Matrícula terminan importando y mutando entidades de Docentes, Estudiantes y Calificaciones sin contratos claros.',
      'Evolución traumática: a medida que el SGA crece en reglas, cualquier cambio rompe lógica no relacionada.',
      'Dificultad severa si en el futuro se requiere desacoplar el portal estudiantil del sistema administrativo.',
    ],
    whyFitsOrFailsFor300Users: 'Cumple el RNF de 300 usuarios y latencia en el corto plazo, pero fracasa a nivel de mantenibilidad y escalabilidad arquitectónica a mediano plazo debido a la falta de fronteras de dominio.',
    latencyExpectation: 'p95: 200ms - 600ms en el año 1; se degrada conforme proliferan consultas SQL no optimizadas entre capas.',
    slaAvailabilityFit: 'Alcanzable (99.5%), pero mayor riesgo de caídas por regresiones de código cruzado en despliegues.',
    transactionalGuarantee: 'ACID local, pero con riesgo de locks de base de datos prolongados por servicios sobrecargados.',
    devopsOverhead: 'Bajo a nivel operativo, pero alto en deuda técnica de pruebas de regresión.',
    costProfile: 'Bajo inicial, pero con elevado coste de mantenimiento y refactorización a los 18 meses.',
  },
  {
    id: 'microservices',
    name: 'Microservicios Distribuidos (Polyglot Independent Services)',
    tagline: 'Descomposición distribuida con bases de datos independientes por servicio y mensajería asíncrona.',
    verdict: 'NO RECOMENDADO',
    verdictSummary: 'Sobreingeniería extrema para 300 usuarios concurrentes. Introduce latencia de red, consistencia eventual en matrículas, necesidad de Sagas y un costo operativo 4x superior.',
    scores: {
      latency: 5.5,
      concurrencyHandling: 8.0,
      availability: 6.8,
      scalability: 9.8,
      transactionIntegrity: 4.5,
      devopsSimplicity: 3.0,
      costEfficiency: 4.0,
      maintainability: 5.8,
    },
    pros: [
      'Escalado independiente del servicio de Matrícula durante las semanas críticas de inicio de semestre.',
      'Aislamiento de fallos a nivel de proceso (la caída de Calificaciones no afectaría el portal de Estudiantes).',
      'Despliegues autónomos por equipos grandes y desacoplados (50+ desarrolladores).',
    ],
    cons: [
      'Sobrecarga masiva de latencia: la validación de una matrícula requiere llamadas HTTP a Estudiantes, Malla Curricular, Cupos y Financiero (saltos de red que amenazan el límite de <3s).',
      'Complejidad transaccional: no existe transacción ACID atómica; requiere patrones Saga / Two-Phase Commit con compensaciones propensas a errores en cupos.',
      'Costo y carga operativa desproporcionada: requiere API Gateway, Service Mesh, Kafka/RabbitMQ, Distributed Tracing (Jaeger), Kubernetes y monitoreo avanzado.',
      'Para un sistema universitario con 300 usuarios concurrentes, el 80% del presupuesto se gastaría en orquestación en vez de funcionalidad académica.',
    ],
    whyFitsOrFailsFor300Users: 'Antipatrón de premature optimization. 300 usuarios concurrentes no justifican el abismo de complejidad de un sistema distribuido.',
    latencyExpectation: 'p95: 800ms - 2,800ms debido a la cascada de llamadas de red inter-servicios y serialización.',
    slaAvailabilityFit: 'El 99.5% se vuelve difícil de garantizar si cada microservicio tiene 99.9% de uptime (disponibilidad compuesta decreciente: 0.999^5 = 99.5%).',
    transactionalGuarantee: 'Consistencia eventual. Alto riesgo de condiciones de carrera y sobrecupos durante matrículas masivas.',
    devopsOverhead: 'Crítico. Requiere ingenieros DevOps dedicados, Kubernetes (EKS/GKE), orquestación de contratos y observabilidad distribuida.',
    costProfile: 'Elevado ($450 - $1,200+ USD/mes en clústeres, gateways, colas y almacenamiento distribuido).',
  },
];

export const ARCHITECTURAL_DECISIONS: ADR[] = [
  {
    id: 'adr-01',
    number: 'ADR-001',
    title: 'Adopción del Monolito Modular con Bounded Contexts y Arquitectura Hexagonal',
    status: 'Aprobado (Definitivo)',
    date: '2026-11-02',
    context: `El SGA requiere centralizar 4 dominios esenciales: Estudiantes, Docentes, Matrículas y Calificaciones, complementados con Gestión Académica, Reportes y Auditoría. La carga máxima proyectada es de 300 usuarios concurrentes con una respuesta exigida < 3 segundos y disponibilidad del 99.5%. El equipo de ingeniería requiere alta velocidad de entrega sin incurrir en la sobrecarga de mantenimiento de sistemas distribuidos, pero garantizando que el sistema no se convierta en un monolito acoplado inmanejable.`,
    decisionDrivers: [
      'Concurrencia moderada (300 usuarios simultáneos = ~30 a 90 transacciones/segundo).',
      'Requisito no funcional de latencia estricta (< 3s, con objetivo de diseño < 500ms).',
      'Integridad transaccional crítica en la asignación simultánea de cupos de matrícula (RNF-07).',
      'SLA de 99.5% mensual (máximo 3.65 horas de indisponibilidad mensual acumulada).',
      'Optimización del Costo Total de Propiedad (TCO) y simplicidad del pipeline CI/CD.',
    ],
    consideredOptions: [
      {
        name: 'Opción A: Microservicios Distribuidos',
        pros: 'Escalado independiente del módulo de matrícula.',
        cons: 'Latencia por llamadas HTTP inter-servicio, necesidad de Sagas para transacciones de matrícula, costo de infraestructura 4x y alta complejidad operativa innecesaria para 300 usuarios.',
      },
      {
        name: 'Opción B: Arquitectura Tradicional en Capas (N-Tier)',
        pros: 'Rápido desarrollo inicial, curvas de aprendizaje planas.',
        cons: 'Ausencia de fronteras de dominio. A los pocos meses, la capa de servicios se interconecta caóticamente provocando el antipatrón "Big Ball of Mud".',
      },
      {
        name: 'Opción C: Monolito Modular con Bounded Contexts (Elegida)',
        pros: 'Aislamiento de dominios mediante módulos con interfaces explícitas y eventos de dominio en memoria. Llamadas ultra-rápidas en proceso (<1ms), transacciones ACID locales y bajo costo operativo.',
        cons: 'Exige gobernanza arquitectónica y validación de reglas de empaquetado para evitar dependencias circulares entre módulos.',
      },
    ],
    decision: `Se adopta el patrón de **Monolito Modular** estructurado en Bounded Contexts alineados con Domain-Driven Design (DDD):
1. **Módulo de Autenticación & Control de Acceso (RBAC)**: Manejo de sesiones, tokens y verificación de permisos.
2. **Módulo de Gestión Académica**: Administración de Estudiantes, Docentes, Programas, Planes de Estudio, Asignaturas, Periodos y Grupos.
3. **Módulo de Matrículas**: Oferta académica, motor de cupos, validación de duplicados y control de concurrencia.
4. **Módulo de Calificaciones**: Captura de notas, promedios ponderados, cierre de actas y consulta de resultados.
5. **Módulo de Reportes & Consultas**: Generación de consolidados con filtros por periodo y programa.
6. **Módulo de Auditoría**: Bitácora inmutable de eventos críticos (inicios de sesión, cambios de roles, matrículas y notas).

Cada módulo encapsula su propio dominio, puertos y adaptadores (Arquitectura Hexagonal). La comunicación síncrona entre módulos se realiza exclusivamente a través de interfaces de servicio tipadas (Facade/Contract) y la comunicación desacoplada a través de un Bus de Eventos de Dominio en memoria.`,
    consequencesPositive: [
      'Latencia de comunicación inter-modular prácticamente nula (<1ms vs 30-80ms en microservicios).',
      'Garantía de transacciones ACID en el mismo hilo de ejecución para el cierre de matrículas.',
      'Pipeline de integración y despliegue unificado (CI/CD simple, una sola imagen de contenedor).',
      'Camino evolutivo garantizado: si en 3 años la matrícula pasa a 30,000 usuarios concurrentes, el módulo de Matrículas puede desacoplarse a un microservicio independiente sin reescribir la lógica de dominio.',
    ],
    consequencesNegativeOrTradeoffs: [
      'Todo el sistema se despliega como una única unidad ejecutable; un fallo no controlado de memoria a nivel de runtime afectaría temporalmente a los demás módulos (se mitiga con límites de recursos por proceso, clusterización y health checks).',
      'Requiere linters y tests de arquitectura automatizados en CI para vetar importaciones directas no autorizadas entre módulos.',
    ],
    qualityAttributesImpacted: [
      { attribute: 'Rendimiento (RNF-02)', impact: 'Llamadas in-memory aseguran respuesta < 300ms (holgadamente < 3s).' },
      { attribute: 'Mantenibilidad (RNF-05)', impact: 'Bajo acoplamiento y alta cohesión por módulos autónomos.' },
      { attribute: 'Disponibilidad (RNF-03)', impact: '99.5% con réplicas gemelas y rolling updates.' },
    ],
    validationTactics: 'Pruebas de carga con k6 simulando 300 usuarios concurrentes ejecutando flujos completos de consulta y matrícula; verificación de contratos con tests unitarios y reglas de linting de límites de módulo.',
  },
  {
    id: 'adr-02',
    number: 'ADR-002',
    title: 'Estrategia de Persistencia y Concurrencia Crítica en Matrículas: PostgreSQL ACID + Row-Level Locking y Connection Pooling',
    status: 'Aprobado (Definitivo)',
    date: '2026-11-02',
    context: `Durante las ventanas de matrícula, los 300 usuarios concurrentes compiten simultáneamente por secciones con cupos limitados. Si dos o más estudiantes intentan tomar el último cupo en la misma milésima de segundo, existe un grave riesgo de condición de carrera ("Lost Update") que resulte en sobrecupo o matrículas duplicadas.`,
    decisionDrivers: [
      'Garantía estricta de CERO sobrecupos y prevención de matrículas duplicadas (RF-07, RNF-07).',
      'Tiempo de respuesta de asignación de cupo < 1.0s para evitar timeout de usuario.',
      'Evitar el sobrecosto de bloqueos distribuidos (Distributed Locks via Redlock / Zookeeper).',
      'Aislamiento de esquemas o tablas por módulo para preservar la modularidad del monolito.',
    ],
    consideredOptions: [
      {
        name: 'Bloqueo Optimista (Optimistic Concurrency Control con Column Version)',
        pros: 'No bloquea filas, lecturas concurrentes muy veloces.',
        cons: 'Bajo alta contención (últimos 3 cupos), genera una tasa masiva de excepciones OptimisticLockException y reintentos fallidos.',
      },
      {
        name: 'Bloqueo Pesimista en Base de Datos (SELECT ... FOR UPDATE en PostgreSQL) + PgBouncer',
        pros: 'Garantiza atomicidad absoluta y orden de llegada determinista. La transacción que toma el cupo decrementa la capacidad de forma serializada sin sobrecupos.',
        cons: 'Retiene la conexión durante la duración de la transacción (requiere transacciones breves < 50ms).',
      },
      {
        name: 'Bases de Datos Separadas por Microservicio con Sagas / Outbox',
        pros: 'Independencia total de persistencia.',
        cons: 'La compensación de cupos en caso de fallo inter-servicio genera estados inconsistentes temporales y gran complejidad para 300 usuarios.',
      },
    ],
    decision: `Se selecciona **PostgreSQL Relacional** con:
1. **Control de Concurrencia de Cupos**: Uso de **Bloqueo Pesimista a nivel de fila** (\`SELECT cupo_disponible FROM grupo WHERE id = :id FOR UPDATE\`) y validación de restricción única (\`UNIQUE(estudiante_id, grupo_id, periodo_id)\`) para impedir duplicados.
2. **Esquema Modular**: Esquemas lógicos separados dentro de la misma base de datos (\`auth.*, academico.*, matricula.*, calificaciones.*, auditoria.*\`).
3. **Pool de Conexiones**: Implementación de **PgBouncer** en modo transaction pooling con hasta 100 conexiones activas simultáneas reutilizadas eficientemente por los 300 usuarios concurrentes.`,
    consequencesPositive: [
      'Eliminación total del riesgo de sobrecupos y condiciones de carrera sin necesidad de orquestadores externos.',
      'Rendimiento sostenido de hasta 800 transacciones de reserva por segundo en PostgreSQL estándar con transacciones sub-20ms.',
      'Copias de seguridad transaccionales consistentes (Point-in-Time Recovery unificado).',
    ],
    consequencesNegativeOrTradeoffs: [
      'Las consultas de reserva deben mantenerse estrictamente acotadas (sin operaciones I/O externas dentro del bloque transaccional).',
      'Disciplina en el equipo para no cruzar JOINs SQL directos entre tablas de diferentes módulos.',
    ],
    qualityAttributesImpacted: [
      { attribute: 'Integridad y Consistencia (RNF-07)', impact: '100% de consistencia ACID. Cero inconsistencias en cupos y notas.' },
      { attribute: 'Rendimiento (RNF-02)', impact: 'Transacciones de reserva ejecutadas en < 30ms en la BD.' },
      { attribute: 'Disponibilidad (RNF-03)', impact: 'Failover automatizado multi-AZ con RTO < 60s.' },
    ],
    validationTactics: 'Ejecución de un test de estrés de concurrencia simulando 300 peticiones simultáneas sobre una sección con únicamente 5 cupos disponibles; verificar que exactamente 5 usuarios queden matriculados y 295 reciban rechazo controlado en < 500ms.',
  },
  {
    id: 'adr-03',
    number: 'ADR-003',
    title: 'Estrategia de Caching Distribuido y Desacoplamiento Asíncrono: Redis L2 + Worker Queue para Reportes y Notificaciones',
    status: 'Aprobado (Definitivo)',
    date: '2026-11-02',
    context: `Durante las semanas de matrícula y publicación de calificaciones, más del 75% del tráfico corresponde a lecturas repetitivas: programas, asignaturas, horarios de grupos y consulta de resultados. Simultáneamente, la generación de reportes consolidados (RF-10) y el registro de auditoría (RF-12) no deben degradar el tiempo de respuesta interactivo.`,
    decisionDrivers: [
      'Garantizar tiempo de respuesta < 3 segundos incluso en picos de consulta masiva.',
      'Descargar a la base de datos PostgreSQL de lecturas estáticas/semi-estáticas.',
      'Aislar la generación de reportes pesados y eventos de auditoría del ciclo de petición HTTP del usuario.',
    ],
    consideredOptions: [
      {
        name: 'Sin Caché (Todas las consultas a PostgreSQL)',
        pros: 'Arquitectura más simple.',
        cons: 'Peligro de saturación del pool de conexiones de la base de datos bajo ráfagas de 300 usuarios consultando la misma oferta de cursos.',
      },
      {
        name: 'Caché en Memoria Local del Proceso',
        pros: 'Acceso inmediato sin latencia de red.',
        cons: 'Inconsistencias al tener 2 o más instancias del monolito (una instancia invalida la caché y la otra sigue sirviendo datos viejos).',
      },
      {
        name: 'Redis Centralizado (Caché L2 + Cola de Tareas Asíncronas BullMQ)',
        pros: 'Caché compartida coherente, invalidación reactiva basada en eventos de dominio, y cola integrada para procesar reportes y auditoría en background.',
        cons: 'Introduce una dependencia de infraestructura adicional (fácilmente gestionada en cloud).',
      },
    ],
    decision: `Se adopta **Redis** como componente de soporte híbrido para dos propósitos clave:
1. **Caché de Segundo Nivel (Cache-Aside Pattern)**: Almacenamiento con TTL de programas, asignaturas, grupos y docentes. Invalidación reactiva cuando un coordinador edita la oferta.
2. **Cola de Tareas Asíncronas (Background Workers)**: Generación de reportes académicos consolidados (RF-10) y persistencia diferida de bitácoras de auditoría masivas (RF-12) para liberar la respuesta HTTP en menos de 100ms.`,
    consequencesPositive: [
      'Reducción de hasta un 70% en la carga de lectura de la base de datos relacional durante picos.',
      'Tiempo de respuesta para consulta de cursos y horarios rebajado a < 15ms desde caché.',
      'Generación de reportes sin impacto en el rendimiento de los 300 usuarios concurrentes.',
    ],
    consequencesNegativeOrTradeoffs: [
      'Requiere un nodo o clúster de Redis gestionado.',
      'Debe gestionarse cuidadosamente la invalidación de caché ante modificaciones del catálogo.',
    ],
    qualityAttributesImpacted: [
      { attribute: 'Rendimiento y Tiempo de Respuesta (RNF-02)', impact: 'Consultas de catálogo en < 20ms; transacciones pesadas desacopladas.' },
      { attribute: 'Escalabilidad (RNF-04)', impact: 'Capacidad de absorber incrementos de tráfico de lectura sin escalar la BD.' },
    ],
    validationTactics: 'Medición de la tasa de acierto de caché (Cache Hit Ratio > 85%) y benchmarking de tiempo de respuesta antes y después de Redis bajo 300 peticiones concurrentes.',
  },
  {
    id: 'adr-04',
    number: 'ADR-004',
    title: 'Topología de Despliegue y Alta Disponibilidad: Contenedores Multi-Instancia, ALB y Health Checks (SLA 99.5%)',
    status: 'Aprobado (Definitivo)',
    date: '2026-11-02',
    context: `El RNF de disponibilidad exige un SLA mensual objetivo de al menos 99.5% (máximo 3.65 horas de indisponibilidad mensual acumulada). El sistema debe ser capaz de absorber mantenimientos preventivos y actualizaciones de software sin interrumpir las sesiones activas de estudiantes y docentes en periodo regular.`,
    decisionDrivers: [
      'Cumplimiento estricto del SLA de 99.5% de disponibilidad (RNF-03).',
      'Tolerancia a fallos: la caída accidental de un contenedor no debe dejar el servicio fuera de línea.',
      'Despliegues continuos sin tiempo de inactividad (Zero-Downtime Rolling Deployments).',
    ],
    consideredOptions: [
      {
        name: 'Servidor Único Virtual (Monolito en VM Standalone)',
        pros: 'Costo muy bajo.',
        cons: 'Punto único de fallo (SPOF). Cada reinicio o actualización genera downtime y no cumple el SLA.',
      },
      {
        name: 'Clúster Complejo de Kubernetes Multi-Región',
        pros: 'Orquestación total y autorrecuperación.',
        cons: 'Costo y complejidad desmedidos para un monolito modular con 300 usuarios concurrentes.',
      },
      {
        name: 'Topología Dual-Contenedor tras Balanceador (ALB / Cloud Run) con DB Multi-AZ',
        pros: 'Equilibrio perfecto: 2 réplicas activas garantizan 99.9% de uptime teórico, rolling updates sin interrupción, health checks automáticos y mínimo mantenimiento.',
        cons: 'Requiere que las sesiones de usuario sean completamente Stateless (tokens JWT validados criptográficamente).',
      },
    ],
    decision: `Se define la siguiente topología de infraestructura:
1. **Capa Web/API**: Al menos **2 instancias de contenedor** ejecutando el Monolito Modular en paralelo tras un Application Load Balancer con distribución Round-Robin y Health Checks periódicos cada 10 segundos.
2. **Estrategia Stateless**: La aplicación no almacena estado de sesión en memoria local del servidor; la autenticación se gestiona mediante tokens JWT asimétricos con claims RBAC y blacklist en Redis.
3. **Despliegues Rolling / Blue-Green**: Actualizaciones de versión sin indisponibilidad: el balanceador redirige el tráfico a la nueva versión solo tras validar el /healthz exitoso.
4. **Base de Datos Gestionada Multi-AZ**: Instancia primaria con réplica de lectura en espera con conmutación por error (Failover automático en < 60 segundos) y snapshots automatizados diarios.`,
    consequencesPositive: [
      'Uptime proyectado > 99.8% (supera el objetivo del 99.5%).',
      'Capacidad de escalar de 2 a 4 contenedores automáticamente en picos de matrícula en menos de 2 minutos.',
      'Actualizaciones de software a cualquier hora del día sin ventanas de indisponibilidad para los usuarios.',
    ],
    consequencesNegativeOrTradeoffs: [
      'Requiere migraciones de base de datos compatibles hacia atrás (patrón Expand and Contract).',
    ],
    qualityAttributesImpacted: [
      { attribute: 'Disponibilidad (RNF-03)', impact: 'SLA 99.5% garantizado con margen holgado gracias a redundancia N+1.' },
      { attribute: 'Escalabilidad (RNF-04)', impact: 'Escalado elástico de réplicas en base a uso de CPU > 70% o latencia > 1s.' },
      { attribute: 'Respaldo y Recuperación (RNF-09)', impact: 'RTO < 5 minutos para fallos de contenedor; < 60s para conmutación de BD.' },
    ],
    validationTactics: 'Simulación de inyección de fallos: matar intencionalmente uno de los dos contenedores durante una prueba de carga de 300 usuarios y verificar que el balanceador redirija el 100% de las peticiones sin pérdida de transacciones.',
  },
];

export const OFFICIAL_FUNCTIONAL_REQUIREMENTS: FunctionalRequirement[] = [
  {
    id: 'rf-01',
    code: 'RF-01',
    name: 'Autenticación',
    module: 'Autenticación & Seguridad',
    description: 'El sistema debe permitir que los usuarios inicien y cierren sesión mediante credenciales individuales.',
    inputsOutputs: 'Entrada: Correo/usuario institucional y contraseña. Salida: Token de sesión (JWT) con claims de identidad y redirección al portal correspondiente.',
    criticality: 'Crítica',
    concurrencyRisk: 'Medio (pico de login concurrente al inicio de jornada o apertura de matrículas).',
    architecturalTactic: 'Validación en memoria de JWT (Stateless), hashing Argon2id con protección contra fuerza bruta y rate-limiting en proxy.',
  },
  {
    id: 'rf-02',
    code: 'RF-02',
    name: 'Roles y permisos',
    module: 'Autenticación & Seguridad',
    description: 'El sistema debe manejar, como mínimo, los roles de administrador, coordinador académico, docente y estudiante, y restringir las funciones según los permisos asignados.',
    inputsOutputs: 'Entrada: Rol y permisos asociados al usuario. Salida: Menús contextuales y control de acceso (RBAC) a nivel de endpoints y vistas.',
    criticality: 'Crítica',
    concurrencyRisk: 'Bajo en escrituras de roles; alto en verificación continua en cada request HTTP.',
    architecturalTactic: 'Middleware de autorización granular en el monolito que valida claims firmados criptográficamente sin consultar la base de datos.',
  },
  {
    id: 'rf-03',
    code: 'RF-03',
    name: 'Gestión de estudiantes',
    module: 'Gestión Académica',
    description: 'El administrador o personal autorizado debe poder registrar, consultar, actualizar y desactivar registros de estudiantes.',
    inputsOutputs: 'Entrada: Datos personales, documento de identidad, programa asignado, estado (Activo/Inactivo). Salida: Registro persistido y confirmación con ID único.',
    criticality: 'Alta',
    concurrencyRisk: 'Bajo (operación administrativa regular).',
    architecturalTactic: 'Módulo de Gestión Académica con validación de esquemas (Zod) y auditoría automática de cambios de estado.',
  },
  {
    id: 'rf-04',
    code: 'RF-04',
    name: 'Gestión de docentes',
    module: 'Gestión Académica',
    description: 'El personal autorizado debe poder registrar, consultar, actualizar y desactivar registros de docentes.',
    inputsOutputs: 'Entrada: Datos del docente, especialidad académica, vinculación contractual, estado. Salida: Ficha docente actualizada.',
    criticality: 'Alta',
    concurrencyRisk: 'Bajo.',
    architecturalTactic: 'Separación en sub-dominio académico con restricción de unicidad en identificaciones institucionales.',
  },
  {
    id: 'rf-05',
    code: 'RF-05',
    name: 'Programas y asignaturas',
    module: 'Gestión Académica',
    description: 'El sistema debe permitir crear y actualizar programas académicos, planes de estudio y asignaturas, incluyendo código, nombre, créditos y semestre o nivel.',
    inputsOutputs: 'Entrada: Código de materia, denominación, créditos, prerrequisitos, programa. Salida: Malla curricular estructurada.',
    criticality: 'Alta',
    concurrencyRisk: 'Bajo en mutaciones; muy alto en lecturas (consultado masivamente antes de matricular).',
    architecturalTactic: 'Cacheado en Redis con TTL de 24 horas e invalidación reactiva por evento de dominio ante edición curricular.',
  },
  {
    id: 'rf-06',
    code: 'RF-06',
    name: 'Grupos y periodos',
    module: 'Gestión Académica',
    description: 'El sistema debe permitir configurar periodos académicos, grupos, cupos, docentes asignados, horarios y aulas o enlaces de encuentro.',
    inputsOutputs: 'Entrada: Periodo (ej. 2026-1), grupo, cupo máximo (ej. 35), docente, franja horaria, aula/enlace. Salida: Oferta de grupos abierta.',
    criticality: 'Crítica',
    concurrencyRisk: 'Medio durante planeación; base fundamental para el control de cupos de matrícula.',
    architecturalTactic: 'Entidad Grupo con columna de cupo_disponible y restricciones de horario no solapado.',
  },
  {
    id: 'rf-07',
    code: 'RF-07',
    name: 'Matrícula académica',
    module: 'Matrículas',
    description: 'El sistema debe permitir matricular estudiantes en asignaturas o grupos de un periodo, validar cupos y evitar matrículas duplicadas.',
    inputsOutputs: 'Entrada: ID estudiante, lista de grupos seleccionados, periodo. Salida: Comprobante oficial de matrícula con cupos asignados o rechazo con causa.',
    criticality: 'Crítica',
    concurrencyRisk: 'CRÍTICO MÁXIMO: 300 usuarios concurrentes compitiendo por cupos finitos en la misma ventana de tiempo.',
    architecturalTactic: 'Transacción ACID relacional con bloqueo pesimista (FOR UPDATE) y restricción única (estudiante_id, grupo_id, periodo_id).',
  },
  {
    id: 'rf-08',
    code: 'RF-08',
    name: 'Registro de calificaciones',
    module: 'Calificaciones',
    description: 'El docente debe poder registrar y actualizar calificaciones de los estudiantes matriculados en sus grupos, dentro de los permisos asignados.',
    inputsOutputs: 'Entrada: Planilla de estudiantes del grupo, notas por corte porcentual (0.0 a 5.0). Salida: Calificaciones guardadas, promedio calculado y acta actualizada.',
    criticality: 'Crítica',
    concurrencyRisk: 'Alto en fechas de cierre de cortes semestrales (múltiples docentes subiendo notas en bloque).',
    architecturalTactic: 'Validación de permisos de docente asignado al grupo, operaciones bulk-upsert y emisión de evento de auditoría.',
  },
  {
    id: 'rf-09',
    code: 'RF-09',
    name: 'Consulta de resultados',
    module: 'Calificaciones',
    description: 'El estudiante debe poder consultar sus asignaturas matriculadas, horarios y calificaciones publicadas.',
    inputsOutputs: 'Entrada: ID de estudiante autenticado y periodo académico. Salida: Vista detallada de asignaturas, horarios semanales, notas por corte y promedio acumulado.',
    criticality: 'Alta',
    concurrencyRisk: 'Muy alto en lecturas (estudiantes refrescando constantemente durante publicación de notas).',
    architecturalTactic: 'Caché de consultas a nivel de sesión/Redis y réplicas de lectura para desacargar la base de datos principal.',
  },
  {
    id: 'rf-10',
    code: 'RF-10',
    name: 'Reportes',
    module: 'Reportes',
    description: 'El sistema debe generar reportes básicos de estudiantes matriculados, grupos, asignaturas y resultados académicos, con filtros por periodo y programa.',
    inputsOutputs: 'Entrada: Filtros (periodo, programa, asignatura, estado). Salida: Reporte tabular descargable en formatos estándar (CSV/PDF) y visualizable en pantalla.',
    criticality: 'Media',
    concurrencyRisk: 'Riesgo de consumo intensivo de CPU y conexiones si se ejecutan consultas agregadas pesadas en la base de datos principal.',
    architecturalTactic: 'Consultas optimizadas con índices compuestos, paginación obligatoria y procesamiento en Background Worker para descargas pesadas.',
  },
  {
    id: 'rf-11',
    code: 'RF-11',
    name: 'Búsqueda y filtros',
    module: 'Gestión Académica',
    description: 'Los usuarios autorizados deben poder buscar registros y filtrar resultados por identificadores, nombres, programa, periodo o estado, según el módulo.',
    inputsOutputs: 'Entrada: Término de búsqueda o parámetros de filtro. Salida: Lista de registros paginada coincidente.',
    criticality: 'Media',
    concurrencyRisk: 'Medio (consultas frecuentes tipo ILIKE o trigram).',
    architecturalTactic: 'Índices B-Tree y GIN en PostgreSQL para búsqueda eficiente de identificaciones y nombres sin escaneos completos de tabla.',
  },
  {
    id: 'rf-12',
    code: 'RF-12',
    name: 'Auditoría',
    module: 'Auditoría',
    description: 'El sistema debe registrar eventos relevantes, como inicios de sesión, cambios de roles, matrículas y modificaciones de calificaciones, identificando usuario, fecha, acción y registro afectado.',
    inputsOutputs: 'Entrada: Evento de dominio (login, matrícula, cambio de nota, actualización de rol). Salida: Registro inmutable en bitácora de auditoría con timestamp UTC e IP.',
    criticality: 'Crítica',
    concurrencyRisk: 'Alto caudal de inserciones continuas.',
    architecturalTactic: 'Patrón Domain Events con persistencia asíncrona en tabla append-only (sin permisos de UPDATE/DELETE a nivel de rol de BD).',
  },
];

export const OFFICIAL_NON_FUNCTIONAL_REQUIREMENTS: NonFunctionalRequirement[] = [
  {
    id: 'rnf-01',
    code: 'RNF-01',
    category: 'Seguridad',
    name: 'Seguridad y Cifrado',
    targetMetric: 'Canal cifrado HTTPS obligatorio (TLS 1.3), contraseñas con Argon2id/Bcrypt y control de acceso estricto RBAC.',
    contextSGA: 'Protección de accesos no autorizados y confidencialidad de la información académica institucional.',
    architecturalTactic: 'Terminación TLS en el Load Balancer, cookies HttpOnly/Secure, cabeceras CSP/HSTS y middleware RBAC en cada ruta.',
    verificationMethod: 'Escaneo de vulnerabilidades automatizado (OWASP ZAP / Snyk) y pruebas de penetración sobre endpoints de autenticación.',
  },
  {
    id: 'rnf-02',
    code: 'RNF-02',
    category: 'Rendimiento',
    name: 'Rendimiento y Tiempo de Respuesta',
    targetMetric: 'Al menos el 95% de las consultas comunes debe responder en un máximo de 3 segundos con hasta 300 usuarios concurrentes.',
    contextSGA: 'Periodo de inscripción de asignaturas y publicación masiva de notas al final del semestre.',
    architecturalTactic: 'Llamadas in-process entre módulos (<1ms), caché Redis L2 para catálogo de materias, connection pooling PgBouncer e índices SQL.',
    verificationMethod: 'Prueba de carga con k6 durante 20 minutos con 300 Virtual Users (VU) verificando p95 < 1.0s y máx < 3.0s.',
  },
  {
    id: 'rnf-03',
    code: 'RNF-03',
    category: 'Disponibilidad',
    name: 'Disponibilidad Mensual del 99.5%',
    targetMetric: 'Disponibilidad mensual objetivo ≥ 99.5% (máximo 3.65 horas de indisponibilidad no planificada al mes).',
    contextSGA: 'El sistema no puede sufrir caídas durante los días hábiles del calendario académico ni en ventanas de matrícula.',
    architecturalTactic: 'Despliegue dual de contenedores tras ALB con balanceo Round-Robin, health checks automáticos (/healthz) y BD Multi-AZ.',
    verificationMethod: 'Monitoreo de uptime con sondas sintéticas cada 60 segundos y alertas automatizadas ante degradación.',
  },
  {
    id: 'rnf-04',
    code: 'RNF-04',
    category: 'Escalabilidad',
    name: 'Escalabilidad Elástica',
    targetMetric: 'Capacidad de aumentar recursos de cómputo y atender el crecimiento de usuarios y registros sin rediseñar el sistema.',
    contextSGA: 'Crecimiento de la población estudiantil o picos estacionales de matrícula.',
    architecturalTactic: 'Monolito Modular sin estado (Stateless), permitiendo auto-escalado horizontal de 2 a 6 réplicas en minutos.',
    verificationMethod: 'Pruebas de auto-scaling en entorno de pruebas incrementando la carga a 600 usuarios y verificando aprovisionamiento.',
  },
  {
    id: 'rnf-05',
    code: 'RNF-05',
    category: 'Mantenibilidad',
    name: 'Mantenibilidad y Bajo Acoplamiento',
    targetMetric: 'Separación de responsabilidades, bajo acoplamiento y alta cohesión modular.',
    contextSGA: 'Permite corregir o evolucionar el módulo de Calificaciones sin riesgo de introducir fallos colaterales en Matrículas.',
    architecturalTactic: 'Bounded Contexts de DDD con interfaces públicas tipadas y Arquitectura Hexagonal (puertos y adaptadores).',
    verificationMethod: 'Análisis estático de código con linters de límites arquitectónicos (eslint-plugin-boundaries) y cobertura de pruebas unitarias > 80%.',
  },
  {
    id: 'rnf-06',
    code: 'RNF-06',
    category: 'Usabilidad',
    name: 'Usabilidad y Accesibilidad',
    targetMetric: 'Interfaz consistente, adaptable a PC y móviles, etiquetas comprensibles, contraste suficiente y soporte de teclado.',
    contextSGA: 'Acceso por parte de estudiantes y docentes desde computadores de laboratorio y teléfonos inteligentes personales.',
    architecturalTactic: 'Diseño responsive Mobile-First con Tailwind CSS, cumplimiento WCAG 2.1 AA (contraste 4.5:1) y navegación accesible por teclado.',
    verificationMethod: 'Auditoría Lighthouse con puntaje de Accesibilidad > 90 y pruebas funcionales de navegación completa sin mouse.',
  },
  {
    id: 'rnf-07',
    code: 'RNF-07',
    category: 'Integridad',
    name: 'Integridad y Consistencia Transaccional',
    targetMetric: 'Cero sobrecupos y consistencia absoluta de datos ante solicitudes simultáneas o errores en matrículas y calificaciones.',
    contextSGA: '300 estudiantes intentando inscribirse en las mismas asignaturas al mismo segundo.',
    architecturalTactic: 'Transacciones relacionales PostgreSQL ACID con aislamiento REPEATABLE READ / FOR UPDATE y validaciones de reglas en dominio.',
    verificationMethod: 'Pruebas automatizadas de concurrencia inyectando 300 solicitudes concurrentes sobre secciones con 5 cupos disponibles.',
  },
  {
    id: 'rnf-08',
    code: 'RNF-08',
    category: 'Interoperabilidad',
    name: 'Interoperabilidad e Interfaces Documentadas',
    targetMetric: 'Exposición de interfaces documentadas mediante API REST para facilitar futura integración con plataformas institucionales.',
    contextSGA: 'Integración futura con Moodle/Canvas, sistema de pagos en línea, o sistemas del Ministerio de Educación.',
    architecturalTactic: 'Endpoints REST estandarizados con especificación OpenAPI / Swagger 3.0, códigos de estado HTTP semánticos y DTOs versionados.',
    verificationMethod: 'Validación del esquema OpenAPI contra linters Spectral y pruebas de integración contractual.',
  },
  {
    id: 'rnf-09',
    code: 'RNF-09',
    category: 'Respaldo',
    name: 'Respaldo y Recuperación ante Fallos',
    targetMetric: 'Copias de seguridad periódicas automatizadas y procedimiento documentado de restauración ante desastres (RPO < 15m, RTO < 2h).',
    contextSGA: 'Garantizar que una caída física de infraestructura no comprometa las notas de los estudiantes ni las matrículas pagadas.',
    architecturalTactic: 'Continuous WAL archiving en PostgreSQL, snapshots diarios automatizados a almacenamiento inmutable y scripts de restauración IaC.',
    verificationMethod: 'Simulacro semestral de restauración completa de base de datos en un entorno aislado con verificación de sumas de verificación.',
  },
  {
    id: 'rnf-10',
    code: 'RNF-10',
    category: 'Trazabilidad',
    name: 'Trazabilidad Arquitectónica',
    targetMetric: 'Relación explícita y bidireccional entre requerimientos, decisiones arquitectónicas (ADRs), componentes y pruebas.',
    contextSGA: 'Facilita la auditoría académica y el mantenimiento del software a lo largo del tiempo por nuevos ingenieros.',
    architecturalTactic: 'Matriz de trazabilidad integrada en el código y documentación viva con Architecture Decision Records (ADRs).',
    verificationMethod: 'Revisión técnica de pares y validación de que cada RF y RNF cuente con componentes y pruebas asociadas.',
  },
  {
    id: 'rnf-11',
    code: 'RNF-11',
    category: 'Privacidad',
    name: 'Privacidad y Mínimo Privilegio',
    targetMetric: 'Acceso a datos personales y académicos limitado estrictamente según la necesidad del rol (Principio de Mínimo Privilegio).',
    contextSGA: 'Un estudiante no debe tener acceso a las notas de sus compañeros ni un docente a grupos ajenos.',
    architecturalTactic: 'Filtros de consulta contextuales por tenant/usuario (Row-Level Security o Scopes en la capa de servicios del módulo).',
    verificationMethod: 'Pruebas de seguridad IDOR (Insecure Direct Object Reference) intentando consultar registros ajenos con token de estudiante.',
  },
  {
    id: 'rnf-12',
    code: 'RNF-12',
    category: 'Compatibilidad',
    name: 'Compatibilidad Multiplataforma',
    targetMetric: 'Funcionamiento fluido en versiones recientes de navegadores comunes (Chrome, Firefox, Safari, Edge) y pantallas desde 360px.',
    contextSGA: 'Garantizar que cualquier miembro de la comunidad educativa pueda utilizar el sistema desde su dispositivo habitual.',
    architecturalTactic: 'HTML5 semántico, CSS moderno compilado con Autoprefixer y pruebas de compatibilidad en browsers modernos.',
    verificationMethod: 'Pruebas automatizadas multiplataforma con Playwright en Chrome, Firefox y WebKit.',
  },
];

export const USE_CASES: UseCase[] = [
  // ADMINISTRADOR
  {
    id: 'cu-adm-01',
    code: 'CU-ADM-01',
    actor: 'Administrador',
    name: 'Gestionar Usuarios, Roles y Permisos',
    summary: 'Crear, asignar y revocar roles del sistema (administrador, coordinador académico, docente, estudiante) y gestionar credenciales institucionales.',
    preconditions: ['El usuario debe estar autenticado con rol de Administrador en una sesión HTTPS activa.'],
    mainFlow: [
      '1. El administrador ingresa al módulo de Autenticación & Seguridad.',
      '2. Selecciona un usuario existente o presiona "Nuevo Usuario".',
      '3. Asigna o modifica el rol y permisos específicos.',
      '4. El sistema valida las reglas de seguridad y unicidad del correo.',
      '5. El sistema persiste el cambio en la base de datos y publica un evento de auditoría.',
      '6. Se notifica al administrador la confirmación del cambio.',
    ],
    alternativeFlows: [
      '4a. Si el usuario intenta remover el último administrador del sistema, el sistema bloquea la acción y muestra un error.',
    ],
    postconditions: ['El usuario queda con los nuevos privilegios y el evento se registra en la bitácora inmutable de auditoría.'],
    relatedRF: ['RF-01', 'RF-02', 'RF-12'],
    relatedRNF: ['RNF-01', 'RNF-05', 'RNF-10', 'RNF-11'],
    moduleInCharge: 'Módulo de Autenticación & Seguridad',
  },
  {
    id: 'cu-adm-02',
    code: 'CU-ADM-02',
    actor: 'Administrador',
    name: 'Gestionar Programas Académicos y Planes de Estudio',
    summary: 'Crear y actualizar la oferta de programas, asignaturas con créditos y semestres dentro del sistema.',
    preconditions: ['El administrador cuenta con los documentos oficiales de aprobación curricular.'],
    mainFlow: [
      '1. El administrador accede al submódulo de Programas y Asignaturas.',
      '2. Registra el código, nombre y total de créditos del programa.',
      '3. Vincula las asignaturas indicando código, semestre y créditos asociados.',
      '4. El sistema valida que los códigos sean únicos y no existan ciclos circulares en prerrequisitos.',
      '5. Se guarda el plan de estudios y se invalida la caché de catálogo en Redis.',
    ],
    postconditions: ['El programa y sus asignaturas quedan disponibles para la planificación académica.'],
    relatedRF: ['RF-05', 'RF-11'],
    relatedRNF: ['RNF-04', 'RNF-05', 'RNF-10'],
    moduleInCharge: 'Módulo de Gestión Académica',
  },
  {
    id: 'cu-adm-03',
    code: 'CU-ADM-03',
    actor: 'Administrador',
    name: 'Auditar Eventos Críticos y Trazabilidad Institucional',
    summary: 'Consultar y exportar la bitácora de eventos relevantes (inicios de sesión, cambios de roles, matrículas y notas) con filtros temporales.',
    preconditions: ['El usuario autenticado posee permiso de auditor institucional.'],
    mainFlow: [
      '1. El administrador ingresa al módulo de Auditoría.',
      '2. Aplica filtros por rango de fechas, usuario responsable, tipo de acción o registro afectado.',
      '3. El sistema ejecuta una consulta indexada y presenta los eventos ordenados cronológicamente.',
      '4. El administrador puede exportar la bitácora firmada con hash criptográfico.',
    ],
    postconditions: ['Se visualiza la trazabilidad sin posibilidad de modificar ni eliminar registros de la bitácora.'],
    relatedRF: ['RF-11', 'RF-12'],
    relatedRNF: ['RNF-01', 'RNF-07', 'RNF-10', 'RNF-11'],
    moduleInCharge: 'Módulo de Auditoría',
  },

  // COORDINADOR ACADÉMICO
  {
    id: 'cu-coord-01',
    code: 'CU-COORD-01',
    actor: 'Coordinador Académico',
    name: 'Configurar Periodos, Grupos y Oferta Académica',
    summary: 'Aperturar periodos lectivos, crear grupos con cupos máximos, asignar horarios, aulas o enlaces virtuales, y vincular al docente responsable.',
    preconditions: ['El periodo académico está en estado de planificación y las asignaturas están creadas.'],
    mainFlow: [
      '1. El coordinador selecciona el periodo lectivo (ej. 2026-1) y la asignatura a ofertar.',
      '2. Crea un nuevo grupo indicando código de grupo y cupo máximo (ej. 35 cupos).',
      '3. Asigna el docente responsable y define las franjas horarias y aula o enlace.',
      '4. El sistema valida que el docente y el aula no tengan cruces de horario simultáneos.',
      '5. Se confirma la apertura del grupo y se actualiza el catálogo en caché.',
    ],
    alternativeFlows: [
      '4a. Si el docente ya tiene otro grupo asignado en la misma franja horaria, el sistema emite alerta de conflicto y solicita seleccionar otro horario o docente.',
    ],
    postconditions: ['El grupo queda listo con cupo_disponible = cupo_maximo para el proceso de matrícula.'],
    relatedRF: ['RF-04', 'RF-06', 'RF-11'],
    relatedRNF: ['RNF-05', 'RNF-07', 'RNF-10'],
    moduleInCharge: 'Módulo de Gestión Académica',
  },
  {
    id: 'cu-coord-02',
    code: 'CU-COORD-02',
    actor: 'Coordinador Académico',
    name: 'Gestionar Expedientes de Estudiantes y Docentes',
    summary: 'Registrar, consultar, actualizar datos y activar o desactivar estudiantes y profesores adscritos a sus programas.',
    preconditions: ['El coordinador tiene asignado el programa académico correspondiente.'],
    mainFlow: [
      '1. El coordinador busca al estudiante o docente por documento o nombre.',
      '2. Visualiza el expediente completo y estado académico/contractual.',
      '3. Realiza la actualización requerida o cambia el estado (Activo/Desactivado).',
      '4. El sistema valida los datos y registra la novedad en auditoría.',
    ],
    postconditions: ['Los datos quedan actualizados en el sub-dominio académico.'],
    relatedRF: ['RF-03', 'RF-04', 'RF-11', 'RF-12'],
    relatedRNF: ['RNF-06', 'RNF-10', 'RNF-11'],
    moduleInCharge: 'Módulo de Gestión Académica',
  },
  {
    id: 'cu-coord-03',
    code: 'CU-COORD-03',
    actor: 'Coordinador Académico',
    name: 'Generar Reportes Consolidados de Matrícula y Rendimiento',
    summary: 'Generar reportes de estudiantes matriculados, grupos con ocupación de cupos y consolidados de resultados académicos filtrados por programa y periodo.',
    preconditions: ['Existen grupos con estudiantes matriculados o notas registradas en el periodo.'],
    mainFlow: [
      '1. El coordinador accede al Módulo de Reportes.',
      '2. Selecciona el tipo de reporte: "Ocupación de Grupos", "Listado de Matriculados" o "Consolidado de Calificaciones".',
      '3. Establece filtros por periodo académico, programa y asignatura.',
      '4. El sistema consulta las tablas correspondientes con paginación optimizada.',
      '5. Se presenta el reporte en pantalla con opción de descarga en formato CSV o PDF.',
    ],
    postconditions: ['El reporte es generado sin degradar el rendimiento de los 300 usuarios concurrentes en línea.'],
    relatedRF: ['RF-10', 'RF-11'],
    relatedRNF: ['RNF-02', 'RNF-06', 'RNF-08'],
    moduleInCharge: 'Módulo de Reportes',
  },

  // DOCENTE
  {
    id: 'cu-doc-01',
    code: 'CU-DOC-01',
    actor: 'Docente',
    name: 'Consultar Grupos Asignados y Lista de Estudiantes',
    summary: 'Visualizar los grupos académicos asignados en el periodo actual, sus horarios y la lista oficial de estudiantes matriculados.',
    preconditions: ['El docente ha iniciado sesión y tiene grupos asignados por la coordinación.'],
    mainFlow: [
      '1. El docente ingresa a su panel en el SGA.',
      '2. El sistema consulta los grupos donde docente_id coincide con el usuario autenticado.',
      '3. El docente selecciona un grupo específico.',
      '4. El sistema recupera y muestra la lista de estudiantes matriculados con su identificación y nombre.',
    ],
    postconditions: ['El docente tiene acceso únicamente a la información de sus propios estudiantes (privacidad RNF-11).'],
    relatedRF: ['RF-04', 'RF-06', 'RF-11'],
    relatedRNF: ['RNF-01', 'RNF-06', 'RNF-11', 'RNF-12'],
    moduleInCharge: 'Módulo de Gestión Académica',
  },
  {
    id: 'cu-doc-02',
    code: 'CU-DOC-02',
    actor: 'Docente',
    name: 'Registrar y Actualizar Calificaciones por Corte',
    summary: 'Ingresar y modificar notas parciales o definitivas de los estudiantes matriculados en sus grupos, validando rangos permitidos.',
    preconditions: ['El grupo pertenece al docente, las fechas de registro están vigentes y el estudiante está matriculado formalmente.'],
    mainFlow: [
      '1. El docente abre la planilla de calificaciones del grupo.',
      '2. Ingresa o actualiza las notas numéricas de cada estudiante (rango de 0.0 a 5.0).',
      '3. El sistema valida los formatos numéricos y rangos en tiempo real en la interfaz.',
      '4. El docente presiona "Guardar Calificaciones".',
      '5. El sistema ejecuta una transacción ACID que actualiza las notas, recalcula el promedio ponderado y registra el evento en auditoría (usuario, fecha, nota anterior, nota nueva).',
      '6. Se muestra confirmación de guardado exitoso.',
    ],
    alternativeFlows: [
      '3a. Si alguna nota se encuentra fuera del rango 0.0 a 5.0, el sistema rechaza la fila y destaca el campo con error.',
    ],
    postconditions: ['Las calificaciones quedan actualizadas y los cambios quedan auditados de forma inmutable.'],
    relatedRF: ['RF-08', 'RF-11', 'RF-12'],
    relatedRNF: ['RNF-01', 'RNF-02', 'RNF-07', 'RNF-10'],
    moduleInCharge: 'Módulo de Calificaciones',
  },

  // ESTUDIANTE
  {
    id: 'cu-est-01',
    code: 'CU-EST-01',
    actor: 'Estudiante',
    name: 'Realizar Matrícula Académica en Tiempo Real',
    summary: 'Seleccionar asignaturas y grupos disponibles para el periodo, validar cupos en tiempo real y confirmar la inscripción sin duplicados.',
    preconditions: ['El estudiante está activo, autenticado y en periodo hábil de matrícula.'],
    mainFlow: [
      '1. El estudiante ingresa al módulo de Matrículas.',
      '2. El sistema muestra la oferta de asignaturas con sus grupos, horarios y cupos disponibles.',
      '3. El estudiante selecciona los grupos de su interés.',
      '4. El estudiante presiona "Confirmar Matrícula".',
      '5. El sistema ejecuta la transacción de matrícula:',
      '   a. Bloquea pesimistamente la fila del grupo (FOR UPDATE) para reservar el cupo.',
      '   b. Verifica que cupo_disponible > 0.',
      '   c. Verifica que el estudiante no esté ya matriculado en la misma asignatura o grupo (evitar duplicados).',
      '   d. Decrementa el cupo disponible e inserta el registro en matricula.',
      '   e. Emite evento de auditoría.',
      '6. La transacción se confirma (COMMIT) y el estudiante recibe su comprobante en < 1 segundo.',
    ],
    alternativeFlows: [
      '5b-1. Si el cupo se agotó en la misma milésima de segundo por otro estudiante, el sistema hace ROLLBACK inmediato y notifica: "El grupo seleccionado ya no tiene cupos disponibles".',
      '5c-1. Si el estudiante ya cuenta con matrícula activa en esa asignatura, el sistema bloquea la acción indicando matrícula duplicada.',
    ],
    postconditions: ['El estudiante queda matriculado con cupo garantizado y el cupo del grupo se decrementa de forma consistente.'],
    relatedRF: ['RF-06', 'RF-07', 'RF-12'],
    relatedRNF: ['RNF-02', 'RNF-03', 'RNF-06', 'RNF-07', 'RNF-10'],
    moduleInCharge: 'Módulo de Matrículas',
  },
  {
    id: 'cu-est-02',
    code: 'CU-EST-02',
    actor: 'Estudiante',
    name: 'Consultar Resultados Académicos y Horarios',
    summary: 'Visualizar las asignaturas matriculadas, el horario de clases semanal y las calificaciones publicadas con sus respectivos cortes.',
    preconditions: ['El estudiante tiene una sesión activa iniciada con sus credenciales.'],
    mainFlow: [
      '1. El estudiante accede a la sección "Mis Asignaturas y Calificaciones".',
      '2. Selecciona el periodo académico actual o periodos históricos.',
      '3. El sistema consulta las matrículas y notas del estudiante (aprovechando caché de segundo nivel si aplica).',
      '4. Se visualiza la tabla con código de materia, grupo, horario, aula, notas de cortes evaluativos y promedio definitivo acumulado.',
    ],
    postconditions: ['El estudiante consulta sus datos con tiempo de respuesta < 500ms y sin acceder a información de otros estudiantes.'],
    relatedRF: ['RF-09', 'RF-11'],
    relatedRNF: ['RNF-01', 'RNF-02', 'RNF-06', 'RNF-11', 'RNF-12'],
    moduleInCharge: 'Módulo de Calificaciones',
  },
];

export const LOGICAL_COMPONENTS: LogicalComponent[] = [
  {
    id: 'comp-auth',
    name: 'Módulo de Autenticación & Control de Acceso (RBAC)',
    type: 'Cross-Cutting',
    summary: 'Gestiona la identidad de usuarios, emisión y verificación de credenciales, tokens JWT y autorización de roles (administrador, coordinador, docente, estudiante).',
    responsibilities: [
      'Autenticar usuarios individuales mediante credenciales con hash seguro Argon2id (RF-01, RNF-01).',
      'Cerrar sesiones e invalidar tokens mediante blacklist temporal en Redis.',
      'Proveer middleware de autorización RBAC para validar permisos en cada petición HTTP (RF-02, RNF-11).',
      'Publicar eventos de seguridad ante inicios de sesión o cambios de roles para auditoría (RF-12).',
    ],
    providedInterfaces: [
      {
        name: 'IAuthService',
        description: 'Servicio de autenticación consumido por la capa de presentación y controladores.',
        methods: [
          'login(credentials: UserCredentials): Promise<AuthTokenResult>',
          'logout(token: string): Promise<void>',
          'verifyToken(token: string): TokenPayload',
        ],
      },
      {
        name: 'IRbacService',
        description: 'Servicio de validación de roles y permisos para el resto de módulos.',
        methods: [
          'hasPermission(userId: string, requiredRole: Role): boolean',
          'getUserRoles(userId: string): Promise<Role[]>',
          'assignRole(userId: string, role: Role, actorId: string): Promise<void>',
        ],
      },
    ],
    consumedInterfaces: [
      {
        module: 'Módulo de Auditoría',
        interfaceName: 'IAuditService',
        purpose: 'Registrar eventos de inicio de sesión exitoso, fallido y reasignación de roles.',
      },
    ],
    domainEventsPublished: ['UserLoggedInEvent', 'UserLoggedOutEvent', 'RoleAssignedEvent'],
    domainEventsSubscribed: [],
    databaseSchema: 'auth (tablas: usuario, rol, usuario_rol, sesion_activa)',
    relatedRF: ['RF-01', 'RF-02', 'RF-12'],
    relatedRNF: ['RNF-01', 'RNF-05', 'RNF-10', 'RNF-11'],
    tactics: [
      'Stateless JWT con validación criptográfica en memoria sin golpear la base de datos.',
      'Hashing robusto de contraseñas con sal aleatoria (Argon2id).',
      'Principio de Mínimo Privilegio (Least Privilege) en todos los endpoints.',
    ],
  },
  {
    id: 'comp-academica',
    name: 'Módulo de Gestión Académica',
    type: 'Core Domain',
    summary: 'Administra la estructura académica fundamental: Estudiantes, Docentes, Programas, Planes de Estudio, Asignaturas, Periodos Lectivos y Grupos.',
    responsibilities: [
      'Registrar, consultar, actualizar y desactivar estudiantes y docentes (RF-03, RF-04).',
      'Crear y mantener programas, mallas y asignaturas con códigos y créditos (RF-05).',
      'Configurar periodos lectivos y aperturar grupos con cupos, horarios, docentes y aulas (RF-06).',
      'Proveer capacidades de búsqueda y filtrado por identificador, nombre y estado (RF-11).',
      'Invalidar la caché de catálogo en Redis ante modificaciones en la oferta académica.',
    ],
    providedInterfaces: [
      {
        name: 'IAcademicCatalogService',
        description: 'Contrato público para consultar la oferta de asignaturas y grupos.',
        methods: [
          'getSubjectDetails(subjectId: string): Promise<SubjectDTO>',
          'getGroupAvailability(groupId: string): Promise<GroupAvailabilityDTO>',
          'getStudyPlan(programId: string): Promise<StudyPlanDTO>',
          'searchStudents(filter: StudentFilterDTO): Promise<PaginatedResult<StudentDTO>>',
          'searchTeachers(filter: TeacherFilterDTO): Promise<PaginatedResult<TeacherDTO>>',
        ],
      },
      {
        name: 'IGroupManagementService',
        description: 'Contrato para gestión de cupos y horarios de grupos.',
        methods: [
          'createGroup(data: CreateGroupDTO): Promise<GroupDTO>',
          'updateGroupCapacity(groupId: string, newCapacity: number): Promise<void>',
          'validateScheduleOverlap(teacherId: string, schedule: ScheduleDTO): Promise<boolean>',
        ],
      },
    ],
    consumedInterfaces: [
      {
        module: 'Módulo de Autenticación & Seguridad',
        interfaceName: 'IRbacService',
        purpose: 'Verificar permisos de administrador o coordinador antes de modificar datos académicos.',
      },
      {
        module: 'Módulo de Auditoría',
        interfaceName: 'IAuditService',
        purpose: 'Registrar la creación y desactivación de estudiantes, docentes y planes de estudio.',
      },
    ],
    domainEventsPublished: ['StudentDeactivatedEvent', 'GroupCapacityChangedEvent', 'CurriculumUpdatedEvent'],
    domainEventsSubscribed: [],
    databaseSchema: 'academico (tablas: estudiante, docente, programa, plan_estudio, asignatura, periodo, grupo)',
    relatedRF: ['RF-03', 'RF-04', 'RF-05', 'RF-06', 'RF-11'],
    relatedRNF: ['RNF-04', 'RNF-05', 'RNF-06', 'RNF-10', 'RNF-11', 'RNF-12'],
    tactics: [
      'Caché L2 (Cache-Aside en Redis) para el catálogo de asignaturas y horarios.',
      'Índices B-Tree y GIN en PostgreSQL para búsquedas textuales optimizadas (< 10ms).',
      'Reglas de integridad referencial dura entre programas, asignaturas y grupos.',
    ],
  },
  {
    id: 'comp-matricula',
    name: 'Módulo de Matrículas (Núcleo Concurrente)',
    type: 'Core Domain (Hotspot)',
    summary: 'Orquesta el proceso de matrícula académica, la reserva atómica de cupos bajo concurrencia extrema y la prevención de inscripciones duplicadas.',
    responsibilities: [
      'Inscribir estudiantes en asignaturas y grupos de un periodo académico (RF-07).',
      'Validar cupos disponibles en tiempo real con bloqueo a nivel de fila para evitar sobrecupos (RNF-07).',
      'Impedir inscripciones duplicadas en el mismo periodo mediante restricciones únicas (RF-07).',
      'Publicar eventos de dominio ante matrículas confirmadas o canceladas.',
    ],
    providedInterfaces: [
      {
        name: 'IEnrollmentService',
        description: 'Contrato consumido por la capa web para procesar matrículas.',
        methods: [
          'enrollStudent(studentId: string, groupIds: string[], periodId: string): Promise<EnrollmentResultDTO>',
          'cancelEnrollment(enrollmentId: string, reason: string): Promise<void>',
          'getStudentEnrollments(studentId: string, periodId: string): Promise<EnrollmentSummaryDTO[]>',
          'checkAvailableQuotas(groupIds: string[]): Promise<Map<string, number>>',
        ],
      },
    ],
    consumedInterfaces: [
      {
        module: 'Módulo de Gestión Académica',
        interfaceName: 'IAcademicCatalogService',
        purpose: 'Consultar detalles del grupo, asignaturas y verificar que el estudiante esté en estado Activo.',
      },
      {
        module: 'Módulo de Auditoría',
        interfaceName: 'IAuditService',
        purpose: 'Registrar la transacción de matrícula con fecha, usuario, grupos inscritos e IP.',
      },
    ],
    domainEventsPublished: ['StudentEnrolledEvent', 'EnrollmentCancelledEvent'],
    domainEventsSubscribed: [],
    databaseSchema: 'matricula (tablas: matricula, detalle_matricula)',
    relatedRF: ['RF-07', 'RF-11', 'RF-12'],
    relatedRNF: ['RNF-02', 'RNF-03', 'RNF-04', 'RNF-07', 'RNF-10'],
    tactics: [
      'Bloqueo pesimista en PostgreSQL (SELECT ... FOR UPDATE) para reserva atómica de cupos.',
      'Restricción de unicidad compuesta: UNIQUE(estudiante_id, grupo_id, periodo_id) para evitar duplicados.',
      'Transacciones breves (< 25ms) para soportar los 300 usuarios concurrentes sin saturar conexiones.',
    ],
  },
  {
    id: 'comp-calificaciones',
    name: 'Módulo de Calificaciones',
    type: 'Core Domain',
    summary: 'Permite a los docentes registrar y actualizar notas de sus grupos, calcula promedios y entrega la consulta de resultados a los estudiantes.',
    responsibilities: [
      'Registrar y actualizar calificaciones de estudiantes por cortes evaluativos asignados (RF-08).',
      'Validar que solo el docente asignado al grupo pueda registrar o modificar calificaciones (RF-08, RNF-11).',
      'Calcular notas definitivas y promedios ponderados en tiempo real (RNF-07).',
      'Permitir que el estudiante consulte sus notas publicadas, horarios y asignaturas matriculadas (RF-09).',
      'Emitir eventos de auditoría obligatorios ante cualquier edición de notas (RF-12).',
    ],
    providedInterfaces: [
      {
        name: 'IGradingService',
        description: 'Contrato para captura y cálculo de notas por docentes.',
        methods: [
          'submitGrades(teacherId: string, groupId: string, grades: StudentGradeDTO[]): Promise<GradeSubmissionResult>',
          'getGroupRosterWithGrades(teacherId: string, groupId: string): Promise<GroupRosterDTO>',
          'closeGradingPeriod(groupId: string, periodId: string): Promise<void>',
        ],
      },
      {
        name: 'IStudentResultsService',
        description: 'Contrato para consulta de resultados por parte de los estudiantes.',
        methods: [
          'getStudentAcademicHistory(studentId: string): Promise<AcademicHistoryDTO>',
          'getTermGrades(studentId: string, periodId: string): Promise<TermGradesDTO>',
          'getStudentSchedule(studentId: string, periodId: string): Promise<WeeklyScheduleDTO>',
        ],
      },
    ],
    consumedInterfaces: [
      {
        module: 'Módulo de Matrículas',
        interfaceName: 'IEnrollmentService',
        purpose: 'Obtener la lista oficial de estudiantes matriculados en el grupo para armar la planilla.',
      },
      {
        module: 'Módulo de Gestión Académica',
        interfaceName: 'IAcademicCatalogService',
        purpose: 'Verificar asignación docente y créditos de la asignatura.',
      },
      {
        module: 'Módulo de Auditoría',
        interfaceName: 'IAuditService',
        purpose: 'Registrar cada cambio de calificación con valor previo, valor nuevo, fecha y autor.',
      },
    ],
    domainEventsPublished: ['GradeUpdatedEvent', 'FinalActClosedEvent'],
    domainEventsSubscribed: ['StudentEnrolledEvent'],
    databaseSchema: 'calificaciones (tablas: evaluacion, calificacion, corte_periodo, acta_definitiva)',
    relatedRF: ['RF-08', 'RF-09', 'RF-11', 'RF-12'],
    relatedRNF: ['RNF-01', 'RNF-02', 'RNF-07', 'RNF-10', 'RNF-11'],
    tactics: [
      'Operaciones Bulk-Upsert para registrar planillas completas de hasta 40 notas en un solo round-trip SQL.',
      'Control de concurrencia y validación estricta de rango numérico [0.0 - 5.0].',
      'Aislamiento de lectura: estudiantes solo acceden a sus propios registros vía cláusula WHERE estudiante_id = :token_id.',
    ],
  },
  {
    id: 'comp-reportes',
    name: 'Módulo de Reportes & Consultas',
    type: 'Support Domain',
    summary: 'Consolida la información académica para generar reportes analíticos con filtros por periodo, programa, asignatura y estado.',
    responsibilities: [
      'Generar reportes de estudiantes matriculados por grupo o periodo (RF-10).',
      'Generar reportes de ocupación de cupos y asignación de docentes (RF-10).',
      'Generar consolidados de resultados académicos y distribución de notas (RF-10).',
      'Proveer filtros avanzados y exportación a formatos estándar (CSV/PDF) (RF-11, RNF-08).',
    ],
    providedInterfaces: [
      {
        name: 'IReportingService',
        description: 'Contrato para generación y exportación de reportes institucionales.',
        methods: [
          'generateEnrollmentReport(filter: ReportFilterDTO): Promise<ReportDataDTO>',
          'generateGroupOccupancyReport(periodId: string, programId?: string): Promise<OccupancyReportDTO>',
          'generateAcademicResultsReport(filter: ResultsReportFilterDTO): Promise<ResultsReportDTO>',
          'exportReportToCSV(reportId: string): Promise<Buffer>',
          'exportReportToPDF(reportId: string): Promise<Buffer>',
        ],
      },
    ],
    consumedInterfaces: [
      {
        module: 'Módulo de Gestión Académica',
        interfaceName: 'IAcademicCatalogService',
        purpose: 'Consultar información de programas, asignaturas y docentes.',
      },
      {
        module: 'Módulo de Matrículas',
        interfaceName: 'IEnrollmentService',
        purpose: 'Obtener totales de matriculados.',
      },
      {
        module: 'Módulo de Calificaciones',
        interfaceName: 'IGradingService',
        purpose: 'Obtener distribución y promedios de calificaciones.',
      },
    ],
    domainEventsPublished: ['ReportGeneratedEvent'],
    domainEventsSubscribed: [],
    databaseSchema: 'No posee schema propio de mutación; ejecuta consultas de sólo lectura optimizadas (Read-Only Views)',
    relatedRF: ['RF-10', 'RF-11'],
    relatedRNF: ['RNF-02', 'RNF-06', 'RNF-08', 'RNF-11'],
    tactics: [
      'Vistas SQL materializadas e índices de cobertura para reportes agregados pesados.',
      'Generación de reportes PDF en background workers mediante colas en Redis para no bloquear el hilo HTTP.',
      'Paginación estricta (Cursor o Offset) para evitar desbordamiento de memoria.',
    ],
  },
  {
    id: 'comp-auditoria',
    name: 'Módulo de Auditoría & Trazabilidad',
    type: 'Cross-Cutting',
    summary: 'Registra y resguarda de forma inmutable la bitácora de eventos relevantes del sistema para garantizar el no repudio y cumplimiento normativo.',
    responsibilities: [
      'Registrar inicios de sesión, cambios de roles, matrículas y alteraciones de calificaciones (RF-12).',
      'Almacenar usuario responsable, timestamp UTC, acción, entidad afectada, datos anteriores y datos nuevos (RF-12).',
      'Garantizar la inmutabilidad de la bitácora (tabla Append-Only sin permisos de modificación o borrado) (RNF-10).',
      'Proveer consultas forenses con filtros avanzados para el Administrador (RF-11, RNF-10).',
    ],
    providedInterfaces: [
      {
        name: 'IAuditService',
        description: 'Contrato consumido por todos los módulos del sistema para registrar eventos.',
        methods: [
          'logEvent(event: AuditEventDTO): Promise<void>',
          'queryAuditTrail(filter: AuditFilterDTO): Promise<PaginatedResult<AuditEventRecordDTO>>',
          'verifyAuditIntegrity(recordId: string): Promise<boolean>',
        ],
      },
    ],
    consumedInterfaces: [],
    domainEventsPublished: [],
    domainEventsSubscribed: ['UserLoggedInEvent', 'RoleAssignedEvent', 'StudentEnrolledEvent', 'GradeUpdatedEvent'],
    databaseSchema: 'auditoria (tablas: bitacora_eventos, hash_integridad)',
    relatedRF: ['RF-11', 'RF-12'],
    relatedRNF: ['RNF-01', 'RNF-07', 'RNF-10', 'RNF-11'],
    tactics: [
      'Persistencia asíncrona desacoplada del ciclo de transacción principal mediante Event Listeners en memoria.',
      'Tabla Append-Only en PostgreSQL con permisos SQL restringidos (sólo INSERT y SELECT permitidos al rol de la app).',
      'Generación de hash SHA-256 encadenado para detectar cualquier alteración manual de registros.',
    ],
  },
];

export const C4_COMPONENTS = LOGICAL_COMPONENTS.map((lc) => ({
  id: lc.id,
  name: lc.name,
  type: lc.type,
  responsibilities: lc.responsibilities.join(' '),
  interfaces: lc.providedInterfaces.map((i) => i.name).join(', '),
  dependencies: lc.consumedInterfaces.map((c) => `${c.module} (${c.interfaceName})`),
  tech: lc.tactics.join(' · '),
}));

export interface ConceptualEntity {
  id: string;
  name: string;
  module: string;
  description: string;
  primaryKey: string;
  attributes: { name: string; type: string; isRequired: boolean; isUnique?: boolean; description: string }[];
  foreignKeys: { field: string; referencesEntity: string; description: string }[];
  relationships: {
    targetEntity: string;
    cardinality: string; // e.g. "1 : N", "N : M", "1 : 1"
    description: string;
  }[];
  businessRules: string[];
}

export const CONCEPTUAL_ENTITIES: ConceptualEntity[] = [
  {
    id: 'ent-usuario',
    name: 'Usuario',
    module: 'Autenticación & Seguridad (auth)',
    description: 'Entidad raíz de autenticación y credenciales para el acceso al SGA.',
    primaryKey: 'id (UUID)',
    attributes: [
      { name: 'id', type: 'UUID', isRequired: true, isUnique: true, description: 'Identificador único global del usuario' },
      { name: 'email', type: 'VARCHAR(150)', isRequired: true, isUnique: true, description: 'Correo institucional único' },
      { name: 'password_hash', type: 'VARCHAR(255)', isRequired: true, description: 'Hash seguro Argon2id con sal criptográfica' },
      { name: 'estado', type: 'VARCHAR(20)', isRequired: true, description: 'Activo, Inactivo, Bloqueado' },
      { name: 'ultimo_login', type: 'TIMESTAMP WITH TIME ZONE', isRequired: false, description: 'Marca de tiempo del último inicio de sesión exitoso' },
    ],
    foreignKeys: [],
    relationships: [
      { targetEntity: 'Rol', cardinality: 'N : M (vía Usuario_Rol)', description: 'Un usuario puede poseer uno o varios roles asignados' },
      { targetEntity: 'Estudiante', cardinality: '1 : 1 (Opcional)', description: 'Un usuario con rol Estudiante se vincula a su perfil de estudiante' },
      { targetEntity: 'Docente', cardinality: '1 : 1 (Opcional)', description: 'Un usuario con rol Docente se vincula a su perfil profesoral' },
    ],
    businessRules: [
      'Contraseñas cifradas con algoritmo Argon2id (RNF-01).',
      'Bloqueo preventivo tras 5 intentos fallidos consecutivos.',
    ],
  },
  {
    id: 'ent-rol',
    name: 'Rol',
    module: 'Autenticación & Seguridad (auth)',
    description: 'Define los perfiles de acceso y permisos dentro de la arquitectura RBAC.',
    primaryKey: 'id (UUID)',
    attributes: [
      { name: 'id', type: 'UUID', isRequired: true, isUnique: true, description: 'Identificador único del rol' },
      { name: 'codigo', type: 'VARCHAR(50)', isRequired: true, isUnique: true, description: 'ADMIN, COORDINADOR, DOCENTE, ESTUDIANTE' },
      { name: 'nombre', type: 'VARCHAR(100)', isRequired: true, description: 'Nombre descriptivo del rol' },
      { name: 'descripcion', type: 'TEXT', isRequired: false, description: 'Alcance y facultades del perfil' },
    ],
    foreignKeys: [],
    relationships: [
      { targetEntity: 'Usuario', cardinality: 'M : N (vía Usuario_Rol)', description: 'Varios usuarios comparten los mismos roles' },
    ],
    businessRules: [
      'El sistema exige como mínimo los 4 roles canónicos (RF-02).',
      'Principio de menor privilegio para acceso a endpoints (RNF-11).',
    ],
  },
  {
    id: 'ent-estudiante',
    name: 'Estudiante',
    module: 'Gestión Académica (academico)',
    description: 'Expediente personal y académico del estudiante matriculado en la institución.',
    primaryKey: 'id (UUID)',
    attributes: [
      { name: 'id', type: 'UUID', isRequired: true, isUnique: true, description: 'Identificador único del estudiante' },
      { name: 'codigo_estudiantil', type: 'VARCHAR(20)', isRequired: true, isUnique: true, description: 'Código institucional único' },
      { name: 'documento_identidad', type: 'VARCHAR(30)', isRequired: true, isUnique: true, description: 'Cédula o documento nacional de identidad' },
      { name: 'nombres', type: 'VARCHAR(100)', isRequired: true, description: 'Nombres completos' },
      { name: 'apellidos', type: 'VARCHAR(100)', isRequired: true, description: 'Apellidos completos' },
      { name: 'estado_academico', type: 'VARCHAR(20)', isRequired: true, description: 'Activo, Inactivo, Graduado, Retirado' },
    ],
    foreignKeys: [
      { field: 'usuario_id', referencesEntity: 'Usuario', description: 'Vínculo 1:1 con credenciales de autenticación' },
      { field: 'programa_id', referencesEntity: 'Programa', description: 'Programa académico principal en el cual cursa sus estudios' },
    ],
    relationships: [
      { targetEntity: 'Programa', cardinality: 'N : 1', description: 'Muchos estudiantes pertenecen a un programa académico' },
      { targetEntity: 'Matrícula', cardinality: '1 : N', description: 'Un estudiante realiza una matrícula por periodo lectivo' },
    ],
    businessRules: [
      'Solo estudiantes en estado Activo pueden participar del proceso de matrícula (RF-07).',
      'Un estudiante tiene acceso de consulta estricto a sus propios datos (RNF-11).',
    ],
  },
  {
    id: 'ent-docente',
    name: 'Docente',
    module: 'Gestión Académica (academico)',
    description: 'Perfil del profesor responsable de la orientación académica de los grupos.',
    primaryKey: 'id (UUID)',
    attributes: [
      { name: 'id', type: 'UUID', isRequired: true, isUnique: true, description: 'Identificador único del docente' },
      { name: 'documento_identidad', type: 'VARCHAR(30)', isRequired: true, isUnique: true, description: 'Identificación oficial del docente' },
      { name: 'nombres', type: 'VARCHAR(100)', isRequired: true, description: 'Nombres completos' },
      { name: 'apellidos', type: 'VARCHAR(100)', isRequired: true, description: 'Apellidos completos' },
      { name: 'especialidad', type: 'VARCHAR(150)', isRequired: false, description: 'Área de conocimiento curricular' },
      { name: 'estado', type: 'VARCHAR(20)', isRequired: true, description: 'Activo, Inactivo' },
    ],
    foreignKeys: [
      { field: 'usuario_id', referencesEntity: 'Usuario', description: 'Vínculo 1:1 con cuenta de usuario y credenciales' },
    ],
    relationships: [
      { targetEntity: 'Grupo', cardinality: '1 : N', description: 'Un docente tiene a su cargo múltiples grupos en un periodo' },
    ],
    businessRules: [
      'Un docente no puede tener grupos solapados en la misma franja horaria (RF-06).',
      'Solo el docente titular puede registrar calificaciones en sus grupos (RF-08).',
    ],
  },
  {
    id: 'ent-programa',
    name: 'Programa',
    module: 'Gestión Académica (academico)',
    description: 'Carrera o programa académico formal ofertado por la institución.',
    primaryKey: 'id (UUID)',
    attributes: [
      { name: 'id', type: 'UUID', isRequired: true, isUnique: true, description: 'Identificador del programa' },
      { name: 'codigo', type: 'VARCHAR(20)', isRequired: true, isUnique: true, description: 'Código oficial del programa (ej. ING-SIS)' },
      { name: 'nombre', type: 'VARCHAR(150)', isRequired: true, description: 'Denominación oficial del programa' },
      { name: 'nivel_formacion', type: 'VARCHAR(50)', isRequired: true, description: 'Pregrado, Posgrado, Tecnológico' },
      { name: 'total_creditos', type: 'INTEGER', isRequired: true, description: 'Total de créditos para titulación' },
    ],
    foreignKeys: [],
    relationships: [
      { targetEntity: 'Estudiante', cardinality: '1 : N', description: 'Un programa agrupa múltiples estudiantes adscritos' },
      { targetEntity: 'Asignatura', cardinality: 'N : M (vía Plan de Estudio)', description: 'Un programa contiene múltiples asignaturas en su malla' },
    ],
    businessRules: [
      'El código de programa es inmutable una vez abierto el periodo de inscripciones.',
    ],
  },
  {
    id: 'ent-asignatura',
    name: 'Asignatura',
    module: 'Gestión Académica (academico)',
    description: 'Materia o curso curricular que compone los planes de estudio.',
    primaryKey: 'id (UUID)',
    attributes: [
      { name: 'id', type: 'UUID', isRequired: true, isUnique: true, description: 'Identificador de la asignatura' },
      { name: 'codigo', type: 'VARCHAR(20)', isRequired: true, isUnique: true, description: 'Código de materia (ej. MAT-101)' },
      { name: 'nombre', type: 'VARCHAR(150)', isRequired: true, description: 'Nombre formal de la asignatura' },
      { name: 'creditos', type: 'INTEGER', isRequired: true, description: 'Número de créditos académicos (ej. 3)' },
      { name: 'semestre_nivel', type: 'INTEGER', isRequired: true, description: 'Semestre o nivel curricular sugerido (1 a 10)' },
    ],
    foreignKeys: [],
    relationships: [
      { targetEntity: 'Grupo', cardinality: '1 : N', description: 'Una asignatura se oferta en múltiples grupos/secciones por periodo' },
      { targetEntity: 'Programa', cardinality: 'M : N', description: 'Pertenece a uno o varios planes de estudio' },
    ],
    businessRules: [
      'Los créditos deben ser un valor entero positivo mayor a cero (RF-05).',
      'Las consultas de catálogo de asignaturas se sirven desde caché Redis L2 (RNF-02).',
    ],
  },
  {
    id: 'ent-periodo',
    name: 'PeriodoAcadémico',
    module: 'Gestión Académica (academico)',
    description: 'Ventana temporal o semestre lectivo donde se programan grupos y matrículas.',
    primaryKey: 'id (UUID)',
    attributes: [
      { name: 'id', type: 'UUID', isRequired: true, isUnique: true, description: 'Identificador del periodo' },
      { name: 'codigo', type: 'VARCHAR(20)', isRequired: true, isUnique: true, description: 'Identificador de periodo (ej. 2026-1, 2026-2)' },
      { name: 'fecha_inicio', type: 'DATE', isRequired: true, description: 'Fecha de apertura del periodo académico' },
      { name: 'fecha_fin', type: 'DATE', isRequired: true, description: 'Fecha de cierre de semestre' },
      { name: 'estado', type: 'VARCHAR(20)', isRequired: true, description: 'Planeación, Matrículas, En Curso, Cerrado' },
    ],
    foreignKeys: [],
    relationships: [
      { targetEntity: 'Grupo', cardinality: '1 : N', description: 'Un periodo contiene todos los grupos ofertados' },
      { targetEntity: 'Matrícula', cardinality: '1 : N', description: 'Un periodo agrupa las matrículas realizadas' },
    ],
    businessRules: [
      'Solo puede existir un periodo en estado "Matrículas" activo por facultad simultáneamente.',
    ],
  },
  {
    id: 'ent-grupo',
    name: 'Grupo',
    module: 'Gestión Académica & Matrículas (academico/matricula)',
    description: 'Sección u oferta concreta de una asignatura en un periodo con cupo y horario.',
    primaryKey: 'id (UUID)',
    attributes: [
      { name: 'id', type: 'UUID', isRequired: true, isUnique: true, description: 'Identificador único del grupo' },
      { name: 'codigo_grupo', type: 'VARCHAR(10)', isRequired: true, description: 'Código de grupo (ej. G01, G02)' },
      { name: 'cupo_maximo', type: 'INTEGER', isRequired: true, description: 'Capacidad total de estudiantes (ej. 35)' },
      { name: 'cupo_disponible', type: 'INTEGER', isRequired: true, description: 'Cupos libres para matrícula en tiempo real' },
      { name: 'horario', type: 'VARCHAR(150)', isRequired: true, description: 'Días y horas semanales (ej. LUN-MIE 08:00-10:00)' },
      { name: 'aula_o_enlace', type: 'VARCHAR(150)', isRequired: true, description: 'Ubicación física o enlace de encuentro virtual' },
    ],
    foreignKeys: [
      { field: 'asignatura_id', referencesEntity: 'Asignatura', description: 'Materia que se imparte en el grupo' },
      { field: 'periodo_id', referencesEntity: 'PeriodoAcadémico', description: 'Periodo académico de vigencia' },
      { field: 'docente_id', referencesEntity: 'Docente', description: 'Docente responsable asignado' },
    ],
    relationships: [
      { targetEntity: 'Asignatura', cardinality: 'N : 1', description: 'Múltiples grupos pertenecen a la misma asignatura' },
      { targetEntity: 'PeriodoAcadémico', cardinality: 'N : 1', description: 'Asociado al periodo lectivo' },
      { targetEntity: 'Docente', cardinality: 'N : 1', description: 'Asignado a un profesor titular' },
      { targetEntity: 'DetalleMatrícula', cardinality: '1 : N', description: 'Contiene las inscripciones de estudiantes' },
    ],
    businessRules: [
      'cupo_disponible nunca puede ser menor a cero (RNF-07).',
      'La reserva de cupo se ejecuta mediante bloqueo pesimista `SELECT ... FOR UPDATE` (ADR-002).',
    ],
  },
  {
    id: 'ent-matricula',
    name: 'Matrícula',
    module: 'Matrículas (matricula)',
    description: 'Registro oficial de inscripción del estudiante en un periodo académico.',
    primaryKey: 'id (UUID)',
    attributes: [
      { name: 'id', type: 'UUID', isRequired: true, isUnique: true, description: 'Identificador único de la matrícula' },
      { name: 'fecha_registro', type: 'TIMESTAMP WITH TIME ZONE', isRequired: true, description: 'Momento exacto de confirmación' },
      { name: 'total_creditos_inscritos', type: 'INTEGER', isRequired: true, description: 'Sumatoria de créditos inscritos' },
      { name: 'estado', type: 'VARCHAR(20)', isRequired: true, description: 'Confirmada, Cancelada, Anulada' },
    ],
    foreignKeys: [
      { field: 'estudiante_id', referencesEntity: 'Estudiante', description: 'Estudiante titular de la matrícula' },
      { field: 'periodo_id', referencesEntity: 'PeriodoAcadémico', description: 'Periodo lectivo matriculado' },
    ],
    relationships: [
      { targetEntity: 'Estudiante', cardinality: 'N : 1', description: 'Un estudiante posee sus matrículas semestrales' },
      { targetEntity: 'PeriodoAcadémico', cardinality: 'N : 1', description: 'Pertenece al periodo correspondiente' },
      { targetEntity: 'DetalleMatrícula', cardinality: '1 : N (Composición)', description: 'Líneas de asignaturas y grupos inscritos' },
    ],
    businessRules: [
      'Restricción estricta de unicidad: UNIQUE(estudiante_id, periodo_id) para evitar dobles matrículas (RF-07).',
      'Transacción ACID atómica que involucra decremento de cupos en grupos (RNF-07).',
    ],
  },
  {
    id: 'ent-calificacion',
    name: 'Calificación',
    module: 'Calificaciones (calificaciones)',
    description: 'Registro cuantitativo del desempeño académico de un estudiante en una asignatura.',
    primaryKey: 'id (UUID)',
    attributes: [
      { name: 'id', type: 'UUID', isRequired: true, isUnique: true, description: 'Identificador de la calificación' },
      { name: 'corte_evaluativo', type: 'VARCHAR(50)', isRequired: true, description: 'Corte 1 (30%), Corte 2 (30%), Corte 3 (40%)' },
      { name: 'porcentaje_ponderacion', type: 'NUMERIC(5,2)', isRequired: true, description: 'Peso porcentual del corte en la nota definitiva' },
      { name: 'valor_nota', type: 'NUMERIC(3,1)', isRequired: true, description: 'Calificación numérica entre 0.0 y 5.0' },
      { name: 'fecha_registro', type: 'TIMESTAMP WITH TIME ZONE', isRequired: true, description: 'Fecha y hora de captura' },
      { name: 'estado', type: 'VARCHAR(20)', isRequired: true, description: 'Borrador, Publicada, Definitiva/Cerrada' },
    ],
    foreignKeys: [
      { field: 'estudiante_id', referencesEntity: 'Estudiante', description: 'Estudiante evaluado' },
      { field: 'grupo_id', referencesEntity: 'Grupo', description: 'Grupo y asignatura correspondiente' },
      { field: 'docente_id', referencesEntity: 'Docente', description: 'Docente que asentó la calificación' },
    ],
    relationships: [
      { targetEntity: 'Estudiante', cardinality: 'N : 1', description: 'Pertenecen al historial del estudiante' },
      { targetEntity: 'Grupo', cardinality: 'N : 1', description: 'Vinculadas a la sección académica' },
      { targetEntity: 'Docente', cardinality: 'N : 1', description: 'Ingresadas por el docente a cargo' },
    ],
    businessRules: [
      'El valor de la nota debe cumplir la restricción CHECK (valor_nota >= 0.0 AND valor_nota <= 5.0).',
      'Cualquier modificación genera obligatoriamente un registro en la bitácora de auditoría (RF-12, RNF-10).',
    ],
  },
];

export interface DeploymentNode {
  id: string;
  name: string;
  role: string;
  technology: string;
  channel: string;
  securityFeatures: string[];
  redundancySLA: string;
  iconType: 'client' | 'network' | 'compute' | 'cache' | 'database';
}

export const DEPLOYMENT_NODES: DeploymentNode[] = [
  {
    id: 'node-client',
    name: 'Dispositivos de Usuario (Clientes Web)',
    role: 'Navegadores de escritorio y móviles para 300 usuarios concurrentes.',
    technology: 'Navegadores Modernos (Chrome, Safari, Firefox, Edge) / SPA React + Tailwind CSS',
    channel: 'HTTPS / TLS 1.3 (Puerto 443)',
    securityFeatures: ['Certificado SSL/TLS con cipher suites modernas', 'Cabeceras HSTS y Content-Security-Policy', 'Protección XSS y CSRF'],
    redundancySLA: 'Tolerante a desconexión del cliente, reconexión automática.',
    iconType: 'client',
  },
  {
    id: 'node-alb',
    name: 'Reverse Proxy & Application Load Balancer (ALB)',
    role: 'Punto de entrada único, terminación TLS y balanceo de carga.',
    technology: 'AWS ALB / Google Cloud Load Balancer / Nginx Reverse Proxy',
    channel: 'HTTP/2 interno con TLS o VPC privada segura',
    securityFeatures: ['Terminación TLS 1.3', 'WAF con reglas OWASP Top 10', 'Rate-limiting contra DDoS', 'Health Checks periódicos (/healthz) cada 10s'],
    redundancySLA: 'Multi-AZ activo-activo gestionado por la nube (SLA > 99.99%).',
    iconType: 'network',
  },
  {
    id: 'node-auth0',
    name: 'Auth0 Identity Provider (IdP & RBAC)',
    role: 'Gestión externa de credenciales, MFA, sesiones OIDC/OAuth 2.0 y control de acceso RBAC bancario.',
    technology: 'Auth0 Universal Login / RS256 Asymmetric JWT / Auth0 Actions / JWKS Cache',
    channel: 'HTTPS / TLS 1.3 hacia navegador; verificación local stateless en memoria del backend (< 0.5ms)',
    securityFeatures: ['Certificación SOC 2 Type II, ISO 27001, GDPR', 'Mitigación de ataques de fuerza bruta y Credential Stuffing', 'MFA adaptativo para Docentes y Administradores'],
    redundancySLA: 'SLA garantizado de plataforma IdP > 99.9% uptime global.',
    iconType: 'network',
  },
  {
    id: 'node-backend-1',
    name: 'Contenedor Administrado 1: Next.js + TypeScript (Railway / Render)',
    role: 'Ejecución del Monolito Modular: App Router, Server Actions, Route Handlers y módulos de dominio.',
    technology: 'Next.js 15 / TypeScript 5.5 / Docker OCI Container en Railway o Render (Node.js 22 LTS)',
    channel: 'In-Process (memoria) entre módulos; TCP pool hacia PostgreSQL y S3 API hacia Cloudflare R2',
    securityFeatures: ['Ejecución en contenedor OCI no-root', 'Secretos inyectados en variables de entorno seguras', 'Aislamiento "server-only" para evitar fugas de código al bundle del cliente'],
    redundancySLA: 'Réplica activa 1 de 2. Tolerancia a fallos con conmutación en < 2 segundos.',
    iconType: 'compute',
  },
  {
    id: 'node-backend-2',
    name: 'Contenedor Administrado 2: Next.js Réplica Gemela (Railway / Render)',
    role: 'Réplica activa complementaria para balanceo de carga ante 300 usuarios concurrentes.',
    technology: 'Next.js 15 / TypeScript 5.5 / Docker OCI Container en Railway o Render (Node.js 22 LTS)',
    channel: 'In-Process (memoria) entre módulos; TCP pool hacia PostgreSQL',
    securityFeatures: ['Ejecución sin estado (Stateless)', 'Despliegues rolling sin tiempo de inactividad (Zero-Downtime)'],
    redundancySLA: 'Réplica activa 2 de 2. Asegura cumplimiento del SLA del 99.5% (RNF-03).',
    iconType: 'compute',
  },
  {
    id: 'node-worker',
    name: 'Contenedor Worker Desacoplado: Reportes & PDFs (Railway / Render)',
    role: 'Generación asíncrona de boletines, actas masivas y reportes sin límite de tiempo de ejecución.',
    technology: 'Background Worker Node.js / BullMQ / Redis / Puppeteer / @react-pdf',
    channel: 'Procesamiento de colas Redis en background; subida directa de PDFs a Cloudflare R2',
    securityFeatures: ['Event Loop aislado del tráfico web HTTP', 'Límite de memoria asignado de 2GB con auto-restart preventivo'],
    redundancySLA: 'Reintentos automáticos con backoff exponencial ante fallos de renderizado.',
    iconType: 'compute',
  },
  {
    id: 'node-db-primary',
    name: 'Base de Datos Relacional PostgreSQL 16 + Drizzle ORM (Multi-AZ)',
    role: 'Persistencia central ACID de esquemas auth, academico, matricula, calificaciones y auditoria.',
    technology: 'PostgreSQL 16 Gestionado + Drizzle ORM (SQL nativo compilado) + PgBouncer Pooler',
    channel: 'PostgreSQL Wire Protocol cifrado con SSL/TLS (verify-full)',
    securityFeatures: ['Drizzle con SELECT FOR UPDATE pesimista nativo', 'PgBouncer en transaction pooling', 'Cifrado de volumen AES-256'],
    redundancySLA: 'Failover automático Multi-AZ síncrono con RTO < 60 segundos y RPO = 0.',
    iconType: 'database',
  },
  {
    id: 'node-r2',
    name: 'Almacenamiento de Objetos Masivo: Cloudflare R2 ($0 Egress)',
    role: 'Almacenamiento de fotos de carné, actas oficiales, soportes de matrícula y PDFs generados.',
    technology: 'Cloudflare R2 Object Storage (API compatible con AWS S3) + URLs Prefirmadas',
    channel: 'HTTPS / TLS 1.3 directo entre cliente y R2 mediante Presigned URLs (bypass de backend)',
    securityFeatures: ['Bucket estrictamente privado sin acceso público', 'Presigned URLs con expiración a 5 minutos', 'Cifrado en tránsito y en reposo'],
    redundancySLA: 'Almacenamiento globalmente distribuido con durabilidad del 99.999999999% (11 9s).',
    iconType: 'cache',
  },
  {
    id: 'node-db-standby',
    name: 'PostgreSQL Standby Replica (Multi-AZ en Espera)',
    role: 'Copia síncrona en zona de disponibilidad secundaria para recuperación ante desastres.',
    technology: 'PostgreSQL Standby Streaming Replication síncrona',
    channel: 'Replicación síncrona interna cifrada de alta velocidad',
    securityFeatures: ['Aislado en zona de disponibilidad geográfica secundaria', 'Respaldos automáticos continuos (WAL archiving) a almacenamiento inmutable'],
    redundancySLA: 'Respaldo activo para cumplir RPO < 15 min y RTO < 2 horas (RNF-09).',
    iconType: 'database',
  },
];

export interface SequenceStep {
  stepNumber: number;
  from: string;
  to: string;
  label: string;
  protocol: string;
  description: string;
  latencyMs: number;
  isCritical: boolean;
  isAlternative?: boolean;
}

export const ENROLLMENT_SEQUENCE_STEPS: SequenceStep[] = [
  {
    stepNumber: 1,
    from: 'Estudiante',
    to: 'Interfaz Web (SPA)',
    label: '1. Selecciona grupos y presiona "Confirmar Matrícula"',
    protocol: 'User Interaction',
    description: 'El estudiante revisa la oferta de asignaturas y selecciona la sección deseada (ej. Grupo G01 de Cálculo I).',
    latencyMs: 0,
    isCritical: false,
  },
  {
    stepNumber: 2,
    from: 'Interfaz Web (SPA)',
    to: 'Backend API (Monolito)',
    label: '2. POST /api/matriculas { estudianteId, grupoIds, periodoId }',
    protocol: 'HTTPS / TLS 1.3 (JSON)',
    description: 'Envía la solicitud adjuntando el token JWT en la cabecera Authorization: Bearer <token>.',
    latencyMs: 45,
    isCritical: true,
  },
  {
    stepNumber: 3,
    from: 'Backend API (Monolito)',
    to: 'Módulo de Autenticación',
    label: '3. Validar Token JWT y Rol Estudiante',
    protocol: 'In-Process Call (< 0.1ms)',
    description: 'Valida criptográficamente la firma del JWT en memoria RAM y comprueba que el rol sea "ESTUDIANTE" (RF-02, RNF-01).',
    latencyMs: 1,
    isCritical: true,
  },
  {
    stepNumber: 4,
    from: 'Módulo de Matrículas',
    to: 'PostgreSQL (Base de Datos)',
    label: '4. BEGIN TRANSACTION; ISOLATION LEVEL READ COMMITTED;',
    protocol: 'TCP Pool (PgBouncer)',
    description: 'Inicia la transacción atómica local en la base de datos relacional para garantizar consistencia ACID.',
    latencyMs: 5,
    isCritical: true,
  },
  {
    stepNumber: 5,
    from: 'Módulo de Matrículas',
    to: 'PostgreSQL (Base de Datos)',
    label: '5. SELECT cupo_disponible FROM grupo WHERE id = :id FOR UPDATE;',
    protocol: 'SQL Query (Pessimistic Lock)',
    description: 'Bloqueo pesimista a nivel de fila sobre el grupo. Cualquier otra petición concurrente de los 300 usuarios se serializa de forma determinista.',
    latencyMs: 12,
    isCritical: true,
  },
  {
    stepNumber: 6,
    from: 'PostgreSQL (Base de Datos)',
    to: 'Módulo de Matrículas',
    label: '6. Retorna cupo_disponible actual (ej. 3 cupos)',
    protocol: 'SQL Result',
    description: 'La base de datos retorna el estado exacto bajo candado exclusivo de fila.',
    latencyMs: 3,
    isCritical: true,
  },
  {
    stepNumber: 7,
    from: 'Módulo de Matrículas',
    to: 'Módulo de Matrículas',
    label: '7. Validación de Reglas de Negocio en Dominio',
    protocol: 'In-Process Domain Rules',
    description: 'Verifica: a) ¿cupo_disponible > 0? (SI). b) ¿Estudiante está activo? (SI). c) ¿No está matriculado ya en este curso? (Verificación UNIQUE).',
    latencyMs: 2,
    isCritical: true,
  },
  {
    stepNumber: 8,
    from: 'Módulo de Matrículas',
    to: 'PostgreSQL (Base de Datos)',
    label: '8. UPDATE grupo SET cupo_disponible = cupo_disponible - 1;',
    protocol: 'SQL Execute',
    description: 'Decrementa atómicamente la capacidad del grupo dentro de la misma transacción.',
    latencyMs: 8,
    isCritical: true,
  },
  {
    stepNumber: 9,
    from: 'Módulo de Matrículas',
    to: 'PostgreSQL (Base de Datos)',
    label: '9. INSERT INTO matricula (...) VALUES (...);',
    protocol: 'SQL Execute',
    description: 'Inserta la cabecera y el detalle de la matrícula. Si existiese un intento duplicado, el constraint UNIQUE aborta de inmediato.',
    latencyMs: 9,
    isCritical: true,
  },
  {
    stepNumber: 10,
    from: 'Módulo de Matrículas',
    to: 'PostgreSQL (Base de Datos)',
    label: '10. COMMIT TRANSACTION;',
    protocol: 'SQL Commit',
    description: 'Confirma permanentemente los cambios y libera el bloqueo de la fila en PostgreSQL.',
    latencyMs: 10,
    isCritical: true,
  },
  {
    stepNumber: 11,
    from: 'Módulo de Matrículas',
    to: 'Módulo de Auditoría',
    label: '11. Dispatch Event: StudentEnrolledEvent',
    protocol: 'In-Process Event Bus',
    description: 'Despacha evento en memoria. El módulo de auditoría escribe asíncronamente en auditoria.bitacora_eventos sin demorar la respuesta al estudiante.',
    latencyMs: 1,
    isCritical: false,
  },
  {
    stepNumber: 12,
    from: 'Backend API (Monolito)',
    to: 'Interfaz Web (SPA)',
    label: '12. HTTP 201 Created { estado: "Confirmada", comprobante: "MAT-2026-8921" }',
    protocol: 'HTTPS / TLS 1.3 (JSON)',
    description: 'El backend devuelve respuesta JSON exitosa con el número de confirmación. Tiempo total: ~110 ms (muy por debajo de 3.0s).',
    latencyMs: 40,
    isCritical: true,
  },
  {
    stepNumber: 13,
    from: 'Interfaz Web (SPA)',
    to: 'Estudiante',
    label: '13. Renderiza comprobante oficial y horario actualizado',
    protocol: 'UI Render',
    description: 'La interfaz presenta el mensaje de confirmación, horario del curso matriculado y botón de descarga.',
    latencyMs: 15,
    isCritical: false,
  },
];

export const ENROLLMENT_EXCEPTION_STEPS: SequenceStep[] = [
  {
    stepNumber: 5,
    from: 'Módulo de Matrículas',
    to: 'PostgreSQL (Base de Datos)',
    label: '5. SELECT cupo_disponible FROM grupo ... FOR UPDATE;',
    protocol: 'SQL Query',
    description: 'Se evalúa el cupo del grupo bajo bloqueo pesimista.',
    latencyMs: 10,
    isCritical: true,
  },
  {
    stepNumber: 6,
    from: 'PostgreSQL',
    to: 'Módulo de Matrículas',
    label: '6. Retorna cupo_disponible = 0 (Agotado por solicitud previa)',
    protocol: 'SQL Result',
    description: 'Otro estudiante tomó el último cupo en la milésima de segundo anterior.',
    latencyMs: 3,
    isCritical: true,
  },
  {
    stepNumber: 7,
    from: 'Módulo de Matrículas',
    to: 'PostgreSQL',
    label: '7. ROLLBACK TRANSACTION;',
    protocol: 'SQL Rollback',
    description: 'El backend aborta la transacción inmediatamente y libera conexiones.',
    latencyMs: 4,
    isCritical: true,
    isAlternative: true,
  },
  {
    stepNumber: 8,
    from: 'Backend API',
    to: 'Interfaz Web',
    label: '8. HTTP 409 Conflict { error: "CUPO_AGOTADO" }',
    protocol: 'HTTPS Response',
    description: 'Devuelve error semántico controlado notificando la indisponibilidad de cupos sin causar sobrecupos.',
    latencyMs: 35,
    isCritical: true,
    isAlternative: true,
  },
];


export interface TraceabilityItem {
  id: string;
  rfCode: string;
  rfName: string;
  rnfMappings: {
    rnfCode: string;
    rnfName: string;
    targetCriteria: string;
    tacticApplied: string;
  }[];
  logicalComponent: string;
  componentType: 'Core Domain' | 'Support Domain' | 'Cross-Cutting' | 'Core Domain (Hotspot)';
  dbSchema: string;
  providedInterfaces: string[];
  verificationMethod: string;
}

export interface TechnicalRisk {
  id: string;
  riskCode: string;
  title: string;
  category: 'Base de Datos & Persistencia' | 'Concurrencia & Bloqueos' | 'Caché & Resiliencia';
  severity: 'Crítica' | 'Alta';
  spofComponent: string;
  failureScenario: string;
  impactOnSlaAndRnf: string;
  mitigationStrategies: {
    tactic: string;
    description: string;
    targetMetric: string;
  }[];
  verificationMechanism: string;
}

export const SGA_TRACEABILITY_MATRIX: TraceabilityItem[] = [
  {
    id: 'tr-01',
    rfCode: 'RF-01',
    rfName: 'Autenticación (Inicios y Cierres de Sesión)',
    rnfMappings: [
      {
        rnfCode: 'RNF-01',
        rnfName: 'Seguridad',
        targetCriteria: 'Criptografía Argon2id + HTTPS/TLS 1.3 obligatorio + JWT Stateless.',
        tacticApplied: 'Hashing seguro de credenciales (Argon2id con salt aleatorio), cookies HttpOnly con SameSite=Strict y expiración de tokens a 60 min.',
      },
      {
        rnfCode: 'RNF-02',
        rnfName: 'Rendimiento',
        targetCriteria: 'Validación criptográfica en memoria < 1ms; login completo < 250ms.',
        tacticApplied: 'Verificación de firma HMAC-SHA256 en memoria de la instancia sin golpear la base de datos en cada request.',
      },
      {
        rnfCode: 'RNF-03',
        rnfName: 'Disponibilidad',
        targetCriteria: 'Tolerancia a fallos multi-instancia sin sesión pegajosa (Sticky Sessions).',
        tacticApplied: 'Diseño Stateless; cualquier réplica puede validar el token sin consultar almacenamiento compartido.',
      },
      {
        rnfCode: 'RNF-04',
        rnfName: 'Escalabilidad',
        targetCriteria: 'Escalado horizontal lineal de contenedores backend.',
        tacticApplied: 'Arquitectura sin estado en sesión, permitiendo agregar réplicas tras el ALB sin sincronización de sesión.',
      },
      {
        rnfCode: 'RNF-05',
        rnfName: 'Mantenibilidad',
        targetCriteria: 'Aislamiento del módulo de identidad mediante interfaz tipada.',
        tacticApplied: 'Bounded Context auth con puerto de entrada IAuthService desacoplado de los módulos de negocio.',
      },
    ],
    logicalComponent: 'Módulo de Autenticación & Control de Acceso (RBAC)',
    componentType: 'Cross-Cutting',
    dbSchema: 'auth (auth.usuario, auth.rol, auth.usuario_rol)',
    providedInterfaces: ['IAuthService.login()', 'IAuthService.logout()', 'IAuthService.verifyToken()'],
    verificationMethod: 'Pruebas de penetración OWASP ZAP, verificación de firma JWT y pruebas de carga con k6 a 300 usuarios concurrentes.',
  },
  {
    id: 'tr-02',
    rfCode: 'RF-02',
    rfName: 'Roles y Permisos (Control RBAC Granular)',
    rnfMappings: [
      {
        rnfCode: 'RNF-01',
        rnfName: 'Seguridad',
        targetCriteria: 'Principio de menor privilegio para Administrador, Coordinador, Docente y Estudiante.',
        tacticApplied: 'Middleware RBAC interceptor a nivel de ruta y directivas de dominio en casos de uso antes de invocar repositorios.',
      },
      {
        rnfCode: 'RNF-02',
        rnfName: 'Rendimiento',
        targetCriteria: 'Resolución de permisos en tiempo constante O(1) < 0.2ms.',
        tacticApplied: 'Roles y permisos codificados en claims del JWT (firmado criptográficamente) o cacheados en memoria local.',
      },
      {
        rnfCode: 'RNF-03',
        rnfName: 'Disponibilidad',
        targetCriteria: 'Autorización ininterrumpida aun si la base de datos primaria está en failover transitorio.',
        tacticApplied: 'Evaluación de permisos en memoria de contenedor mediante claims de token autoritativo.',
      },
      {
        rnfCode: 'RNF-04',
        rnfName: 'Escalabilidad',
        targetCriteria: 'Soporte ilimitado de peticiones de validación de permisos por segundo.',
        tacticApplied: 'Verificación distribuida local en cada réplica sin bloqueos ni contención de base de datos.',
      },
      {
        rnfCode: 'RNF-05',
        rnfName: 'Mantenibilidad',
        targetCriteria: 'Matriz de permisos centralizada y extensible sin recompilar módulos clientes.',
        tacticApplied: 'Interfaz IRbacService con catálogo tipado de permisos desacoplado de la lógica de negocio.',
      },
    ],
    logicalComponent: 'Módulo de Autenticación & Control de Acceso (RBAC)',
    componentType: 'Cross-Cutting',
    dbSchema: 'auth (auth.rol, auth.permiso, auth.rol_permiso)',
    providedInterfaces: ['IRbacService.hasPermission()', 'IRbacService.getUserRoles()', 'IRbacService.assignRole()'],
    verificationMethod: 'Pruebas unitarias de cobertura al 100% en matriz RBAC y pruebas de integración de control de acceso en endpoints.',
  },
  {
    id: 'tr-03',
    rfCode: 'RF-03',
    rfName: 'Gestión de Estudiantes (CRUD & Expedientes)',
    rnfMappings: [
      {
        rnfCode: 'RNF-01',
        rnfName: 'Seguridad',
        targetCriteria: 'Acceso restringido a datos personales y estado académico (RNF-11 Privacidad).',
        tacticApplied: 'Políticas de control de acceso a nivel de fila y ofuscación de datos sensibles en respuestas de API.',
      },
      {
        rnfCode: 'RNF-02',
        rnfName: 'Rendimiento',
        targetCriteria: 'Búsquedas de expedientes por documento o código en < 150ms.',
        tacticApplied: 'Índices B-Tree compuestos en PostgreSQL sobre (codigo_estudiantil, documento_identidad) e índice trigram para nombres.',
      },
      {
        rnfCode: 'RNF-03',
        rnfName: 'Disponibilidad',
        targetCriteria: 'Consultas de sólo lectura operativas con 99.5% de disponibilidad mensual.',
        tacticApplied: 'Desvío de consultas de expedientes hacia la réplica de lectura si el nodo primario está en mantenimiento.',
      },
      {
        rnfCode: 'RNF-04',
        rnfName: 'Escalabilidad',
        targetCriteria: 'Soporte de crecimiento a más de 100,000 registros históricos sin degradación.',
        tacticApplied: 'Paginación por cursor (Cursor-based Pagination) en lugar de OFFSET/LIMIT para listas de estudiantes.',
      },
      {
        rnfCode: 'RNF-05',
        rnfName: 'Mantenibilidad',
        targetCriteria: 'Entidad de dominio Estudiante con invariantes encapsulated (DDD Aggregate).',
        tacticApplied: 'Capa de dominio pura con reglas de negocio aisladas de la base de datos mediante repositorio IStudentRepository.',
      },
    ],
    logicalComponent: 'Módulo de Gestión Académica',
    componentType: 'Core Domain',
    dbSchema: 'academico (academico.estudiante, academico.programa)',
    providedInterfaces: ['IAcademicCatalogService.searchStudents()', 'IAcademicCatalogService.getStudentDetails()', 'IStudentManagementService.updateStudentStatus()'],
    verificationMethod: 'Pruebas de integración de persistencia con Testcontainers PostgreSQL y benchmarks de latencia p95 con k6.',
  },
  {
    id: 'tr-04',
    rfCode: 'RF-07',
    rfName: 'Matrícula Académica (Inscripción & Validación de Cupos)',
    rnfMappings: [
      {
        rnfCode: 'RNF-01',
        rnfName: 'Seguridad',
        targetCriteria: 'Validación estricta de identidad: un estudiante solo puede matricular su propio expediente.',
        tacticApplied: 'Inyección de identidad extraída directamente del token JWT verificado en el contexto de la transacción.',
      },
      {
        rnfCode: 'RNF-02',
        rnfName: 'Rendimiento',
        targetCriteria: 'Tiempo de respuesta total de matrícula < 1.0s (muy inferior al SLA de 3.0s) con 300 concurrentes.',
        tacticApplied: 'Transacción ACID ultracorta sub-35ms con bloqueo pesimista a nivel de fila y liberación inmediata de conexiones.',
      },
      {
        rnfCode: 'RNF-03',
        rnfName: 'Disponibilidad',
        targetCriteria: 'Cero interrupciones durante la ventana de matrícula pico (99.5% SLA).',
        tacticApplied: 'Pooler PgBouncer con 100 conexiones calientes y timeout de bloqueo acotado a 2s para evitar encolamiento.',
      },
      {
        rnfCode: 'RNF-04',
        rnfName: 'Escalabilidad',
        targetCriteria: 'Atención elástica de picos de matrícula sin rediseño del sistema.',
        tacticApplied: 'Alineación de interfaces desacopladas en el módulo; permite extraerlo a microservicio independiente si la concurrencia supera 50k.',
      },
      {
        rnfCode: 'RNF-05',
        rnfName: 'Mantenibilidad',
        targetCriteria: 'Reglas de negocio de matrícula encapsuladas en un Aggregate Root de Dominio.',
        tacticApplied: 'IEnrollmentService expone métodos claros (enrollStudent, cancelEnrollment) y emite eventos Domain Events en memoria.',
      },
    ],
    logicalComponent: 'Módulo de Matrículas (Hotspot Concurrente)',
    componentType: 'Core Domain (Hotspot)',
    dbSchema: 'matricula (matricula.matricula, matricula.detalle_matricula) y academico (academico.grupo)',
    providedInterfaces: ['IEnrollmentService.enrollStudent()', 'IEnrollmentService.cancelEnrollment()', 'IEnrollmentService.checkAvailableQuotas()'],
    verificationMethod: 'Pruebas de estrés y condición de carrera concurrentes con k6 (300 VU simultáneos sobre el último cupo) para verificar cero sobrecupos.',
  },
  {
    id: 'tr-05',
    rfCode: 'RF-08',
    rfName: 'Registro de Calificaciones (Captura & Publicación)',
    rnfMappings: [
      {
        rnfCode: 'RNF-01',
        rnfName: 'Seguridad',
        targetCriteria: 'Aislamiento docente: un profesor solo puede registrar notas en sus grupos asignados.',
        tacticApplied: 'Verificación obligatoria de asignación docente-grupo en capa de dominio antes de permitir INSERT/UPDATE.',
      },
      {
        rnfCode: 'RNF-02',
        rnfName: 'Rendimiento',
        targetCriteria: 'Guardado masivo de planillas (hasta 45 notas de grupo) en < 300ms.',
        tacticApplied: 'Operación Bulk-Upsert SQL en una única sentencia transaccional en lugar de múltiples inserts individuales.',
      },
      {
        rnfCode: 'RNF-03',
        rnfName: 'Disponibilidad',
        targetCriteria: 'Registro ininterrumpido en cierres de corte evaluativo.',
        tacticApplied: 'Transacciones aisladas por grupo evitando bloqueos de tabla completa y asegurando disponibilidad 99.5%.',
      },
      {
        rnfCode: 'RNF-04',
        rnfName: 'Escalabilidad',
        targetCriteria: 'Soporte de cientos de grupos registrando notas simultáneamente.',
        tacticApplied: 'Bloqueos mínimos a nivel de fila y recalculo asíncrono de estadísticas generales para no bloquear la transacción principal.',
      },
      {
        rnfCode: 'RNF-05',
        rnfName: 'Mantenibilidad',
        targetCriteria: 'Separación estricta entre cálculo ponderado de notas y persistencia.',
        tacticApplied: 'Servicio de dominio GradeCalculator puro (sin dependencias de base de datos) testeable con pruebas unitarias rápidas.',
      },
    ],
    logicalComponent: 'Módulo de Calificaciones',
    componentType: 'Core Domain',
    dbSchema: 'calificaciones (calificaciones.calificacion, calificaciones.evaluacion, calificaciones.acta)',
    providedInterfaces: ['IGradingService.submitGrades()', 'IGradingService.getGroupRosterWithGrades()', 'IGradingService.closeGradingPeriod()'],
    verificationMethod: 'Pruebas unitarias de cálculo ponderado al 100% de cobertura y pruebas de integración transaccional con auditoría cruzada.',
  },
];

export const TECHNICAL_RISKS_AND_SPOF: TechnicalRisk[] = [
  {
    id: 'risk-01',
    riskCode: 'SPOF-01',
    title: 'Punto Único de Falla y Saturación de Conexiones en el Nodo Primario de PostgreSQL',
    category: 'Base de Datos & Persistencia',
    severity: 'Crítica',
    spofComponent: 'PostgreSQL Relacional Primario (Master Node)',
    failureScenario: 'Al implementar un monolito modular con base de datos compartida, una caída física del servidor de base de datos primario o el agotamiento del pool de conexiones ante 300 usuarios concurrentes paraliza por completo todos los módulos del SGA (Autenticación, Matrículas, Docentes y Calificaciones).',
    impactOnSlaAndRnf: 'Violación directa del SLA de Disponibilidad mensual del 99.5% (RNF-03) e incumplimiento del tiempo de respuesta < 3.0s (RNF-02) por encolamiento extremo de conexiones.',
    mitigationStrategies: [
      {
        tactic: 'Topología Multi-AZ con Failover Síncrono Automático',
        description: 'Desplegar PostgreSQL en configuración Multi-AZ (ej. AWS RDS / Cloud SQL) con réplica Standby síncrona en una segunda zona de disponibilidad. En caso de fallo del nodo maestro, el failover automatizado conmuta el tráfico en < 60 segundos con RPO=0 (cero pérdida de transacciones).',
        targetMetric: 'RPO = 0, RTO < 60 segundos, Uptime > 99.8%',
      },
      {
        tactic: 'Multiplexación de Conexiones con PgBouncer en Modo Transaccional',
        description: 'Interponer un pooler PgBouncer con pool_mode = transaction entre las réplicas backend y PostgreSQL. Esto permite atender 300 clientes concurrentes consumiendo únicamente un pool estricto de 80 a 100 conexiones reales al motor, evitando saturar la memoria RAM y el swap del servidor de base de datos.',
        targetMetric: 'Uso de conexiones < 30% del límite de PostgreSQL',
      },
      {
        tactic: 'Segregación de Cargas mediante Réplica de Sólo Lectura (Read Replica)',
        description: 'Separar el tráfico pesado de consultas de reportes (RF-10) y catálogos de estudiantes hacia una réplica Read-Only, reservando el nodo primario de forma exclusiva para escrituras críticas (matrículas y notas).',
        targetMetric: 'Reducción del 60% de I/O en el nodo de escritura',
      },
    ],
    verificationMechanism: 'Simulación de inyección de fallas (Chaos Engineering) forzando el reinicio del nodo primario durante una prueba de carga k6 a 300 VU, validando que el failover se complete en < 60s sin corrupción de datos.',
  },
  {
    id: 'risk-02',
    riskCode: 'SPOF-02',
    title: 'Contención Extrema por Bloqueos de Fila (Lock Contention) en Grupos de Alta Demanda en Matrícula',
    category: 'Concurrencia & Bloqueos',
    severity: 'Alta',
    spofComponent: 'Fila bloqueada en academico.grupo (Row-Level Locking con SELECT ... FOR UPDATE)',
    failureScenario: 'Durante la apertura de matrícula, si 150 estudiantes intentan inscribir simultáneamente el mismo grupo popular con pocos cupos, las transacciones intentan adquirir el candado exclusivo FOR UPDATE sobre el mismo registro. Esto crea una cola profunda de bloqueos, donde las transacciones encoladas retienen conexiones y workers HTTP, pudiendo disparar timeouts superiores a 3.0 segundos.',
    impactOnSlaAndRnf: 'Violación del RNF-02 (Latencia < 3.0s en el p95) y riesgo de agotamiento del hilo de peticiones de los contenedores backend.',
    mitigationStrategies: [
      {
        tactic: 'Transacciones Transaccionales Ultracortas (< 35ms)',
        description: 'Validar toda la elegibilidad del estudiante (estado activo, programa, prerrequisitos de la asignatura) en memoria de la aplicación ANTES de abrir la transacción de base de datos. El bloqueo FOR UPDATE se mantiene únicamente por 10 a 25ms para evaluar cupo_disponible y decrementar.',
        targetMetric: 'Duración de transacción < 35ms',
      },
      {
        tactic: 'Configuración de Timeout de Bloqueo Estricto (lock_timeout = 2s)',
        description: 'Establecer SET LOCAL lock_timeout = "2s" en PostgreSQL. Si una solicitud de matrícula no puede adquirir el bloqueo en 2 segundos debido a saturación, la transacción se aborta limpiamente y devuelve HTTP 409 Conflict con mensaje amigable al estudiante, en lugar de bloquear el contenedor web indefinidamente.',
        targetMetric: 'Cero transacciones colgadas > 2.0s (SLA garantizado)',
      },
      {
        tactic: 'Ventanas Escalonadas de Matrícula (Staggered Cohorts)',
        description: 'Planificar la apertura de matrículas por franjas horarias basadas en semestre, programa o mérito académico (ej. 75 estudiantes por franja), distribuyendo el pico de concurrencia a lo largo del día y aplanando la curva de contención sobre los mismos grupos.',
        targetMetric: 'Máximo 50 usuarios concurrentes compitiendo por un mismo programa',
      },
    ],
    verificationMechanism: 'Pruebas de estrés concurrentes con k6 inyectando 300 peticiones simultáneas sobre un único grupo con 5 cupos disponibles, verificando que 5 transacciones resulten exitosas, 295 en HTTP 409 controlado, y cero latencias superiores a 2.5s.',
  },
  {
    id: 'risk-03',
    riskCode: 'SPOF-03',
    title: 'Efecto Avalancha por Falla o Caída de la Capa de Caché (Redis Cache Stampede & Thundering Herd)',
    category: 'Caché & Resiliencia',
    severity: 'Alta',
    spofComponent: 'Redis 7 L2 In-Memory Cache (Clúster de Catálogo y Horarios)',
    failureScenario: 'Si la instancia de Redis experimenta un fallo de memoria, reinicio o expiración simultánea de claves durante el periodo de inscripción, el 75% del tráfico de 300 usuarios que normalmente respondía desde caché en < 15ms impactará de forma masiva y simultánea contra PostgreSQL, saturando el CPU y los discos del motor relacional.',
    impactOnSlaAndRnf: 'Degradación severa del tiempo de respuesta (disparándose a 5-10 segundos, violando RNF-02) y potencial caída en cascada hacia la persistencia transaccional.',
    mitigationStrategies: [
      {
        tactic: 'Patrón Cache-Aside con Mutex/Probabilistic Refresh (Probabilistic Early Expiration)',
        description: 'Cuando la clave de oferta académica está próxima a expirar o expira, solo la primera petición adquiere un candado distribuido ligero para refrescar el catálogo en PostgreSQL; las demás peticiones concurrentes continúan sirviéndose de la versión en memoria ligeramente obsoleta (Stale-While-Revalidate) sin golpear la base de datos.',
        targetMetric: 'Cero avalanchas masivas sobre la base de datos relacional',
      },
      {
        tactic: 'Fallback Resiliente con Circuit Breaker y Caché Local en Memoria de Instancia',
        description: 'Implementar un Circuit Breaker en el backend: si Redis deja de responder o su latencia supera los 100ms, el circuito se abre y el backend conmuta de inmediato a una pequeña caché LRU en la memoria RAM del contenedor Node.js (TTL 30s), amortiguando las lecturas sin degradar a los usuarios.',
        targetMetric: 'Continuidad operativa en modo degradado transparente al usuario',
      },
      {
        tactic: 'Redis Sentinel / Modo Clúster con Réplica en Standby',
        description: 'Desplegar Redis con replicación primaria y réplica asistida por Redis Sentinel con failover automático en menos de 5 segundos, evitando que un fallo del nodo de caché sea permanente.',
        targetMetric: 'Disponibilidad de la capa de caché > 99.9%',
      },
    ],
    verificationMechanism: 'Prueba de caos cortando la conexión hacia Redis durante una prueba de carga activa con 300 usuarios; verificación de que el Circuit Breaker conmuta a memoria local y la latencia se mantiene < 800ms sin elevar el uso de CPU de PostgreSQL por encima del 40%.',
  },
];

export interface CloudDecision {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  techStack: string;
  architecturalRole: string;
  justification: string;
  technicalRisks: {
    risk: string;
    probability: 'Baja' | 'Media' | 'Alta';
    impact: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
    failureScenario: string;
  }[];
  operationalMitigationPlan: {
    pillar: 'Arquitectura & Código' | 'Operación & Despliegue' | 'Observabilidad & SLOs' | 'Runbooks & Contingencia';
    tactic: string;
    implementationDetails: string;
    targetMetric: string;
  }[];
  costAndSlaBenefits: string;
}

export const CLOUD_INFRASTRUCTURE_DECISIONS: CloudDecision[] = [
  {
    id: 'cloud-dec-1',
    number: 1,
    title: 'Frontend y Backend Unificado con Next.js y TypeScript (Tipado Estricto End-to-End)',
    shortTitle: 'Next.js & TypeScript Unificado',
    techStack: 'Next.js 15 (App Router, Server Actions, Route Handlers) + TypeScript 5.5 + Zod 3',
    architecturalRole: 'Monolito fullstack unificado que comparte modelos de dominio, validaciones de esquema y contratos de API en un único repositorio tipado.',
    justification: 'Garantiza tipado estricto de extremo a extremo sin desincronización de contratos de red. Elimina la duplicación de DTOs entre cliente y servidor, acelera el tiempo de desarrollo en un 40% y simplifica el pipeline de CI/CD a un solo artefacto.',
    technicalRisks: [
      {
        risk: 'Fuga de dependencias y código de servidor al bundle del cliente (Server-Client Leaks)',
        probability: 'Media',
        impact: 'Alto',
        failureScenario: 'Un desarrollador importa accidentalmente un repositorio de base de datos o secretos en un componente con directiva "use client", inflando el tamaño del bundle en varios megabytes o exponiendo credenciales en el navegador.',
      },
      {
        risk: 'Saturación de memoria por Server-Side Rendering (SSR) dinámico ante 300 concurrentes',
        probability: 'Media',
        impact: 'Alto',
        failureScenario: 'El renderizado SSR intensivo de páginas dinámicas en el servidor compite por los ciclos de CPU y memoria del proceso Node.js con las peticiones transaccionales de matrícula y notas, degradando la latencia general.',
      },
      {
        risk: 'Violación de los Bounded Contexts por importaciones anárquicas dentro del monorepo',
        probability: 'Media',
        impact: 'Medio',
        failureScenario: 'Al estar en el mismo proyecto, los componentes de interfaz de usuario de Calificaciones terminan acoplándose a entidades internas de Matrículas sin pasar por las interfaces públicas del dominio.',
      },
    ],
    operationalMitigationPlan: [
      {
        pillar: 'Arquitectura & Código',
        tactic: 'Aislamiento de runtime con paquete "server-only" y validación Zod',
        implementationDetails: 'Uso obligatorio del paquete "server-only" en todas las capas de persistencia y servicios de dominio. Reglas de ESLint para bloquear imports cruzados de servidor a cliente. Validación bidireccional con esquemas Zod en todas las entradas de Route Handlers y Server Actions.',
        targetMetric: 'Cero bytes de servidor en bundles de cliente; 100% de payloads validados.',
      },
      {
        pillar: 'Arquitectura & Código',
        tactic: 'Estrategia de renderizado híbrido (SSG/ISR + Client-Side Fetching)',
        implementationDetails: 'Pre-renderizar estáticamente con Incremental Static Regeneration (ISR) el catálogo de asignaturas y la oferta pública. En las vistas autenticadas de estudiantes y docentes, utilizar Client-Side Fetching con React Query sobre Route Handlers, liberando a Node.js de tareas de renderizado HTML pesado.',
        targetMetric: 'Utilización de CPU en contenedor Next.js < 25% con 300 concurrentes.',
      },
      {
        pillar: 'Operación & Despliegue',
        tactic: 'Límites estrictos de módulos mediante arquitectura hexagonal interna',
        implementationDetails: 'Estructurar el código bajo /src/modules/{auth,academico,matricula,calificaciones} con índices de exportación estrictos (public-api.ts). Aplicar "eslint-plugin-boundaries" en el pipeline de CI para impedir dependencias circulares entre módulos.',
        targetMetric: 'Grafo de dependencias 100% acíclico validado en CI.',
      },
      {
        pillar: 'Observabilidad & SLOs',
        tactic: 'Monitoreo de Core Web Vitals y latencia de Server Actions',
        implementationDetails: 'Instrumentar OpenTelemetry en Next.js para trazar la duración de Route Handlers y Server Actions de forma independiente. Alertar si el TTFB (Time to First Byte) supera los 400ms en el p95.',
        targetMetric: 'TTFB p95 < 400ms, LCP < 1.8s en clientes web.',
      },
    ],
    costAndSlaBenefits: 'Ahorro de $120/mes en infraestructura al no requerir servidores backend y frontend separados; despliegue unificado y tipado estricto libre de errores de serialización.',
  },
  {
    id: 'cloud-dec-2',
    number: 2,
    title: 'Despliegue en Contenedores Administrados (Railway o Render)',
    shortTitle: 'Contenedores PaaS (Railway / Render)',
    techStack: 'Railway / Render Web Services (Docker OCI Container, Node.js 22 LTS, Alpine Linux)',
    architecturalRole: 'Entorno de ejecución continuo y persistente que aloja el monolito modular y workers de fondo sin límites de timeout de ejecución Serverless.',
    justification: 'Evita los timeouts estrictos de las plataformas Serverless (como los 10-60s de Vercel/AWS Lambda), permitiendo la generación de actas académicas pesadas, consolidados en PDF y exportaciones masivas a CSV sin interrupciones. Mantiene conexiones persistentes calientes con PostgreSQL.',
    technicalRisks: [
      {
        risk: 'Bloqueo del Event Loop de Node.js por generación síncrona de reportes pesados en PDF',
        probability: 'Alta',
        impact: 'Crítico',
        failureScenario: 'Si un docente genera un reporte en PDF de 500 páginas mediante Puppeteer o React-PDF de forma síncrona en el hilo principal de Next.js, congela el Event Loop de la instancia, impidiendo responder a las peticiones de los otros 300 usuarios.',
      },
      {
        risk: 'Saturación de memoria RAM en el contenedor por fuga o sobrecarga de procesos',
        probability: 'Media',
        impact: 'Alto',
        failureScenario: 'Procesos de renderizado de reportes consumen más RAM de la asignada (ej. 2GB), provocando un evento Out-Of-Memory (OOM) y el reinicio forzado del contenedor durante horas pico.',
      },
      {
        risk: 'Tolerancia limitada a caídas de proveedor PaaS si se opera en instancia única',
        probability: 'Baja',
        impact: 'Crítico',
        failureScenario: 'Si se despliega una sola instancia en Railway o Render, cualquier mantenimiento del hipervisor subyacente provoca downtime de 2 a 5 minutos, violando el SLA del 99.5%.',
      },
    ],
    operationalMitigationPlan: [
      {
        pillar: 'Operación & Despliegue',
        tactic: 'Arquitectura desacoplada: Contenedor Web/API + Contenedor Background Worker',
        implementationDetails: 'Desplegar 2 réplicas del contenedor Web para tráfico interactivo HTTP, y 1 contenedor independiente (Worker Service) en Railway/Render dedicado exclusivamente a procesar tareas pesadas de la cola BullMQ/Redis (generación de PDFs y exportaciones).',
        targetMetric: 'El Event Loop del contenedor Web nunca supera el 10% de retardo (< 20ms).',
      },
      {
        pillar: 'Operación & Despliegue',
        tactic: 'Configuración Multi-Instancia con Health Checks y Auto-Restart',
        implementationDetails: 'Configurar mínimo 2 réplicas activas tras el balanceador interno de Railway/Render. Definir endpoint /api/healthz que verifica conectividad a BD y memoria RAM disponible. En caso de falla, el tráfico se redirige a la réplica sana en < 2 segundos.',
        targetMetric: 'Disponibilidad de la capa de cómputo > 99.8% (supera SLA de 99.5%).',
      },
      {
        pillar: 'Observabilidad & SLOs',
        tactic: 'Límites de recursos en contenedor y alertas de memoria a 75%',
        implementationDetails: 'Asignar flags de Node.js: NODE_OPTIONS="--max-old-space-size=1536". Configurar alertas vía Webhook en Slack/PagerDuty si el uso de memoria del contenedor supera el 75% durante más de 3 minutos consecutivos.',
        targetMetric: 'Cero caídas por OOM; reinicios ordenados preventivos.',
      },
      {
        pillar: 'Runbooks & Contingencia',
        tactic: 'Procedimiento de escala vertical de emergencia en 1 clic',
        implementationDetails: 'Documentar runbook operativo para escalar el servicio de 2GB a 4GB/8GB en el panel de Railway/Render durante el primer día de matrícula masiva si la contención se eleva.',
        targetMetric: 'Escalado completado en < 90 segundos sin interrupción de servicio.',
      },
    ],
    costAndSlaBenefits: 'Costo predecible de $20 a $45 USD/mes por contenedor con tiempo de ejecución ilimitado, eliminando sobrecostos inesperados de Serverless invocations.',
  },
  {
    id: 'cloud-dec-3',
    number: 3,
    title: 'Base de Datos PostgreSQL con Drizzle ORM (Máxima Velocidad & Tipado SQL Nativo)',
    shortTitle: 'PostgreSQL & Drizzle ORM',
    techStack: 'PostgreSQL 16 (Managed) + Drizzle ORM + Drizzle Kit + PgBouncer',
    architecturalRole: 'Capa de persistencia relacional transaccional ACID con acceso tipado sin overhead de abstracción.',
    justification: 'Drizzle ORM compila directamente a sentencias SQL nativas tipadas en tiempo de desarrollo con cero sobrecarga en runtime (Zero-Overhead), a diferencia de Prisma que ejecuta un binario Rust intermediario y consume más de 50MB adicionales de memoria. Soporta bloqueos SELECT FOR UPDATE nativos para matrícula.',
    technicalRisks: [
      {
        risk: 'Agotamiento del pool de conexiones (Connection Starvation) por falta de pooling transaccional',
        probability: 'Alta',
        impact: 'Crítico',
        failureScenario: 'Si las réplicas de Next.js abren conexiones directas a PostgreSQL sin un proxy de pooling, 300 peticiones concurrentes superan el límite de max_connections (ej. 100) del servidor de base de datos, arrojando errores "too many clients".',
      },
      {
        risk: 'Migraciones de esquema destructivas o bloqueantes en producción',
        probability: 'Media',
        impact: 'Crítico',
        failureScenario: 'Una ejecución descuidada de drizzle-kit push o una alteración de tabla sin cláusulas concurrentes bloquea la tabla academico.grupo con un ACCESS EXCLUSIVE LOCK durante horas de matrícula.',
      },
      {
        risk: 'Consultas lentas no indexadas en filtros complejos del módulo académico',
        probability: 'Media',
        impact: 'Alto',
        failureScenario: 'Búsquedas de estudiantes y actas sin índices compuestos provocan escaneos secuenciales (Seq Scans), elevando el CPU de PostgreSQL al 100% y violando el RNF-02 (< 3.0s).',
      },
    ],
    operationalMitigationPlan: [
      {
        pillar: 'Arquitectura & Código',
        tactic: 'Pool de conexiones PgBouncer administrado en modo transaccional',
        implementationDetails: 'Configurar conexión de Drizzle a través de la URL de PgBouncer (pool_mode=transaction) con un límite estricto de conexiones por réplica (ej. 15 conexiones por contenedor). Esto permite atender 300 clientes concurrentes consumiendo menos de 40 conexiones reales en PostgreSQL.',
        targetMetric: 'Uso de conexiones < 40% del límite máximo de PostgreSQL.',
      },
      {
        pillar: 'Operación & Despliegue',
        tactic: 'Pipeline de migraciones seguras con validación no bloqueante',
        implementationDetails: 'Prohibir drizzle-kit push en producción. Las migraciones se generan con drizzle-kit generate y se revisan en Pull Requests. Se ejecutan en un paso de pre-despliegue en CI con sentencias CREATE INDEX CONCURRENTLY y timeouts de bloqueo breves (lock_timeout = 2s).',
        targetMetric: 'Cero caídas o bloqueos de tabla prolongados en despliegues.',
      },
      {
        pillar: 'Observabilidad & SLOs',
        tactic: 'Monitoreo de consultas lentas con pg_stat_statements y P95 Query Tracker',
        implementationDetails: 'Activar pg_stat_statements para registrar consultas con duración > 100ms. Configurar alarmas si el percentil p95 de transacciones de matrícula supera los 40ms.',
        targetMetric: 'Transacción de matrícula p95 < 35ms; cero consultas lentas no indexadas.',
      },
      {
        pillar: 'Runbooks & Contingencia',
        tactic: 'Procedimiento de kill de transacciones colgadas y failover de réplica',
        implementationDetails: 'Script automatizado de guardia para detectar y ejecutar pg_terminate_backend() sobre conexiones en estado idle in transaction durante más de 10 segundos.',
        targetMetric: 'Liberación automática de bloqueos en < 15 segundos.',
      },
    ],
    costAndSlaBenefits: 'Rendimiento 3x superior a Prisma con latencias sub-10ms en lecturas indexadas; costo optimizado en instancias medianas de PostgreSQL ($25 - $50 USD/mes).',
  },
  {
    id: 'cloud-dec-4',
    number: 4,
    title: 'Delegación de Autenticación y RBAC a Auth0 (Cumplimiento Normativo & Seguridad Bancaria)',
    shortTitle: 'Auth0 IdP & RBAC',
    techStack: 'Auth0 Universal Login + OpenID Connect (OIDC) + OAuth 2.0 + RS256 JWT + Auth0 Actions',
    architecturalRole: 'Proveedor de identidad (IdP) empresarial de grado bancario que gestiona credenciales, MFA, sesiones seguras y control de acceso basado en roles.',
    justification: 'Cumplimiento normativo riguroso (SOC 2, GDPR, ISO 27001) sin almacenar hashes de contraseñas localmente. Protección nativa contra ataques de fuerza bruta, credential stuffing y soporte inmediato de Multi-Factor Authentication (MFA) para administradores y docentes.',
    technicalRisks: [
      {
        risk: 'Dependencia de un tercero y latencia de red en cada validación de token',
        probability: 'Alta',
        impact: 'Crítico',
        failureScenario: 'Si el backend consulta la API de Auth0 (/userinfo) en cada petición HTTP entrante, añade entre 80ms y 250ms de latencia de red a cada consulta de los 300 usuarios, además de exponerse a cortes en la API de Auth0.',
      },
      {
        risk: 'Desincronización entre roles de Auth0 y estado del estudiante en la base de datos local',
        probability: 'Media',
        impact: 'Alto',
        failureScenario: 'Un coordinador académico desactiva a un estudiante en el SGA local, pero el token de Auth0 sigue activo hasta su expiración, permitiéndole matricular asignaturas indebidamente.',
      },
      {
        risk: 'Costos desproporcionados por usuarios activos mensuales (MAU) si no se optimiza el plan',
        probability: 'Media',
        impact: 'Medio',
        failureScenario: 'Al superar el tier gratuito de 7,500 MAU durante periodos de inscripción, los costos pueden escalar drásticamente si no se implementa una política clara de ciclo de vida de usuarios.',
      },
    ],
    operationalMitigationPlan: [
      {
        pillar: 'Arquitectura & Código',
        tactic: 'Validación Stateless local de JWT con claves públicas JWKS cacheadas',
        implementationDetails: 'El backend Next.js valida criptográficamente la firma del JWT en memoria local utilizando el conjunto de claves JWKS de Auth0 (https://<tenant>.auth0.com/.well-known/jwks.json) con caché en memoria RAM. Cero llamadas de red a Auth0 durante las peticiones comunes.',
        targetMetric: 'Tiempo de validación de token en backend < 0.5ms.',
      },
      {
        pillar: 'Arquitectura & Código',
        tactic: 'Custom Claims en Token vía Auth0 Actions y validación de estado local',
        implementationDetails: 'Implementar una Auth0 Post-Login Action que inyecte los roles (ADMIN, COORDINADOR, DOCENTE, ESTUDIANTE) y el usuario_id directamente en los claims del token JWT. Adicionalmente, el Módulo de Matrículas valida en su transacción el campo "estado_academico = Activo" en PostgreSQL, neutralizando tokens huérfanos.',
        targetMetric: 'Cero discrepancias de autorización; control de menor privilegio estricto.',
      },
      {
        pillar: 'Operación & Despliegue',
        tactic: 'Webhooks de sincronización de identidad bidireccional',
        implementationDetails: 'Configurar Auth0 Log Streaming y Webhooks firmados con HMAC-SHA256 hacia el backend para eventos de cambio de contraseña, bloqueo de usuario y actualización de perfil, manteniendo la tabla local auth.usuario actualizada.',
        targetMetric: 'Sincronización de eventos de identidad en tiempo real (< 2s).',
      },
      {
        pillar: 'Runbooks & Contingencia',
        tactic: 'Manejo de incidentes de proveedor IdP y monitoreo de cuotas MAU',
        implementationDetails: 'Monitorear el endpoint de estado de Auth0 (status.auth0.com). En caso de degradación de Auth0, los tokens ya emitidos continúan siendo válidos hasta por 60 minutos sin afectar a los usuarios en sesión activa.',
        targetMetric: 'Resiliencia ante degradaciones externas del IdP durante sesiones activas.',
      },
    ],
    costAndSlaBenefits: 'Eliminación del 100% de la responsabilidad legal sobre custodia de contraseñas; SLA del 99.9% garantizado por Auth0 y cumplimiento normativo inmediato.',
  },
  {
    id: 'cloud-dec-5',
    number: 5,
    title: 'Almacenamiento de Archivos Masivos en Cloudflare R2 (Cero Costos de Egress)',
    shortTitle: 'Cloudflare R2 Storage ($0 Egress)',
    techStack: 'Cloudflare R2 Object Storage + AWS S3 SDK v3 + URLs Prefirmadas (Presigned URLs)',
    architecturalRole: 'Almacenamiento de objetos masivo y seguro para fotos de carné, actas de notas firmadas, recibos y PDFs de matrícula.',
    justification: 'Cloudflare R2 no cobra tarifas de transferencia de salida (Zero Egress Fees), a diferencia de AWS S3 que cobra $0.09 USD por GB descargado. Al descargar miles de boletines y fotos por 300 estudiantes y docentes, el costo se reduce a prácticamente $0 USD en ancho de banda.',
    technicalRisks: [
      {
        risk: 'Fuga de privacidad por buckets configurados indebidamente con acceso público',
        probability: 'Baja',
        impact: 'Crítico',
        failureScenario: 'Si el bucket de Cloudflare R2 se expone públicamente, terceros no autorizados podrían acceder a documentos confidenciales de estudiantes o actas oficiales de notas, violando normativas de protección de datos personales (RNF-11).',
      },
      {
        risk: 'Cuello de botella en el servidor si las subidas o descargas pasan como proxy por el backend',
        probability: 'Media',
        impact: 'Alto',
        failureScenario: 'Si los archivos grandes se cargan al servidor Next.js y este los reenvía a R2, se satura el ancho de banda del contenedor y la memoria RAM, degradando las transacciones de matrícula concurrentes.',
      },
      {
        risk: 'Archivos huérfanos generados por subidas incompletas o transacciones abortadas',
        probability: 'Alta',
        impact: 'Bajo',
        failureScenario: 'Un usuario sube un archivo pero cancela el formulario antes de guardar la referencia en PostgreSQL, acumulando objetos sin propietario en el bucket a lo largo del tiempo.',
      },
    ],
    operationalMitigationPlan: [
      {
        pillar: 'Arquitectura & Código',
        tactic: 'Subida y descarga directa mediante URLs Prefirmadas (Presigned URLs)',
        implementationDetails: 'El cliente solicita una URL de subida temporal al backend (POST /api/storage/presign) con expiración a 5 minutos, validación estricta de tamaño (máx. 10MB) y tipo MIME permitido. El navegador sube el binario directamente a R2 sin consumir memoria ni ancho de banda del contenedor Next.js.',
        targetMetric: 'Consumo de ancho de banda del servidor Next.js para archivos = 0 MB/s.',
      },
      {
        pillar: 'Arquitectura & Código',
        tactic: 'Buckets estrictamente privados con autorización previa en backend',
        implementationDetails: 'El bucket de Cloudflare R2 se mantiene con acceso público 100% deshabilitado. La lectura de archivos sensibles (actas, certificados) requiere que el backend valide el JWT y el rol del usuario antes de emitir una Presigned Download URL con expiración de 60 segundos.',
        targetMetric: 'Acceso no autorizado bloqueado al 100% (cero exposición de datos sensibles).',
      },
      {
        pillar: 'Operación & Despliegue',
        tactic: 'Políticas de ciclo de vida (Lifecycle Rules) para archivos huérfanos',
        implementationDetails: 'Configurar reglas de ciclo de vida en R2 para eliminar automáticamente archivos en la carpeta temporal /uploads/temp/ que tengan más de 24 horas sin haber sido asociados formalmente a un registro de base de datos.',
        targetMetric: 'Cero acumulación de archivos huérfanos; costos de almacenamiento estables.',
      },
      {
        pillar: 'Observabilidad & SLOs',
        tactic: 'Auditoría de acceso a objetos y Edge Caching perimetral',
        implementationDetails: 'Para fotos públicas de carné autorizadas, servir a través de Cloudflare CDN con Edge Caching perimetral activado (Cache-Control: public, max-age=86400). Registrar descargas de actas en el módulo de auditoría local.',
        targetMetric: 'Tiempo de carga de imágenes < 80ms vía CDN; 100% de descargas de actas auditadas.',
      },
    ],
    costAndSlaBenefits: 'Cero costos de ancho de banda de salida ($0.00 Egress); costo de almacenamiento < $1 USD/mes para el volumen universitario habitual.',
  },
];
