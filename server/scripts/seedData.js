import mongoose from 'mongoose';
import Service from '../models/Service.js';
import Job from '../models/Job.js';
import Contact from '../models/Contact.js';
import About from '../models/About.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Service.deleteMany({});
    await Job.deleteMany({});
    await Contact.deleteMany({});
    await About.deleteMany({});

    // Create sample services
    const services = [
      {
        title: 'AI-Powered Business Intelligence',
        description: 'Transform your business data into actionable insights with our advanced AI analytics platform.',
        pricing: '$999/month',
        status: 'ACTIVE',
        featured: true,
        category: 'Analytics',
        features: ['Real-time analytics', 'Predictive modeling', 'Custom dashboards', 'API integration'],
        order: 1,
        slug: 'ai-powered-business-intelligence'
      },
      {
        title: 'Agentic AI Systems',
        description: 'Autonomous AI agents that can handle complex tasks and workflows.',
        pricing: '$1499/month',
        status: 'ACTIVE',
        featured: true,
        category: 'Automation',
        features: ['Autonomous agents', 'Workflow automation', 'Multi-agent coordination', 'Custom agent training'],
        order: 2,
        slug: 'agentic-ai-systems'
      },
      {
        title: 'Data-Driven Analytics',
        description: 'Comprehensive data analytics solution for modern businesses.',
        pricing: '$799/month',
        status: 'ACTIVE',
        featured: false,
        category: 'Analytics',
        features: ['Data visualization', 'Statistical analysis', 'Report generation', 'Data integration'],
        order: 3,
        slug: 'data-driven-analytics'
      }
    ];

    await Service.insertMany(services);
    console.log('Services created');

    // Create sample jobs
    const jobs = [
      {
        role: 'Senior AI Engineer',
        description: 'We are looking for an experienced AI Engineer to join our growing team.',
        location: 'San Francisco, CA',
        type: 'FULL_TIME',
        department: 'Engineering',
        experience: '5+ years',
        salary: '$150,000 - $200,000',
        status: 'OPEN',
        featured: true,
        requirements: ['5+ years of AI/ML experience', 'Strong Python skills', 'Experience with cloud platforms'],
        responsibilities: ['Design and implement AI solutions', 'Lead technical projects', 'Mentor junior engineers'],
        benefits: ['Health insurance', '401(k)', 'Remote work options', 'Professional development'],
        order: 1,
        slug: 'senior-ai-engineer'
      },
      {
        role: 'Product Manager - AI Solutions',
        description: 'Join our product team to drive AI product development.',
        location: 'New York, NY',
        type: 'FULL_TIME',
        department: 'Product',
        experience: '3+ years',
        salary: '$120,000 - $160,000',
        status: 'OPEN',
        featured: false,
        requirements: ['Product management experience', 'AI/ML knowledge', 'Strong communication skills'],
        responsibilities: ['Product strategy', 'Roadmap development', 'Stakeholder management'],
        benefits: ['Health insurance', '401(k)', 'Flexible work hours', 'Stock options'],
        order: 2,
        slug: 'product-manager-ai-solutions'
      }
    ];

    await Job.insertMany(jobs);
    console.log('Jobs created');

    // Create sample contacts
    const contacts = [
      {
        name: 'John Smith',
        email: 'john.smith@company.com',
        subject: 'AI Implementation Inquiry',
        message: 'We are interested in implementing AI solutions for our manufacturing business.',
        type: 'contact',
        status: 'NEW'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.j@startup.io',
        subject: 'Demo Request',
        message: 'Would like to schedule a demo of your AI platform.',
        type: 'demo',
        status: 'IN_PROGRESS'
      },
      {
        name: 'Michael Chen',
        email: 'mchen@enterprise.com',
        subject: 'Partnership Opportunity',
        message: 'We would like to explore partnership opportunities.',
        type: 'contact',
        status: 'COMPLETED'
      }
    ];

    await Contact.insertMany(contacts);
    console.log('Contacts created');

    // Create sample about data
    const aboutData = {
      companyInfo: {
        mission: 'To revolutionize businesses through cutting-edge AI solutions that drive growth and innovation.',
        vision: 'To be the global leader in AI-powered business transformation, empowering organizations to reach their full potential.',
        description: 'VisionAI is a leading provider of artificial intelligence solutions, helping businesses leverage the power of AI to transform their operations, drive efficiency, and achieve unprecedented growth.',
        foundedYear: 2020,
        teamSize: '50+',
        headquarters: 'San Francisco, CA'
      },
      contactInfo: {
        email: 'contact@visionai.com',
        phone: '+1 (555) 123-4567',
        address: '123 AI Street, San Francisco, CA 94105',
        mapUrl: 'https://maps.google.com/?q=San+Francisco+CA'
      },
      directors: [
        {
          name: 'Dr. Emily Rodriguez',
          designation: 'CEO & Founder',
          bio: 'Dr. Rodriguez is a pioneer in AI research with over 15 years of experience in machine learning and neural networks.',
          image: 'https://picsum.photos/seed/emily/200/200.jpg',
          linkedin: 'https://linkedin.com/in/emilyrodriguez',
          email: 'emily@visionai.com',
          order: 1,
          isActive: true
        },
        {
          name: 'James Chen',
          designation: 'CTO',
          bio: 'James leads our technical vision with extensive experience in scalable AI systems and cloud architecture.',
          image: 'https://picsum.photos/seed/james/200/200.jpg',
          linkedin: 'https://linkedin.com/in/jameschen',
          email: 'james@visionai.com',
          order: 2,
          isActive: true
        }
      ],
      stats: {
        projectsCompleted: 150,
        clientsServed: 75,
        yearsExperience: 4,
        teamMembers: 50
      }
    };

    await About.create(aboutData);
    console.log('About data created');

    console.log('Sample data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
