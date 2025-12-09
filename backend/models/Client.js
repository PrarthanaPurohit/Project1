const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    maxlength: [100, 'Client name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Client description is required'],
    trim: true,
    maxlength: [500, 'Client description cannot exceed 500 characters']
  },
  designation: {
    type: String,
    required: [true, 'Client designation is required'],
    trim: true,
    maxlength: [100, 'Client designation cannot exceed 100 characters']
  },
  image: {
    type: String,
    required: [true, 'Client image is required']
  }
}, {
  timestamps: true
});

// Index for faster queries
clientSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Client', clientSchema);
