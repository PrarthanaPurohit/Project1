# Middleware Documentation

## Authentication Middleware

Located in `auth.js`, this middleware verifies JWT tokens for protected routes.

### Usage:
```javascript
const { protect } = require('./middleware/auth');

router.post('/admin/projects', protect, createProject);
```

## Upload Middleware

Located in `upload.js`, this middleware handles file uploads using Multer.

### Configuration:
- **Storage**: Memory storage (files stored in memory for processing)
- **File Size Limit**: 5MB maximum
- **Allowed Types**: jpeg, jpg, png, gif, webp

### Usage:

#### Single File Upload:
```javascript
const upload = require('./middleware/upload');

router.post('/admin/projects', upload.single('image'), createProject);
```

#### Multiple Files Upload:
```javascript
router.post('/admin/gallery', upload.array('images', 10), uploadGallery);
```

### Error Handling:

Use the `handleUploadError` middleware to catch upload errors:

```javascript
const handleUploadError = require('./middleware/errorHandler');

router.post('/admin/projects', 
  upload.single('image'), 
  handleUploadError,
  createProject
);
```

## Image Processing

Located in `utils/imageProcessor.js`, provides functions to process uploaded images.

### Functions:

#### processImage(imageBuffer, filename, uploadDir)
Crops image to 450x350 pixels and saves it.

**Parameters:**
- `imageBuffer` (Buffer): Image buffer from multer
- `filename` (string): Original filename
- `uploadDir` (string): Directory to save (default: 'uploads')

**Returns:** Promise<string> - Relative path to saved image

**Example:**
```javascript
const { processImage } = require('../utils/imageProcessor');

const createProject = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // Process and save image
    const imagePath = await processImage(
      req.file.buffer, 
      req.file.originalname
    );

    // Save to database
    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      image: imagePath,
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

#### deleteImage(imagePath)
Deletes an image file from the filesystem.

**Parameters:**
- `imagePath` (string): Relative path to the image

**Returns:** Promise<void>

**Example:**
```javascript
const { deleteImage } = require('../utils/imageProcessor');

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete image file
    await deleteImage(project.image);

    // Delete from database
    await project.deleteOne();

    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

## Complete Example Route

```javascript
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const handleUploadError = require('../middleware/errorHandler');
const { protect } = require('../middleware/auth');
const { processImage, deleteImage } = require('../utils/imageProcessor');
const Project = require('../models/Project');

// Create project with image upload
router.post('/', 
  protect,
  upload.single('image'),
  handleUploadError,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: 'Image is required' 
        });
      }

      // Process image
      const imagePath = await processImage(
        req.file.buffer,
        req.file.originalname
      );

      // Create project
      const project = await Project.create({
        name: req.body.name,
        description: req.body.description,
        image: imagePath,
      });

      res.status(201).json({ success: true, data: project });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
);

// Delete project
router.delete('/:id',
  protect,
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      
      if (!project) {
        return res.status(404).json({ 
          success: false, 
          message: 'Project not found' 
        });
      }

      // Delete image file
      await deleteImage(project.image);

      // Delete from database
      await project.deleteOne();

      res.json({ 
        success: true, 
        message: 'Project deleted successfully' 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
);

module.exports = router;
```
