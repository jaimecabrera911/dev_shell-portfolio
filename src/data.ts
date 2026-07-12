/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, ExperienceItem, TechItem } from './types';

export const TECH_STACK: TechItem[] = [
  { name: 'JavaScript', icon: 'Javascript', category: 'frontend', isCore: true },
  { name: 'TypeScript', icon: 'Typescript', category: 'frontend', isCore: true },
  { name: 'React.js', icon: 'React', category: 'frontend', isCore: true },
  { name: 'Node.js', icon: 'Node', category: 'backend', isCore: true },
  { name: 'PostgreSQL', icon: 'Postgres', category: 'database', isCore: true },
  { name: 'Docker', icon: 'Docker', category: 'devops', isCore: true },
  { name: 'AWS Cloud', icon: 'Aws', category: 'devops', isCore: true },
  { name: 'Next.js', icon: 'Next', category: 'frontend', isCore: true },
  { name: 'Go', icon: 'Go', category: 'backend', isCore: false },
  { name: 'Redis', icon: 'Redis', category: 'database', isCore: false },
  { name: 'React Native', icon: 'ReactNative', category: 'frontend', isCore: false },
  { name: 'GraphQL', icon: 'Graphql', category: 'backend', isCore: false },
  { name: 'Kubernetes', icon: 'Kubernetes', category: 'devops', isCore: false },
  { name: 'GitHub Actions', icon: 'Github', category: 'devops', isCore: false }
];

