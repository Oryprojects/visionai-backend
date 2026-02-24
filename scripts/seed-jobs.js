import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from '../server/models/Job.js';

dotenv.config();

const jobsData = [
  {
    role: 'General Affairs Representative',
    description: 'Support company operations and administration. Requires Japanese language skills and organizational ability.',
    location: 'Japan',
    type: 'FULL_TIME',
    department: 'General Affairs',
    experience: 'Entry level to Mid level',
    salary: 'JPY 3M',
    status: 'OPEN',
    featured: true,
    slug: 'general-affairs-representative',
    requirements: [
      'Fluent in Japanese and English',
      'Strong organizational and communication skills',
      'Experience in general affairs or administration preferred'
    ],
    responsibilities: [
      'Manage daily administrative operations',
      'Coordinate with various departments',
      'Handle documentation and reporting',
      'Support office management tasks'
    ],
    benefits: [
      'Competitive salary',
      'Health insurance',
      'Transportation allowance',
      'Professional development opportunities'
    ],
    order: 1
  },
  {
    role: 'Bilingual Generative AI Developer',
    description: 'Develop and deploy generative AI models. Requires bilingual (Japanese/English) skills.',
    location: 'Japan',
    type: 'FULL_TIME',
    department: 'Engineering',
    experience: 'Mid level to Senior',
    salary: 'JPY 6M',
    status: 'OPEN',
    featured: true,
    slug: 'bilingual-generative-ai-developer',
    requirements: [
      'Experience with AI/ML and generative models',
      'Fluent in Japanese and English',
      'Strong programming skills (Python preferred)'
    ],
    responsibilities: [
      'Develop and implement AI models',
      'Work with cross-functional teams',
      'Optimize model performance',
      'Stay updated with latest AI research'
    ],
    benefits: [
      'Competitive salary',
      'Stock options',
      'Health insurance',
      'Flexible working hours',
      'AI conference attendance'
    ],
    order: 2
  },
  {
    role: 'Bilingual Program Manager',
    description: 'Lead AI projects and manage cross-functional teams. Requires bilingual (Japanese/English) skills.',
    location: 'Japan',
    type: 'FULL_TIME',
    department: 'Management',
    experience: 'Senior level',
    salary: 'JPY 8M to 10M',
    status: 'OPEN',
    featured: true,
    slug: 'bilingual-program-manager',
    requirements: [
      'Project management experience',
      'Fluent in Japanese and English',
      'Strong leadership and communication skills'
    ],
    responsibilities: [
      'Lead AI project implementation',
      'Manage cross-functional teams',
      'Coordinate with clients and stakeholders',
      'Ensure project delivery on time and budget'
    ],
    benefits: [
      'Competitive salary',
      'Performance bonuses',
      'Health insurance',
      'Company car',
      'Leadership training programs'
    ],
    order: 3
  }
];

async function seedJobs() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    // Insert new jobs
    const insertedJobs = await Job.insertMany(jobsData);
    console.log(`Successfully inserted ${insertedJobs.length} jobs:`);
    
    insertedJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.role} (${job.slug})`);
    });

  } catch (error) {
    console.error('Error seeding jobs:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedJobs();
