import mongoose from 'mongoose';
import dotenv from 'dotenv';
import About from '../server/models/About.js';

dotenv.config();

const aboutData = {
  companyInfo: {
    mission: 'To lead in technological innovation and set new industry standards by empowering Japan\'s digital transformation through scalable, AI-driven solutions and strategic global collaboration.',
    vision: 'To be the global leader in AI-powered business transformation, creating a world where intelligent systems and human expertise work together to solve the most complex challenges.',
    description: 'We are pioneering the future of business intelligence through advanced AI solutions. Our mission is to make artificial intelligence accessible, practical, and transformative for businesses of all sizes',
    foundedYear: 2020,
    teamSize: '50-100',
    headquarters: 'Tokyo, Japan'
  },
  contactInfo: {
    email: 'contact@visionai.jp',
    phone: '+81-3-1234-5678',
    address: 'Tokyo, Japan',
    mapUrl: 'https://maps.google.com/?q=Tokyo,Japan'
  },
  directors: [
    {
      name: 'John Smith',
      designation: 'CEO & Founder',
      bio: 'John is a visionary leader with over 15 years of experience in AI and machine learning. He founded VisionAI with the mission to make AI accessible to all businesses.',
      image: '/team/john-smith.jpg',
      linkedin: 'https://linkedin.com/in/johnsmith',
      email: 'john.smith@visionai.jp',
      order: 1,
      isActive: true
    },
    {
      name: 'Sarah Johnson',
      designation: 'CTO',
      bio: 'Sarah is a technology expert with extensive experience in developing scalable AI solutions. She leads our technical team and ensures we deliver cutting-edge solutions.',
      image: '/team/sarah-johnson.jpg',
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      email: 'sarah.johnson@visionai.jp',
      order: 2,
      isActive: true
    },
    {
      name: 'Michael Chen',
      designation: 'Head of Operations',
      bio: 'Michael oversees our global operations and ensures smooth delivery of projects to clients worldwide. He brings operational excellence to everything we do.',
      image: '/team/michael-chen.jpg',
      linkedin: 'https://linkedin.com/in/michaelchen',
      email: 'michael.chen@visionai.jp',
      order: 3,
      isActive: true
    }
  ],
  stats: {
    projectsCompleted: 150,
    clientsServed: 75,
    yearsExperience: 4,
    teamMembers: 65
  }
};

async function seedAbout() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing about data
    await About.deleteMany({});
    console.log('Cleared existing about data');

    // Insert new about data
    const insertedAbout = await About.create(aboutData);
    console.log('Successfully inserted about data:');
    console.log(`- Company: ${insertedAbout.companyInfo.mission.substring(0, 50)}...`);
    console.log(`- Directors: ${insertedAbout.directors.length} team members`);
    console.log(`- Stats: ${insertedAbout.stats.projectsCompleted} projects completed`);

  } catch (error) {
    console.error('Error seeding about data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedAbout();
