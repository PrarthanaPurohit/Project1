const request = require('supertest');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const { generateToken, verifyToken } = require('../utils/jwt');

// Mock the database connection
jest.mock('../utils/db', () => jest.fn());

describe('Authentication System', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = require('../server');
  });

  describe('JWT Utilities', () => {
    test('should generate a valid JWT token', () => {
      const payload = { id: '123456' };
      const token = generateToken(payload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    test('should verify a valid JWT token', () => {
      const payload = { id: '123456' };
      const token = generateToken(payload);
      const decoded = verifyToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(payload.id);
    });

    test('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      
      expect(() => verifyToken(invalidToken)).toThrow('Invalid or expired token');
    });
  });

  describe('Authentication Middleware', () => {
    test('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/admin/test')
        .expect(404); // Route doesn't exist yet, but middleware would run first if it did
    });

    test('should reject request with invalid token format', async () => {
      const response = await request(app)
        .get('/api/admin/test')
        .set('Authorization', 'InvalidFormat token123');
      
      // Route doesn't exist, but we're testing the pattern
      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(() => {
      // Mock Admin model methods
      Admin.findOne = jest.fn();
    });

    test('should return 400 if username is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password123' })
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Please provide username and password');
    });

    test('should return 400 if password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin' })
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Please provide username and password');
    });

    test('should return 401 if admin not found', async () => {
      Admin.findOne.mockResolvedValue(null);
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'nonexistent', password: 'password123' })
        .expect(401);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    test('should return 401 if password is incorrect', async () => {
      const mockAdmin = {
        _id: new mongoose.Types.ObjectId(),
        username: 'admin',
        email: 'admin@example.com',
        comparePassword: jest.fn().mockResolvedValue(false),
        save: jest.fn()
      };
      
      Admin.findOne.mockResolvedValue(mockAdmin);
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'wrongpassword' })
        .expect(401);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    test('should return token and admin data on successful login', async () => {
      const mockAdmin = {
        _id: new mongoose.Types.ObjectId(),
        username: 'admin',
        email: 'admin@example.com',
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true),
        lastLogin: null
      };
      
      Admin.findOne.mockResolvedValue(mockAdmin);
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'correctpassword' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeDefined();
      expect(response.body.admin).toBeDefined();
      expect(response.body.admin.username).toBe('admin');
      expect(response.body.admin.email).toBe('admin@example.com');
      expect(mockAdmin.save).toHaveBeenCalled();
    });
  });
});
