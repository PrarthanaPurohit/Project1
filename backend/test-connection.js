const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI not found in .env file');
  process.exit(1);
}

console.log('Attempting to connect to MongoDB Atlas...');

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  console.log('✅ Successfully connected to MongoDB Atlas!');
  process.exit(0);
})
.catch((err) => {
  console.error('❌ Connection failed:', err.message);
  process.exit(1);
});
