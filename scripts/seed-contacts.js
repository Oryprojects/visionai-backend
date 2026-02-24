import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Contact from '../server/models/Contact.js';

dotenv.config();

const contactsData = [
  {
    name: 'John Smith',
    email: 'john.smith@company.com',
    subject: 'AI Implementation Inquiry',
    message: 'We are interested in implementing AI solutions for our manufacturing company. Can you provide more information about your services?',
    type: 'contact',
    status: 'new'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.j@techcorp.io',
    subject: 'Partnership Opportunity',
    message: 'Our company is looking for AI partners for an upcoming project. Would love to discuss potential collaboration.',
    type: 'contact',
    status: 'in-progress'
  },
  {
    name: 'Michael Chen',
    email: 'mchen@startup.ai',
    subject: 'Demo Request',
    message: 'We would like to schedule a demo of your AI-powered business intelligence platform.',
    type: 'demo',
    status: 'new'
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@enterprise.com',
    subject: 'Pricing Information',
    message: 'Could you please provide detailed pricing for your end-to-end solution implementation service?',
    type: 'contact',
    status: 'resolved'
  },
  {
    name: 'David Wilson',
    email: 'dwilson@consulting.co',
    subject: 'Technical Support',
    message: 'We need technical support for our existing AI systems. What support packages do you offer?',
    type: 'contact',
    status: 'new'
  }
];

async function seedContacts() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing contacts (optional - comment out if you want to keep existing data)
    // await Contact.deleteMany({});
    // console.log('Cleared existing contacts');

    // Insert new contacts
    const insertedContacts = await Contact.insertMany(contactsData);
    console.log(`Successfully inserted ${insertedContacts.length} contact submissions:`);
    
    insertedContacts.forEach((contact, index) => {
      console.log(`${index + 1}. ${contact.name} - ${contact.subject} (${contact.status})`);
    });

  } catch (error) {
    console.error('Error seeding contacts:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedContacts();
