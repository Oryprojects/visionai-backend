import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from '../server/models/Service.js';

dotenv.config();

const servicesData = [
  {
    title: 'End-to-End Solution Implementation',
    description: 'Comprehensive delivery from strategy to execution, ensuring seamless integration across systems, processes, and teams.',
    pricing: 'Custom Pricing',
    status: 'ACTIVE',
    featured: true,
    slug: 'end-to-end-solution-implementation',
    category: 'Implementation',
    features: [
      'Strategy-to-execution delivery',
      'Seamless system/process/team integration',
      'Cross-functional execution',
      'Change management support',
      'Continuous improvement',
      'Risk mitigation throughout lifecycle'
    ],
    order: 1,
    icon: 'Brain'
  },
  {
    title: 'AI-Powered Business Intelligence',
    description: 'Transform raw data into actionable insights using advanced analytics, predictive modeling, and intelligent dashboards.',
    pricing: 'Custom Pricing',
    status: 'ACTIVE',
    featured: true,
    slug: 'ai-powered-business-intelligence',
    category: 'Analytics',
    features: [
      'Advanced analytics & dashboards',
      'Predictive modeling',
      'Data visualization',
      'Automated reporting',
      'Real-time insights',
      'KPI tracking'
    ],
    order: 2,
    icon: 'TrendingUp'
  },
  {
    title: 'Agentic AI Systems',
    description: 'Deploy autonomous AI agents that plan, decide, and execute tasks with minimal human intervention—driving efficiency and innovation.',
    pricing: 'Custom Pricing',
    status: 'ACTIVE',
    featured: true,
    slug: 'agentic-ai-systems',
    category: 'AI Systems',
    features: [
      'Autonomous AI agents',
      'Task planning & execution',
      'Minimal human intervention',
      'Continuous learning',
      'Workflow automation',
      'Innovation acceleration'
    ],
    order: 3,
    icon: 'Zap'
  },
  {
    title: 'Data-Driven Analytics',
    description: 'Leverage structured and unstructured data to uncover trends, optimize operations, and support informed decision-making.',
    pricing: 'Custom Pricing',
    status: 'ACTIVE',
    featured: false,
    slug: 'data-driven-analytics',
    category: 'Analytics',
    features: [
      'Structured/unstructured data analysis',
      'Trend discovery',
      'Operational optimization',
      'Decision support',
      'Custom analytics solutions',
      'Data pipeline design'
    ],
    order: 4,
    icon: 'TrendingUp'
  },
  {
    title: 'BOT Setup (Build-Operate-Transfer)',
    description: 'Establish offshore delivery centers with a clear path to ownership, enabling scalability, cost efficiency, and long-term control.',
    pricing: 'Custom Pricing',
    status: 'ACTIVE',
    featured: false,
    slug: 'bot-setup',
    category: 'Setup',
    features: [
      'Offshore delivery center setup',
      'Build-operate-transfer model',
      'Scalability & cost efficiency',
      'Knowledge transfer',
      'Ownership transition',
      'Long-term control'
    ],
    order: 5,
    icon: 'Brain'
  },
  {
    title: 'Legacy to Future Transformation',
    description: 'Modernize outdated systems and processes by migrating to cloud-native, AI-enabled architectures that future-proof your business.',
    pricing: 'Custom Pricing',
    status: 'ACTIVE',
    featured: false,
    slug: 'legacy-to-future-transformation',
    category: 'Transformation',
    features: [
      'Legacy system modernization',
      'Cloud-native migration',
      'AI-enabled architectures',
      'Process reengineering',
      'Future-proofing',
      'Risk-managed transformation'
    ],
    order: 6,
    icon: 'Zap'
  }
];

async function seedServices() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');

    // Insert new services
    const insertedServices = await Service.insertMany(servicesData);
    console.log(`Successfully inserted ${insertedServices.length} services:`);
    
    insertedServices.forEach((service, index) => {
      console.log(`${index + 1}. ${service.title} (${service.slug})`);
    });

  } catch (error) {
    console.error('Error seeding services:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedServices();
