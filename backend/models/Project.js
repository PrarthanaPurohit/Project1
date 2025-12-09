const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [200, 'Project name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [1000, 'Project description cannot exceed 1000 characters']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters'],
    default: 'Location not specified'
  },
  image: {
    type: String,
    required: [true, 'Project image is required']
  }
}, {
  timestamps: true
});

// Index for faster queries
projectSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);
