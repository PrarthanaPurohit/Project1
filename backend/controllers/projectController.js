const Project = require('../models/Project');
const { processImage, deleteImage } = require('../utils/imageProcessor');

/**
 * @desc    Get all projects
 * @route   GET /api/projects
 * @access  Public
 */
exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all projects (admin view)
 * @route   GET /api/admin/projects
 * @access  Private (Admin)
 */
exports.getAdminProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new project
 * @route   POST /api/admin/projects
 * @access  Private (Admin)
 */
exports.createProject = async (req, res, next) => {
  try {
    const { name, description, location } = req.body;
    
    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Project image is required'
      });
    }
    
    // Process and save image
    const imagePath = await processImage(req.file.buffer, req.file.originalname);
    
    // Create project
    const project = await Project.create({
      name,
      description,
      location,
      image: imagePath
    });
    
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update project
 * @route   PUT /api/admin/projects/:id
 * @access  Private (Admin)
 */
exports.updateProject = async (req, res, next) => {
  try {
    const { name, description, location } = req.body;
    const { id } = req.params;
    
    // Find project
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Update fields
    if (name) project.name = name;
    if (description) project.description = description;
    if (location !== undefined) project.location = location;
    
    // If new image uploaded, process and update
    if (req.file) {
      // Delete old image
      await deleteImage(project.image);
      
      // Process and save new image
      const imagePath = await processImage(req.file.buffer, req.file.originalname);
      project.image = imagePath;
    }
    
    await project.save();
    
    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete project
 * @route   DELETE /api/admin/projects/:id
 * @access  Private (Admin)
 */
exports.deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find project
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Delete image file
    await deleteImage(project.image);
    
    // Delete project from database
    await Project.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
