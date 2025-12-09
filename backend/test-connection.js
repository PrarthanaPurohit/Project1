const mongoose = require('mongoose');

const uri = 'mongodb+srv://prarthanapurohit03:KuxnILfkCKym1bQi@cluster0.dobence.mongodb.net/showcase?retryWrites=true&w=majority';

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
