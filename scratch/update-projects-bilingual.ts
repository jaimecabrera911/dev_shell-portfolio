import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not defined in .env.local");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });

const BILINGUAL_PROJECTS = [
  {
    id: 'lumina-analytics',
    title: 'Plataforma Analítica Lumina',
    titleEn: 'Lumina Analytics Platform',
    description: 'Motor de procesamiento de datos en tiempo real que maneja más de 10k eventos/seg con infraestructura serverless.',
    descriptionEn: 'Real-time data processing engine handling 10k+ events/sec with serverless infrastructure.',
    challenges: 'Escalar canalizaciones de ingesta analítica en tiempo real para entornos de alto tráfico (más de 10,000 operaciones por segundo) sin causar costosos bloqueos de base de datos, cuellos de botella de red o altas latencias de arranque en frío.',
    challengesEn: 'Scaling real-time analytics ingestion pipelines for high-traffic environments (10,000+ operations/second) without causing expensive database locking, network bottlenecks, or high cold-start latencies.',
    solutions: 'Diseñó una canalización de procesamiento de flujo serverless utilizando AWS Lambda y Amazon Kinesis Data Streams para almacenamiento en búfer de alta velocidad. Integró DynamoDB para almacenamiento en caliente de milisegundos de un solo dígito, junto con un programa de agregación incremental para persistir vistas analíticas resumidas en PostgreSQL.',
    solutionsEn: 'Designed an elegant, serverless stream-processing pipeline using AWS Lambda and Amazon Kinesis Data Streams for high-velocity buffering. Integrated DynamoDB for single-digit millisecond hot storage, paired with an incremental aggregation schedule to persist summarized analytical views in PostgreSQL.',
    businessImpact: 'Reducción del 30% en costos de infraestructura cloud al consolidar funciones serverless, con una ingesta de telemetría de eventos con cero pérdidas.',
    businessImpactEn: '30% reduction in cloud infrastructure costs by consolidating serverless functions, with zero-loss event telemetry ingestion.'
  },
  {
    id: 'calyx-cache',
    title: 'Caché Distribuida Calyx',
    titleEn: 'Calyx Distributed Cache',
    description: 'Capa de caché de alta disponibilidad con descubrimiento peer-to-peer y protocolos de consistencia eventual.',
    descriptionEn: 'High-availability caching layer with peer-to-peer discovery and eventual consistency protocols.',
    challenges: 'Minimizar las latencias de solicitud entre clústeres, prevenir los efectos de tormenta por retraso de replicación y mantener listas de membresía dinámicas en nodos de orquestación de contenedores sin depender de un coordinador central único.',
    challengesEn: 'Minimizing cross-cluster request latencies, preventing replication lag storm-effects, and maintaining dynamic membership lists in container orchestration nodes without relying on a single central coordinator.',
    solutions: 'Desarrolló un protocolo de chismes descentralizado personalizado en Go que implementa reglas de membresía SWIM, combinado con una estructura de anillo de hash consistente y filtros Bloom para ubicar claves de caché instantáneamente entre pares activos.',
    solutionsEn: 'Developed a custom decentralized gossip protocol in Go implementing SWIM membership rules, combined with a consistent hashing ring structure and Bloom filters to locate cache keys instantly across active peers.',
    businessImpact: 'Disminución de latencias del API del 95% al percentil 99 (p99 < 12ms), evitando sobrecargas de base de datos relacional.',
    businessImpactEn: '95% decrease in API latencies to p99 percentile (< 12ms), avoiding relational database overloads.'
  },
  {
    id: 'nexus-ecommerce',
    title: 'Nexus Comercio Electrónico',
    titleEn: 'Nexus E-Commerce',
    description: 'Mercado B2C con gestión de inventario compleja y pasarela de pago Stripe integrada.',
    descriptionEn: 'B2C marketplace with complex inventory management and integrated Stripe payment gateway.',
    challenges: 'Evitar condiciones de carrera por doble asignación y falta de stock durante olas de pago de alta concurrencia, manteniendo el inventario del almacén sincronizado globalmente en tiempo real.',
    challengesEn: 'Preventing double-allocation and out-of-stock race conditions during high-concurrency checkout waves, keeping warehouse inventory synchronized globally in real-time.',
    solutions: 'Utilizó bloqueo a nivel de fila de PostgreSQL (`SELECT FOR UPDATE`) dentro de un contenedor aislado de reintentos de transacciones SQL serializables. Utilizó WebSockets reactivos para enviar cambios delta inmediatamente a la interfaz del escaparate cuando cambian los contadores de stock.',
    solutionsEn: 'Utilized PostgreSQL row-level locking (`SELECT FOR UPDATE`) inside an isolated, serializable SQL transaction retry wrapper. Used reactive WebSockets to push delta changes immediately to the storefront UI when stock counters change.',
    businessImpact: 'Aumento del 18% en conversiones de compra al erradicar pérdidas de stock y race conditions concurrentes en inventario.',
    businessImpactEn: '18% increase in checkout conversions by eradicating stock discrepancies and concurrent inventory race conditions.'
  }
];

async function updateProjects() {
  const client = await pool.connect();
  try {
    console.log("Updating projects data with bilingual Spanish/English content...");

    for (const proj of BILINGUAL_PROJECTS) {
      const res = await client.query(
        `UPDATE dev_shell_portfolio.projects 
         SET 
           title = $1, 
           title_en = $2, 
           description = $3, 
           description_en = $4, 
           challenges = $5, 
           challenges_en = $6, 
           solutions = $7, 
           solutions_en = $8, 
           business_impact = $9, 
           business_impact_en = $10 
         WHERE id = $11`,
        [
          proj.title,
          proj.titleEn,
          proj.description,
          proj.descriptionEn,
          proj.challenges,
          proj.challengesEn,
          proj.solutions,
          proj.solutionsEn,
          proj.businessImpact,
          proj.businessImpactEn,
          proj.id
        ]
      );
      if (res.rowCount === 0) {
        console.warn(`Project row for '${proj.id}' was not found. Seed might not have initialized yet.`);
      } else {
        console.log(`Updated project '${proj.id}' with bilingual content.`);
      }
    }

    console.log("Database projects update completed successfully!");
  } catch (err) {
    console.error("Error executing database projects update script:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

updateProjects();
