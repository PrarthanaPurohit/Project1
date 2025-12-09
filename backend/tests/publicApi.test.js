const request = require('supertest');

// Mock the database connection
jest.mock('../utils/db', () => jest.fn());

// Mock the models
jest.mock('../models/Project');
jest.mock('../models/Client');
jest.mock('../models/Contact');
jest.mock('../models/Newsletter');

const Project = require('../models/Project');
const Client = require('../models/Client');
const Contact = require('../models/Contact');
const Newsletter = require('../models/Newsletter');
const app = require('../server');

describe('Public API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/projects', () => {
    it('should return empty array when no projects exist', async () => {
      Project.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([])
      });

      const res = await request(app).get('/api/projects');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
      expect(res.body.count).toBe(0);
    });

    it('should return all projects', async () => {
      const mockProjects = [
        { name: 'Project 1', description: 'Description 1', image: '/uploads/project1.jpg' },
        { name: 'Project 2', description: 'Description 2', image: '/uploads/project2.jpg' }
      ];

      Project.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockProjects)
      });

      const res = await request(app).get('/api/projects');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0]).toHaveProperty('name');
      expect(res.body.data[0]).toHaveProperty('description');
      expect(res.body.data[0]).toHaveProperty('image');
    });
  });

  describe('GET /api/clients', () => {
    it('should return empty array when no clients exist', async () => {
      Client.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([])
      });

      const res = await request(app).get('/api/clients');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
      expect(res.body.count).toBe(0);
    });

    it('should return all clients', async () => {
      const mockClients = [
        { 
          name: 'Client 1', 
          description: 'Great service!', 
          designation: 'CEO',
          image: '/uploads/client1.jpg' 
        },
        { 
          name: 'Client 2', 
          description: 'Excellent work!', 
          designation: 'Manager',
          image: '/uploads/client2.jpg' 
        }
      ];

      Client.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockClients)
      });

      const res = await request(app).get('/api/clients');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0]).toHaveProperty('name');
      expect(res.body.data[0]).toHaveProperty('description');
      expect(res.body.data[0]).toHaveProperty('designation');
      expect(res.body.data[0]).toHaveProperty('image');
    });
  });

  describe('POST /api/contact', () => {
    it('should submit contact form with valid data', async () => {
      const contactData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        mobileNumber: '+1234567890',
        city: 'New York'
      };

      const mockContact = { ...contactData, _id: '123', submittedAt: new Date() };
      Contact.create = jest.fn().mockResolvedValue(mockContact);

      const res = await request(app)
        .post('/api/contact')
        .send(contactData);
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Contact form submitted successfully');
      expect(res.body.data).toHaveProperty('fullName', 'John Doe');
      expect(res.body.data).toHaveProperty('email', 'john@example.com');
      expect(res.body.data).toHaveProperty('mobileNumber', '+1234567890');
      expect(res.body.data).toHaveProperty('city', 'New York');
      expect(Contact.create).toHaveBeenCalledWith(contactData);
    });

    it('should reject contact form with missing fullName', async () => {
      const contactData = {
        email: 'john@example.com',
        mobileNumber: '+1234567890',
        city: 'New York'
      };

      const res = await request(app)
        .post('/api/contact')
        .send(contactData);
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });

    it('should reject contact form with invalid email', async () => {
      const contactData = {
        fullName: 'John Doe',
        email: 'invalid-email',
        mobileNumber: '+1234567890',
        city: 'New York'
      };

      const res = await request(app)
        .post('/api/contact')
        .send(contactData);
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject contact form with empty fields', async () => {
      const contactData = {
        fullName: '',
        email: '',
        mobileNumber: '',
        city: ''
      };

      const res = await request(app)
        .post('/api/contact')
        .send(contactData);
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/newsletter/subscribe', () => {
    it('should subscribe with valid email', async () => {
      const subscriptionData = {
        email: 'subscriber@example.com'
      };

      const mockSubscription = { 
        email: 'subscriber@example.com', 
        _id: '123', 
        subscribedAt: new Date(),
        isActive: true 
      };

      Newsletter.findOne = jest.fn().mockResolvedValue(null);
      Newsletter.create = jest.fn().mockResolvedValue(mockSubscription);

      const res = await request(app)
        .post('/api/newsletter/subscribe')
        .send(subscriptionData);
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Successfully subscribed to newsletter');
      expect(res.body.data).toHaveProperty('email', 'subscriber@example.com');
      expect(Newsletter.create).toHaveBeenCalledWith(subscriptionData);
    });

    it('should reject subscription with invalid email', async () => {
      const subscriptionData = {
        email: 'invalid-email'
      };

      const res = await request(app)
        .post('/api/newsletter/subscribe')
        .send(subscriptionData);
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject subscription with missing email', async () => {
      const res = await request(app)
        .post('/api/newsletter/subscribe')
        .send({});
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject duplicate email subscription', async () => {
      const subscriptionData = {
        email: 'duplicate@example.com'
      };

      const existingSubscription = {
        email: 'duplicate@example.com',
        isActive: true
      };

      Newsletter.findOne = jest.fn().mockResolvedValue(existingSubscription);

      const res = await request(app)
        .post('/api/newsletter/subscribe')
        .send(subscriptionData);
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already subscribed');
    });

    it('should reactivate inactive subscription', async () => {
      const subscriptionData = {
        email: 'inactive@example.com'
      };

      const inactiveSubscription = {
        email: 'inactive@example.com',
        isActive: false,
        save: jest.fn().mockResolvedValue({
          email: 'inactive@example.com',
          isActive: true,
          subscribedAt: new Date()
        })
      };

      Newsletter.findOne = jest.fn().mockResolvedValue(inactiveSubscription);

      const res = await request(app)
        .post('/api/newsletter/subscribe')
        .send(subscriptionData);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('reactivated');
      expect(inactiveSubscription.save).toHaveBeenCalled();
    });
  });
});
