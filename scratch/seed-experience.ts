import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load env variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not defined in .env.local");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });

const experiences = [
  {
    id: 'exp-1',
    role: 'Senior Solutions Architect',
    company: 'TechNexus Systems',
    period: '2022 - Present',
    bulletPoints: [
      'Led the complete migration of legacy microservices and transactional databases to highly scalable serverless architectures, supporting up to 15,000 requests per second.',
      'Configured AWS Kinesis Data Buffers and DynamoDB hot caching, decreasing read/write database locking down to 0.1% under flash traffic waves.',
      'Optimized automated continuous deployment pipelines using Github Actions and Kubernetes registries, speeding up cycle time from 15 minutes to 4 minutes.'
    ]
  },
  {
    id: 'exp-2',
    role: 'Lead Fullstack Engineer',
    company: 'CloudScale Labs',
    period: '2019 - 2022',
    bulletPoints: [
      'Architected and launched premium core features for a React-based high-concurrency SaaS platform, with 100% test coverage using Jest.',
      'Implemented bi-directional low-overhead communication loops utilizing custom WebSockets to support secure real-time collaboration dashboards.',
      'Redesigned global relational database schemas with complex composite indexing, boosting search performance by 35%.'
    ]
  },
  {
    id: 'exp-3',
    role: 'Senior Backend Developer',
    company: 'InnovaSoft Solutions',
    period: '2017 - 2019',
    bulletPoints: [
      'Engineered scalable microservice APIs in Go and Node.js, reducing average response latencies by 45% (p99 < 50ms).',
      'Designed and integrated secure third-party payment processing pipelines utilizing Stripe and PayPal billing gateways.',
      'Mentored 8 junior and mid-level developers on backend best practices, test-driven development, and modular architecture.'
    ]
  },
  {
    id: 'exp-4',
    role: 'Software Engineer (Distributed Systems)',
    company: 'CoreData Corp',
    period: '2015 - 2017',
    bulletPoints: [
      'Developed high-performance ETL pipelines processing over 50 million records daily using Apache Spark and Scala.',
      'Configured multi-node Redis and Memcached clusters with active-active replication to resolve heavy read locking on core PostgreSQL databases.',
      'Maintained 99.99% service availability by implementing automatic circuit breakers and retry policies across downstream APIs.'
    ]
  },
  {
    id: 'exp-5',
    role: 'Web Applications Developer',
    company: 'PixelPerfect Web',
    period: '2013 - 2015',
    bulletPoints: [
      'Built custom web applications and interactive landing pages using React, Sass, and Webpack for e-commerce clients.',
      'Improved frontend performance score from 62 to 95+ on Google Lighthouse by implementing code splitting, lazy loading, and asset optimization.',
      'Integrated headless CMS content engines (Contentful, Strapi) with secure static site generators to improve SEO index ranking.'
    ]
  },
  {
    id: 'exp-6',
    role: 'Junior Frontend Engineer',
    company: 'ByteTech Startup',
    period: '2012 - 2013',
    bulletPoints: [
      'Created responsive user interfaces and interactive components using HTML5, CSS3, and modern JavaScript.',
      'Collaborated closely with UI/UX designers to convert static layouts (Figma/Sketch) into cross-browser compatible code.',
      'Integrated RESTful backend endpoints for user authentication, profile administration, and real-time dashboard notifications.'
    ]
  }
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log("Connecting to database and updating professional experience timeline...");
    
    // Update experience column in main resume row
    const res = await client.query(
      `UPDATE dev_shell_portfolio.resume_data 
       SET experience = $1 
       WHERE id = 'main'`,
      [JSON.stringify(experiences)]
    );

    if (res.rowCount === 0) {
      console.error("No 'main' resume row found to update. Run the resume seed script first.");
    } else {
      console.log("Updated 6 work experiences successfully in row 'main'!");
    }
  } catch (err) {
    console.error("Error running experience seed script:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
