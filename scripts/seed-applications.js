import mongoose from 'mongoose';
import dotenv from 'dotenv';
import JobApplication from '../server/models/JobApplication.js';

dotenv.config();

const applicationsData = [
  {
    name: 'Alex Thompson',
    email: 'alex.thompson@email.com',
    phone: '+81-90-1234-5678',
    position: 'General Affairs Representative',
    message: 'I have 3 years of experience in general affairs and am fluent in both Japanese and English. I believe I would be a great fit for this position.',
    resumeFilename: 'alex_thompson_resume.pdf',
    status: 'submitted'
  },
  {
    name: 'Yuki Tanaka',
    email: 'yuki.tanaka@email.com',
    phone: '+81-80-9876-5432',
    position: 'Bilingual Generative AI Developer',
    message: 'I am a machine learning engineer with 5 years of experience developing AI models. I am native Japanese speaker and fluent in English.',
    resumeFilename: 'yuki_tanaka_resume.pdf',
    status: 'reviewing'
  },
  {
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '+81-70-5555-1234',
    position: 'Bilingual Program Manager',
    message: 'I have 8 years of experience managing tech projects and have worked extensively with Japanese clients. I am excited about this opportunity.',
    resumeFilename: 'maria_garcia_resume.pdf',
    status: 'interview'
  },
  {
    name: 'James Wilson',
    email: 'james.wilson@email.com',
    phone: '+81-90-7777-8888',
    position: 'Bilingual Generative AI Developer',
    message: 'Recent graduate with strong programming skills and AI/ML coursework. I am bilingual in Japanese and English.',
    resumeFilename: 'james_wilson_resume.pdf',
    status: 'submitted'
  },
  {
    name: 'Hiroshi Sato',
    email: 'hiroshi.sato@email.com',
    phone: '+81-80-3333-4444',
    position: 'General Affairs Representative',
    message: 'Experienced administrative professional looking for new challenges. I am detail-oriented and bilingual.',
    resumeFilename: 'hiroshi_sato_resume.pdf',
    status: 'reviewing'
  }
];

async function seedApplications() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing applications (optional - comment out if you want to keep existing data)
    // await JobApplication.deleteMany({});
    // console.log('Cleared existing applications');

    // Insert new applications
    const insertedApplications = await JobApplication.insertMany(applicationsData);
    console.log(`Successfully inserted ${insertedApplications.length} job applications:`);
    
    insertedApplications.forEach((app, index) => {
      console.log(`${index + 1}. ${app.name} - ${app.position} (${app.status})`);
    });

  } catch (error) {
    console.error('Error seeding applications:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedApplications();
