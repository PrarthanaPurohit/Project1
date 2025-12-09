const Client = require('../models/Client');
const { processImage, deleteImage } = require('../utils/imageProcessor');

/**
 * @desc    Get all clients
 * @route   GET /api/clients
 * @access  Public
 */
exports.getAllClients = async (req, res, next) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all clients (admin view)
 * @route   GET /api/admin/clients
 * @access  Private (Admin)
 */
exports.getAdminClients = async (req, res, next) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new client
 * @route   POST /api/admin/clients
 * @access  Private (Admin)
 */
exports.createClient = async (req, res, next) => {
  try {
    const { name, description, designation } = req.body;
    
    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Client image is required'
      });
    }
    
    // Process and save image
    const imagePath = await processImage(req.file.buffer, req.file.originalname);
    
    // Create client
    const client = await Client.create({
      name,
      description,
      designation,
      image: imagePath
    });
    
    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: client
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update client
 * @route   PUT /api/admin/clients/:id
 * @access  Private (Admin)
 */
exports.updateClient = async (req, res, next) => {
  try {
    const { name, description, designation } = req.body;
    const { id } = req.params;
    
    // Find client
    const client = await Client.findById(id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    // Update fields
    if (name) client.name = name;
    if (description) client.description = description;
    if (designation) client.designation = designation;
    
    // If new image uploaded, process and update
    if (req.file) {
      // Delete old image
      await deleteImage(client.image);
      
      // Process and save new image
      const imagePath = await processImage(req.file.buffer, req.file.originalname);
      client.image = imagePath;
    }
    
    await client.save();
    
    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      data: client
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete client
 * @route   DELETE /api/admin/clients/:id
 * @access  Private (Admin)
 */
exports.deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find client
    const client = await Client.findById(id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    // Delete image file
    await deleteImage(client.image);
    
    // Delete client from database
    await Client.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
