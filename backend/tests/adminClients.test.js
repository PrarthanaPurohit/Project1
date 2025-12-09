const request = require('supertest');
const mongoose = require('mongoose');
const Client = require('../models/Client');
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

describe('Admin Client Endpoints', () => {
  describe('POST /api/admin/clients', () => {
    beforeEach(() => {
      Client.create = jest.fn();
    });

    it('should create a new client with image', async () => {
      const mockClient = {
        _id: new mongoose.Types.ObjectId(),
        name: 'John Doe',
        description: 'Great client with excellent feedback',
        designation: 'CEO at TechCorp',
        image: '/uploads/test-image-123.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      Client.create.mockResolvedValue(mockClient);

      const testImagePath = path.join(__dirname, 'test-image.jpg');
      const testImageBuffer = Buffer.from('fake-image-data');
      await fs.writeFile(testImagePath, testImageBuffer);

      const response = await request(app)
        .post('/api/admin/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .field('name', 'John Doe')
        .field('description', 'Great client with excellent feedback')
        .field('designation', 'CEO at TechCorp')
        .attach('image', testImagePath);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('name', 'John Doe');
      expect(response.body.data).toHaveProperty('description', 'Great client with excellent feedback');
      expect(response.body.data).toHaveProperty('designation', 'CEO at TechCorp');
      expect(response.body.data).toHaveProperty('image');
      expect(response.body.data.image).toMatch(/^\/uploads\//);
      expect(processImage).toHaveBeenCalled();

      await fs.unlink(testImagePath).catch(() => {});
    });

    it('should reject client creation without authentication', async () => {
      const response = await request(app)
        .post('/api/admin/clients')
        .field('name', 'John Doe')
        .field('description', 'Great client')
        .field('designation', 'CEO');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject client creation without image', async () => {
      const response = await request(app)
        .post('/api/admin/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .field('name', 'John Doe')
        .field('description', 'Great client')
        .field('designation', 'CEO');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('image is required');
    });

    it('should reject client creation with empty name', async () => {
      const response = await request(app)
        .post('/api/admin/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .field('name', '')
        .field('description', 'Great client')
        .field('designation', 'CEO');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject client creation with empty description', async () => {
      const response = await request(app)
        .post('/api/admin/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .field('name', 'John Doe')
        .field('description', '')
        .field('designation', 'CEO');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject client creation with empty designation', async () => {
      const response = await request(app)
        .post('/api/admin/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .field('name', 'John Doe')
        .field('description', 'Great client')
        .field('designation', '');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('GET /api/admin/clients', () => {
    beforeEach(() => {
      Client.find = jest.fn();
    });

    it('should get all clients for admin', async () => {
      const mockClients = [
        { name: 'Client 1', description: 'Description 1', designation: 'CEO', image: '/uploads/test1.jpg' },
        { name: 'Client 2', description: 'Description 2', designation: 'CTO', image: '/uploads/test2.jpg' }
      ];

      Client.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockClients)
      });

      const response = await request(app)
        .get('/api/admin/clients')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toHaveLength(2);
    });

    it('should reject unauthenticated access', async () => {
      const response = await request(app)
        .get('/api/admin/clients');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('PUT /api/admin/clients/:id', () => {
    beforeEach(() => {
      Client.findById = jest.fn();
    });

    it('should update client without changing image', async () => {
      const mockClient = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Original Name',
        description: 'Original Description',
        designation: 'Original Designation',
        image: '/uploads/original.jpg',
        save: jest.fn().mockResolvedValue({
          _id: new mongoose.Types.ObjectId(),
          name: 'Updated Name',
          description: 'Updated Description',
          designation: 'Updated Designation',
          image: '/uploads/original.jpg'
        })
      };

      Client.findById.mockResolvedValue(mockClient);

      const response = await request(app)
        .put(`/api/admin/clients/${mockClient._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .field('name', 'Updated Name')
        .field('description', 'Updated Description')
        .field('designation', 'Updated Designation');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Name');
      expect(response.body.data.description).toBe('Updated Description');
      expect(response.body.data.designation).toBe('Updated Designation');
      expect(mockClient.save).toHaveBeenCalled();
    });

    it('should update client with new image', async () => {
      const mockClient = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Original Name',
        description: 'Original Description',
        designation: 'Original Designation',
        image: '/uploads/original.jpg',
        save: jest.fn().mockResolvedValue({
          _id: new mongoose.Types.ObjectId(),
          name: 'Updated Name',
          description: 'Updated Description',
          designation: 'Updated Designation',
          image: '/uploads/test-image-123.jpg'
        })
      };

      Client.findById.mockResolvedValue(mockClient);

      const testImagePath = path.join(__dirname, 'test-image.jpg');
      const testImageBuffer = Buffer.from('fake-image-data');
      await fs.writeFile(testImagePath, testImageBuffer);

      const response = await request(app)
        .put(`/api/admin/clients/${mockClient._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .field('name', 'Updated Name')
        .field('description', 'Updated Description')
        .field('designation', 'Updated Designation')
        .attach('image', testImagePath);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Name');
      expect(deleteImage).toHaveBeenCalledWith('/uploads/original.jpg');
      expect(processImage).toHaveBeenCalled();

      await fs.unlink(testImagePath).catch(() => {});
    });

    it('should return 404 for non-existent client', async () => {
      Client.findById.mockResolvedValue(null);

      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/admin/clients/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .field('name', 'Updated Name')
        .field('description', 'Updated Description')
        .field('designation', 'Updated Designation');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should reject unauthenticated update', async () => {
      const clientId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/admin/clients/${clientId}`)
        .field('name', 'Updated Name')
        .field('description', 'Updated Description')
        .field('designation', 'Updated Designation');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('DELETE /api/admin/clients/:id', () => {
    beforeEach(() => {
      Client.findById = jest.fn();
      Client.findByIdAndDelete = jest.fn();
    });

    it('should delete a client', async () => {
      const mockClient = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Client to Delete',
        description: 'This will be deleted',
        designation: 'Test Designation',
        image: '/uploads/delete-me.jpg'
      };

      Client.findById.mockResolvedValue(mockClient);
      Client.findByIdAndDelete.mockResolvedValue(mockClient);

      const response = await request(app)
        .delete(`/api/admin/clients/${mockClient._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted successfully');
      expect(deleteImage).toHaveBeenCalledWith('/uploads/delete-me.jpg');
      expect(Client.findByIdAndDelete).toHaveBeenCalledWith(mockClient._id.toString());
    });

    it('should return 404 for non-existent client', async () => {
      Client.findById.mockResolvedValue(null);

      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/admin/clients/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should reject unauthenticated delete', async () => {
      const clientId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/admin/clients/${clientId}`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
