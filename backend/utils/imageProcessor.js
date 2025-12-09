const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

/**
 * Process and crop image to 450x350 pixels
 * @param {Buffer} imageBuffer - The image buffer from multer
 * @param {string} filename - The desired filename
 * @param {string} uploadDir - The directory to save the image (default: 'uploads')
 * @returns {Promise<string>} - The path to the saved image
 */
const processImage = async (imageBuffer, filename, uploadDir = 'uploads') => {
  try {
    // Create upload directory if it doesn't exist
    const uploadPath = path.join(__dirname, '..', uploadDir);
    await fs.mkdir(uploadPath, { recursive: true });

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const ext = path.extname(filename);
    const nameWithoutExt = path.basename(filename, ext);
    const processedFilename = `${nameWithoutExt}-${timestamp}${ext}`;
    const outputPath = path.join(uploadPath, processedFilename);

    // Process image: crop to 450x350
    await sharp(imageBuffer)
      .resize(450, 350, {
        fit: 'cover', // Crop to cover the entire area
        position: 'center', // Center the crop
      })
      .toFile(outputPath);

    // Return relative path for storage in database
    return `/${uploadDir}/${processedFilename}`;
  } catch (error) {
    throw new Error(`Image processing failed: ${error.message}`);
  }
};

/**
 * Delete an image file
 * @param {string} imagePath - The relative path to the image
 * @returns {Promise<void>}
 */
const deleteImage = async (imagePath) => {
  try {
    if (!imagePath) return;
    
    const fullPath = path.join(__dirname, '..', imagePath);
    await fs.unlink(fullPath);
  } catch (error) {
    // Log error but don't throw - file might not exist
    console.error(`Failed to delete image: ${error.message}`);
  }
};

module.exports = {
  processImage,
  deleteImage,
};