export const PROJECTS: Project[] = [
  {
    id: 'lumina-analytics',
    title: 'Lumina Analytics Platform',
    description: 'Real-time data processing engine handling 10k+ events/sec with serverless infrastructure.',
    challenges: 'Scaling real-time analytics ingestion pipelines for high-traffic environments (10,000+ operations/second) without causing expensive database locking, network bottlenecks, or high cold-start latencies.',
    solutions: 'Designed an elegant, serverless stream-processing pipeline using AWS Lambda and Amazon Kinesis Data Streams for high-velocity buffering. Integrated DynamoDB for single-digit millisecond hot storage, paired with an incremental aggregation schedule to persist summarized analytical views in PostgreSQL.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4jHd-LuPLk7hmjguAQBkB9CLewP4ShPV64ms39c8PqC9dzlYj82zuF8ShHBitVvHXHb-PAEcbMo_nnH5NZXUzneS6iaZntkJr8o-SwbUAujNCB9sx_jVmBQxVKepK9AnXv5vOVTTHsoZiN92L5qJQNzqkebl1iQ1QMra_jXmJjgSQqLH5-BT0Xol69hjI5cmWShU7fnTUNWFq1vmo8GXRYIKeFYQaejUrBoFGKaENoUGFoUkgVpeJTn4SzmkL2DmwV2V6DZFKviY',
    tags: ['Next.js', 'Node.js', 'AWS'],
    year: '2024',
    demoUrl: '#',
    githubUrl: '#',
    architectureNodes: [
      { id: 'client', label: 'Web Clients', type: 'client', status: 'active' },
      { id: 'gateway', label: 'AWS API Gateway', type: 'gateway', status: 'active' },
      { id: 'lambda', label: 'AWS Lambda (Ingest)', type: 'service', status: 'loading' },
      { id: 'kinesis', label: 'Kinesis Streams', type: 'queue', status: 'active' },
      { id: 'dynamo', label: 'DynamoDB', type: 'database', status: 'idle' }
    ],
    architectureLinks: [
      { source: 'client', target: 'gateway', label: 'HTTPS POST', animated: true },
      { source: 'gateway', target: 'lambda', label: 'Proxy', animated: true },
      { source: 'lambda', target: 'kinesis', label: 'Buffer Stream', animated: true },
      { source: 'kinesis', target: 'dynamo', label: 'Batch Write', animated: false }
    ],
    codeSnippet: `// Serverless Analytics Ingest Handler (AWS Lambda)
import { KinesisStreamHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const ddbClient = new DynamoDBClient({ region: 'us-east-1' });
const ddbDoc = DynamoDBDocumentClient.from(ddbClient);

export const handler: KinesisStreamHandler = async (event) => {
  const records = event.Records;
  console.log(\`Received \${records.length} analytics events.\`);

  const promises = records.map(async (record) => {
    // Decode base64 analytics payload
    const payload = Buffer.from(record.kinesis.data, 'base64').toString('utf-8');
    const eventData = JSON.parse(payload);

    // Save with partition keys for high-efficiency reads
    const command = new PutCommand({
      TableName: 'LuminaMetricsTable',
      Item: {
        partitionKey: \`metric#\${eventData.projectId}\`,
        sortKey: \`ts#\${eventData.timestamp}\`,
        eventType: eventData.type,
        meta: eventData.payload,
        processedAt: new Date().toISOString()
      }
    });

    return ddbDoc.send(command);
  });

  await Promise.all(promises);
};`,
    codeLanguage: 'typescript',
    businessImpact: 'Reducción del 30% en costos de infraestructura cloud al consolidar funciones serverless, con una ingesta de telemetría de eventos con cero pérdidas.'
  },
  {
    id: 'calyx-cache',
    title: 'Calyx Distributed Cache',
    description: 'High-availability caching layer with peer-to-peer discovery and eventual consistency protocols.',
    challenges: 'Minimizing cross-cluster request latencies, preventing replication lag storm-effects, and maintaining dynamic membership lists in container orchestration nodes without relying on a single central coordinator.',
    solutions: 'Developed a custom decentralized gossip protocol in Go implementing SWIM membership rules, combined with a consistent hashing ring structure and Bloom filters to locate cache keys instantly across active peers.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaUND36kUe2Q_OLnfSfjMdKiia6TV0hnOT6dgmUpwK5Y9SkL2Ho8dh-s2WHG5MIZYaa_F_LTCvBUil4fA6ChPPQbqbjPjbsfXI5ZaGgVT9N3ccH4CEYSIP_TGdUgJw1jH5v4QwuEMCWDGzxapbnkGihwRDkF7b3D6JJvXuuuvHYiPk_EMT9T2MFEZvrlmMjShU9DRtR_HE5u6CS-8IPRPHc_ZFpos2RSWOy_v9_mJTz0J6D2ykAiwpFTVFLhNFeH7xjQzNWQtYqY0',
    tags: ['Go', 'Docker', 'Redis'],
    year: '2023',
    demoUrl: '#',
    githubUrl: '#',
    architectureNodes: [
      { id: 'app', label: 'App Nodes', type: 'client', status: 'active' },
      { id: 'router', label: 'Consistent Hashing Ring', type: 'gateway', status: 'active' },
      { id: 'redis-a', label: 'Cache Node A', type: 'cache', status: 'active' },
      { id: 'redis-b', label: 'Cache Node B', type: 'cache', status: 'active' },
      { id: 'sync', label: 'SWIM Gossip Protocol', type: 'service', status: 'loading' }
    ],
    architectureLinks: [
      { source: 'app', target: 'router', label: 'Lookup Key', animated: true },
      { source: 'router', target: 'redis-a', label: 'Route (Hash Match)', animated: true },
      { source: 'router', target: 'redis-b', label: 'Route (Hash Backup)', animated: false },
      { source: 'redis-a', target: 'sync', label: 'Gossip Status', animated: true },
      { source: 'redis-b', target: 'sync', label: 'Gossip Status', animated: true }
    ],
    codeSnippet: `package ring

import (
	"crypto/sha256"
	"fmt"
	"sort"
)

type HashRing struct {
	vNodes   int
	ring     []uint32
	nodeMap  map[uint32]string
}

func NewHashRing(vNodes int) *HashRing {
	return &HashRing{
		vNodes:  vNodes,
		nodeMap: make(map[uint32]string),
	}
}

func (h *HashRing) AddNode(node string) {
	for i := 0; i < h.vNodes; i++ {
		hash := h.hash(fmt.Sprintf("%s#%d", node, i))
		h.ring = append(h.ring, hash)
		h.nodeMap[hash] = node
	}
	sort.Slice(h.ring, func(i, j int) bool { return h.ring[i] < h.ring[j] })
}

func (h *HashRing) GetNode(key string) string {
	if len(h.ring) == 0 {
		return ""
	}
	hash := h.hash(key)
	idx := sort.Search(len(h.ring), func(i int) bool { return h.ring[i] >= hash })
	if idx == len(h.ring) {
		idx = 0
	}
	return h.nodeMap[h.ring[idx]]
}

func (h *HashRing) hash(val string) uint32 {
	hasher := sha256.New()
	hasher.Write([]byte(val))
	b := hasher.Sum(nil)
	return uint32(b[0])<<24 | uint32(b[1])<<16 | uint32(b[2])<<8 | uint32(b[3])
}`,
    codeLanguage: 'go',
    businessImpact: 'Disminución de latencias del API del 95% al percentil 99 (p99 < 12ms), evitando sobrecargas de base de datos relacional.'
  },
  {
    id: 'nexus-ecommerce',
    title: 'Nexus E-Commerce',
    description: 'B2C marketplace with complex inventory management and integrated Stripe payment gateway.',
    challenges: 'Preventing double-allocation and out-of-stock race conditions during high-concurrency checkout waves, keeping warehouse inventory synchronized globally in real-time.',
    solutions: 'Utilized PostgreSQL row-level locking (\`SELECT FOR UPDATE\`) inside an isolated, serializable SQL transaction retry wrapper. Used reactive WebSockets to push delta changes immediately to the storefront UI when stock counters change.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEzgHN5AfSjy1JZCaV3f-N094QAEYO5oWaDPrMb7JAaYh1s02cpwmUcYtOAFrQ3PTvNpbshASf3ubSDGTmjKNpbqiPOkf_uRENOXy9WN2t96_3R-pdpEwhLk9rFHpM3Vf-tDL41u6woKXyVvXotCKWBNGkrTiPSOiL6CaSVR_Nwf1ezVDxippSD1Ubn4Ax1MCu_V6qAdEjZreMvv2jnoykCM9ZeXJMWoG4ypAoIVv5qD8iWJ2tFG1bb0qN5invPHoOcIGZTwtAiaI',
    tags: ['React Native', 'PostgreSQL'],
    year: '2023',
    demoUrl: '#',
    githubUrl: '#',
    architectureNodes: [
      { id: 'mobile', label: 'Mobile Client', type: 'client', status: 'active' },
      { id: 'gateway', label: 'GraphQL API Gateway', type: 'gateway', status: 'active' },
      { id: 'db', label: 'PostgreSQL DB', type: 'database', status: 'loading' },
      { id: 'stripe', label: 'Stripe Gateway', type: 'service', status: 'idle' }
    ],
    architectureLinks: [
      { source: 'mobile', target: 'gateway', label: 'WebSocket / GraphQL', animated: true },
      { source: 'gateway', target: 'db', label: 'Row-Lock Transaction', animated: true },
      { source: 'gateway', target: 'stripe', label: 'Capture Payment', animated: false }
    ],
    codeSnippet: `// PostgreSQL Serializable Inventory Reservation Handler
import { PoolClient } from 'pg';

export async function reserveStock(client: PoolClient, orderId: string, items: { productId: string; qty: number }[]): Promise<boolean> {
  try {
    // Set isolation level to serializable for absolute write safety
    await client.query('BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE');

    for (const item of items) {
      // Locking the row to prevent concurrent purchase races
      const res = await client.query(
        \`SELECT stock_count, product_name 
         FROM products 
         WHERE id = $1 FOR UPDATE\`,
        [item.productId]
      );

      if (res.rows.length === 0) {
        throw new Error('Product not found');
      }

      const product = res.rows[0];
      if (product.stock_count < item.qty) {
        throw new Error(\`Insufficient stock for \${product.product_name}. Available: \${product.stock_count}\`);
      }

      // Decrement inventory
      await client.query(
        'UPDATE products SET stock_count = stock_count - $1 WHERE id = $2',
        [item.qty, item.productId]
      );
    }

    // Save reservation record
    await client.query(
      'INSERT INTO reservations (order_id, item_count, created_at) VALUES ($1, $2, NOW())',
      [orderId, items.reduce((sum, i) => sum + i.qty, 0)]
    );

    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Reservation failed:', error);
    return false;
  }
}`,
    codeLanguage: 'typescript',
    businessImpact: 'Aumento del 18% en conversiones de compra al erradicar pérdidas de stock y race conditions concurrentes en inventario.'
  }
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Senior Solutions Architect',
    company: 'TechNexus Systems',
    period: '2022 - Present',
    bulletPoints: [
      'Led the migration of legacy monolithic architecture to AWS microservices.',
      'Optimized CI/CD pipelines reducing deployment time by 45%.',
      'Mentored a team of 12 full-stack engineers.'
    ]
  },
  {
    id: 'exp-2',
    role: 'Fullstack Developer',
    company: 'CloudScale Labs',
    period: '2019 - 2022',
    bulletPoints: [
      'Developed core features for a React-based SaaS platform.',
      'Implemented real-time collaboration features using WebSockets.',
      'Redesigned database schema for improved query performance.'
    ]
  },
  {
    id: 'exp-3',
    role: 'Frontend Engineer',
    company: 'InnovaSoft',
    period: '2017 - 2019',
    bulletPoints: [
      'Built responsive UI components using Styled Components and Vue.',
      'Collaborated with design teams to maintain UX consistency.'
    ]
  }
];
