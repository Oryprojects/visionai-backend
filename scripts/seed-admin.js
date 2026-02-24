import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Admin from '../server/models/Admin.js';

dotenv.config();

const adminData = {
  username: 'admin',
  email: 'maheshreddyever@gmail.com',
  password: 'VisionAI@123',
  role: 'ADMIN',
  isActive: true
};

async function seedAdmin() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ username: adminData.username }, { email: adminData.email }]
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create new admin user
    const admin = new Admin(adminData);
    await admin.save();

    console.log('Admin user created successfully:');
    console.log(`- Username: ${adminData.username}`);
    console.log(`- Email: ${adminData.email}`);
    console.log(`- Password: ${adminData.password}`);
    console.log('\nYou can now login with these credentials.');

  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedAdmin();
