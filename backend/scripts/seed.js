require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Project = require('../models/Project');
const Client = require('../models/Client');

/**
 * Seed script to populate the database with initial data
 * Usage: node scripts/seed.js [--with-samples]
 */

const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123',
  email: 'admin@showcase.com'
};

const SAMPLE_PROJECTS = [
  {
    name: 'E-Commerce Platform',
    description: 'A full-featured online shopping platform with payment integration, inventory management, and customer analytics. Built with modern technologies for scalability and performance.',
    image: 'https://via.placeholder.com/450x350/4A90E2/ffffff?text=E-Commerce'
  },
  {
    name: 'Task Management App',
    description: 'Collaborative task management application with real-time updates, team collaboration features, and project tracking capabilities.',
    image: 'https://via.placeholder.com/450x350/50C878/ffffff?text=Task+Manager'
  },
  {
    name: 'Social Media Dashboard',
    description: 'Analytics dashboard for social media management with post scheduling, engagement tracking, and comprehensive reporting tools.',
    image: 'https://via.placeholder.com/450x350/FF6B6B/ffffff?text=Social+Dashboard'
  }
];

const SAMPLE_CLIENTS = [
  {
    name: 'Sarah Johnson',
    description: 'Working with this team was an absolute pleasure. They delivered our project on time and exceeded our expectations with their attention to detail.',
    designation: 'CEO, TechStart Inc',
    image: 'https://via.placeholder.com/450x350/9B59B6/ffffff?text=SJ'
  },
  {
    name: 'Michael Chen',
    description: 'The quality of work and professionalism demonstrated throughout our project was outstanding. Highly recommend their services!',
    designation: 'CTO, Innovation Labs',
    image: 'https://via.placeholder.com/450x350/3498DB/ffffff?text=MC'
  },
  {
    name: 'Emily Rodriguez',
    description: 'Exceptional service and support. The team was responsive, creative, and delivered exactly what we needed for our business.',
    designation: 'Founder, Digital Solutions',
    image: 'https://via.placeholder.com/450x350/E67E22/ffffff?text=ER'
  }
];

/**
 * Connect to MongoDB
 */
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

/**
 * Create default admin user
 */
async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: DEFAULT_ADMIN.username });
    
    if (existingAdmin) {
      console.log('⚠ Admin user already exists, skipping...');
      return existingAdmin;
    }

    // Create new admin
    const admin = new Admin(DEFAULT_ADMIN);
    await admin.save();
    
    console.log('✓ Admin user created successfully');
    console.log(`  Username: ${DEFAULT_ADMIN.username}`);
    console.log(`  Password: ${DEFAULT_ADMIN.password}`);
    console.log(`  Email: ${DEFAULT_ADMIN.email}`);
    
    return admin;
  } catch (error) {
    console.error('✗ Error creating admin user:', error.message);
    throw error;
  }
}

/**
 * Create sample projects
 */
async function createSampleProjects() {
  try {
    // Check if projects already exist
    const existingProjects = await Project.countDocuments();
    
    if (existingProjects > 0) {
      console.log('⚠ Projects already exist, skipping sample data...');
      return;
    }

    // Create sample projects
    await Project.insertMany(SAMPLE_PROJECTS);
    console.log(`✓ Created ${SAMPLE_PROJECTS.length} sample projects`);
  } catch (error) {
    console.error('✗ Error creating sample projects:', error.message);
    throw error;
  }
}

/**
 * Create sample clients
 */
async function createSampleClients() {
  try {
    // Check if clients already exist
    const existingClients = await Client.countDocuments();
    
    if (existingClients > 0) {
      console.log('⚠ Clients already exist, skipping sample data...');
      return;
    }

    // Create sample clients
    await Client.insertMany(SAMPLE_CLIENTS);
    console.log(`✓ Created ${SAMPLE_CLIENTS.length} sample clients`);
  } catch (error) {
    console.error('✗ Error creating sample clients:', error.message);
    throw error;
  }
}

/**
 * Main seed function
 */
async function seed() {
  const includeSamples = process.argv.includes('--with-samples');
  
  console.log('\n🌱 Starting database seeding...\n');
  
  try {
    await connectDB();
    
    // Always create admin user
    await createAdminUser();
    
    // Optionally create sample data
    if (includeSamples) {
      console.log('\n📦 Creating sample data...\n');
      await createSampleProjects();
      await createSampleClients();
    }
    
    console.log('\n✅ Database seeding completed successfully!\n');
    
    if (!includeSamples) {
      console.log('💡 Tip: Run with --with-samples flag to add sample projects and clients\n');
    }
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('✓ Database connection closed\n');
  }
}

// Run the seed function
seed();
