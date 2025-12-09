const { processImage, deleteImage } = require('../utils/imageProcessor');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

describe('Image Upload and Processing', () => {
  const testUploadDir = 'test-uploads';
  
  afterEach(async () => {
    // Clean up test uploads directory
    try {
      const uploadPath = path.join(__dirname, '..', testUploadDir);
      await fs.rm(uploadPath, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('processImage', () => {
    it('should crop image to 450x350 pixels', async () => {
      // Create a test image buffer (500x500 red square)
      const testImageBuffer = await sharp({
        create: {
          width: 500,
          height: 500,
          channels: 3,
          background: { r: 255, g: 0, b: 0 }
        }
      })
      .png()
      .toBuffer();

      // Process the image
      const imagePath = await processImage(testImageBuffer, 'test-image.png', testUploadDir);

      // Verify the image was created
      expect(imagePath).toMatch(/^\/test-uploads\/test-image-\d+\.png$/);

      // Read the processed image and check dimensions
      const fullPath = path.join(__dirname, '..', imagePath);
      const metadata = await sharp(fullPath).metadata();

      expect(metadata.width).toBe(450);
      expect(metadata.height).toBe(350);
    });

    it('should handle different image formats', async () => {
      // Create a test JPEG image
      const testImageBuffer = await sharp({
        create: {
          width: 600,
          height: 400,
          channels: 3,
          background: { r: 0, g: 255, b: 0 }
        }
      })
      .jpeg()
      .toBuffer();

      const imagePath = await processImage(testImageBuffer, 'test-image.jpg', testUploadDir);

      expect(imagePath).toMatch(/^\/test-uploads\/test-image-\d+\.jpg$/);

      const fullPath = path.join(__dirname, '..', imagePath);
      const metadata = await sharp(fullPath).metadata();

      expect(metadata.width).toBe(450);
      expect(metadata.height).toBe(350);
    });

    it('should throw error for invalid image buffer', async () => {
      const invalidBuffer = Buffer.from('not an image');

      await expect(
        processImage(invalidBuffer, 'invalid.png', testUploadDir)
      ).rejects.toThrow('Image processing failed');
    });

    it('should create upload directory if it does not exist', async () => {
      const testImageBuffer = await sharp({
        create: {
          width: 500,
          height: 500,
          channels: 3,
          background: { r: 0, g: 0, b: 255 }
        }
      })
      .png()
      .toBuffer();

      const imagePath = await processImage(testImageBuffer, 'test.png', testUploadDir);

      const uploadPath = path.join(__dirname, '..', testUploadDir);
      const dirExists = await fs.access(uploadPath).then(() => true).catch(() => false);

      expect(dirExists).toBe(true);
      expect(imagePath).toMatch(/^\/test-uploads\/test-\d+\.png$/);
    });
  });

  describe('deleteImage', () => {
    it('should delete an existing image', async () => {
      // Create a test image
      const testImageBuffer = await sharp({
        create: {
          width: 500,
          height: 500,
          channels: 3,
          background: { r: 255, g: 255, b: 0 }
        }
      })
      .png()
      .toBuffer();

      const imagePath = await processImage(testImageBuffer, 'delete-test.png', testUploadDir);
      const fullPath = path.join(__dirname, '..', imagePath);

      // Verify image exists
      let exists = await fs.access(fullPath).then(() => true).catch(() => false);
      expect(exists).toBe(true);

      // Delete the image
      await deleteImage(imagePath);

      // Verify image is deleted
      exists = await fs.access(fullPath).then(() => true).catch(() => false);
      expect(exists).toBe(false);
    });

    it('should not throw error when deleting non-existent image', async () => {
      await expect(deleteImage('/test-uploads/non-existent.png')).resolves.not.toThrow();
    });

    it('should handle null or undefined path', async () => {
      await expect(deleteImage(null)).resolves.not.toThrow();
      await expect(deleteImage(undefined)).resolves.not.toThrow();
    });
  });
});

describe('Multer Configuration', () => {
  const upload = require('../middleware/upload');

  it('should export multer instance', () => {
    expect(upload).toBeDefined();
    expect(typeof upload.single).toBe('function');
    expect(typeof upload.array).toBe('function');
  });
});

describe('Error Handler', () => {
  const handleUploadError = require('../middleware/errorHandler');
  const multer = require('multer');

  it('should handle LIMIT_FILE_SIZE error', () => {
    const err = new multer.MulterError('LIMIT_FILE_SIZE');
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    handleUploadError(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'File size too large. Maximum size is 5MB.',
    });
  });

  it('should handle invalid file type error', () => {
    const err = new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)');
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    handleUploadError(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Only image files are allowed (jpeg, jpg, png, gif, webp)',
    });
  });

  it('should pass other errors to next middleware', () => {
    const err = new Error('Some other error');
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    handleUploadError(err, req, res, next);

    expect(next).toHaveBeenCalledWith(err);
  });
});
