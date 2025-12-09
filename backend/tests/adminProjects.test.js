const request = require('supertest');
const mongoose = require('mongoose');
const Project = require('../models/Project');
const { generateToken } = require('../utils/jwt');
const path = require('path');
const fs = require('fs').promises;

// Mock the database connection
jest.mock('../utils/db', () => jest.fn());

// Mock image processor
jest.mock('../utils/imageProcessor', () => ({
  processImage: jest.fn().mockResolvedValue('/uploads/test-image-123.jpg'),
  deleteImage: jest.fn().mockResolvedValue()
}));

const { processImage, deleteImage } = require('../utils/imageProcessor');

let app;
let authToken;

beforeEach(() => {
  jest.clearAllMocks();
  app = require('../server');
  
  // Generate a valid auth token for tests
  authToken = generateToken({ id: new mongoose.Types.ObjectId().toString() });
});

describe('Admin Project Endpoints', () => {
  describe('POST /api/admin/projects', () => {
    beforeEach(() => {
      Project.create = jest.fn();
    });

    it('should create a new project with image', async () => {
      const mockProject = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Test Project',
        description: 'This is a test project description',
        image: '/uploads/test-image-123.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      Project.create.mockResolvedValue(mockProject);

      const testImagePath = path.join(__dirname, 'test-image.jpg');
      const testImageBuffer = Buffer.from('fake-image-data');
      await fs.writeFile(testImagePath, testImageBuffer);

      const response = await request(app)
        .post('/api/admin/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .field('name', 'Test Project')
        .field('description', 'This is a test project description')
        .attach('image', testImagePath);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('name', 'Test Project');
      expect(response.body.data).toHaveProperty('description', 'This is a test project description');
      expect(response.body.data).toHaveProperty('image');
      expect(response.body.data.image).toMatch(/^\/uploads\//);
      expect(processImage).toHaveBeenCalled();

      await fs.unlink(testImagePath).catch(() => {});
    });

    it('should reject project creation without authentication', async () => {
      const response = await request(app)
        .post('/api/admin/projects')
        .field('name', 'Test Project')
        .field('description', 'Test description');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject project creation without image', async () => {
      const response = await request(app)
        .post('/api/admin/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .field('name', 'Test Project')
        .field('description', 'Test description');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('image is required');
    });

    it('should reject project creation with empty name', async () => {
      const response = await request(app)
        .post('/api/admin/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .field('name', '')
        .field('description', 'Test description');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject project creation with empty description', async () => {
      const response = await request(app)
        .post('/api/admin/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .field('name', 'Test Project')
        .field('description', '');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/admin/projects', () => {
    beforeEach(() => {
      Project.find = jest.fn();
    });

    it('should get all projects for admin', async () => {
      const mockProjects = [
        { name: 'Project 1', description: 'Description 1', image: '/uploads/test1.jpg' },
        { name: 'Project 2', description: 'Description 2', image: '/uploads/test2.jpg' }
      ];

      Project.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockProjects)
      });

      const response = await request(app)
        .get('/api/admin/projects')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toHaveLength(2);
    });

    it('should reject unauthenticated access', async () => {
      const response = await request(app)
        .get('/api/admin/projects');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/admin/projects/:id', () => {
    beforeEach(() => {
      Project.findById = jest.fn();
    });

    it('should update project without changing image', async () => {
      const mockProject = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Original Project',
        description: 'Original description',
        image: '/uploads/original.jpg',
        save: jest.fn().mockResolvedValue({
          _id: new mongoose.Types.ObjectId(),
          name: 'Updated Project',
          description: 'Updated description',
          image: '/uploads/original.jpg'
        })
      };

      Project.findById.mockResolvedValue(mockProject);

      const response = await request(app)
        .put(`/api/admin/projects/${mockProject._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .field('name', 'Updated Project')
        .field('description', 'Updated description');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Project');
      expect(response.body.data.description).toBe('Updated description');
      expect(mockProject.save).toHaveBeenCalled();
    });

    it('should update project with new image', async () => {
      const mockProject = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Original Project',
        description: 'Original description',
        image: '/uploads/original.jpg',
        save: jest.fn().mockResolvedValue({
          _id: new mongoose.Types.ObjectId(),
          name: 'Updated Project',
          description: 'Updated description',
          image: '/uploads/test-image-123.jpg'
        })
      };

      Project.findById.mockResolvedValue(mockProject);

      const testImagePath = path.join(__dirname, 'test-image.jpg');
      const testImageBuffer = Buffer.from('fake-image-data');
      await fs.writeFile(testImagePath, testImageBuffer);

      const response = await request(app)
        .put(`/api/admin/projects/${mockProject._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .field('name', 'Updated Project')
        .field('description', 'Updated description')
        .attach('image', testImagePath);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Project');
      expect(deleteImage).toHaveBeenCalledWith('/uploads/original.jpg');
      expect(processImage).toHaveBeenCalled();

      await fs.unlink(testImagePath).catch(() => {});
    });

    it('should return 404 for non-existent project', async () => {
      Project.findById.mockResolvedValue(null);

      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/admin/projects/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .field('name', 'Updated Project')
        .field('description', 'Updated description');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should reject unauthenticated update', async () => {
      const projectId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/admin/projects/${projectId}`)
        .field('name', 'Updated Project')
        .field('description', 'Updated description');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/admin/projects/:id', () => {
    beforeEach(() => {
      Project.findById = jest.fn();
      Project.findByIdAndDelete = jest.fn();
    });

    it('should delete a project', async () => {
      const mockProject = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Project to Delete',
        description: 'This will be deleted',
        image: '/uploads/delete-me.jpg'
      };

      Project.findById.mockResolvedValue(mockProject);
      Project.findByIdAndDelete.mockResolvedValue(mockProject);

      const response = await request(app)
        .delete(`/api/admin/projects/${mockProject._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted successfully');
      expect(deleteImage).toHaveBeenCalledWith('/uploads/delete-me.jpg');
      expect(Project.findByIdAndDelete).toHaveBeenCalledWith(mockProject._id.toString());
    });

    it('should return 404 for non-existent project', async () => {
      Project.findById.mockResolvedValue(null);

      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/admin/projects/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should reject unauthenticated delete', async () => {
      const projectId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/admin/projects/${projectId}`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
