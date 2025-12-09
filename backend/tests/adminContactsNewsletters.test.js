const request = require('supertest');
const jwt = require('jsonwebtoken');

// Mock the database connection
jest.mock('../utils/db', () => jest.fn());

// Mock the models
jest.mock('../models/Contact');
jest.mock('../models/Newsletter');
jest.mock('../models/Admin');

const Contact = require('../models/Contact');
const Newsletter = require('../models/Newsletter');
const Admin = require('../models/Admin');
const app = require('../server');

describe('Admin Contact and Newsletter Management', () => {
  let authToken;

  beforeAll(() => {
    // Create a valid JWT token for testing
    authToken = jwt.sign(
      { id: 'admin123', username: 'testadmin' },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/admin/contacts', () => {
    it('should return all contact submissions for authenticated admin', async () => {
      const mockContacts = [
        {
          _id: '1',
          fullName: 'John Doe',
          email: 'john@example.com',
          mobileNumber: '+1234567890',
          city: 'New York',
          submittedAt: new Date()
        },
        {
          _id: '2',
          fullName: 'Jane Smith',
          email: 'jane@example.com',
          mobileNumber: '+0987654321',
          city: 'Los Angeles',
          submittedAt: new Date()
        }
      ];

      Contact.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockContacts)
      });

      const res = await request(app)
        .get('/api/admin/contacts')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0]).toHaveProperty('fullName');
      expect(res.body.data[0]).toHaveProperty('email');
      expect(res.body.data[0]).toHaveProperty('mobileNumber');
      expect(res.body.data[0]).toHaveProperty('city');
    });

    it('should return empty array when no contacts exist', async () => {
      Contact.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([])
      });

      const res = await request(app)
        .get('/api/admin/contacts')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(0);
      expect(res.body.data).toEqual([]);
    });

    it('should reject request without authentication token', async () => {
      const res = await request(app).get('/api/admin/contacts');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject request with invalid token', async () => {
      const res = await request(app)
        .get('/api/admin/contacts')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/admin/contacts/:id', () => {
    it('should delete contact submission for authenticated admin', async () => {
      const mockContact = {
        _id: '123',
        fullName: 'John Doe',
        email: 'john@example.com',
        mobileNumber: '+1234567890',
        city: 'New York',
        deleteOne: jest.fn().mockResolvedValue({})
      };

      Contact.findById = jest.fn().mockResolvedValue(mockContact);

      const res = await request(app)
        .delete('/api/admin/contacts/123')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Contact submission deleted successfully');
      expect(mockContact.deleteOne).toHaveBeenCalled();
    });

    it('should return 404 when contact not found', async () => {
      Contact.findById = jest.fn().mockResolvedValue(null);

      const res = await request(app)
        .delete('/api/admin/contacts/nonexistent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Contact submission not found');
    });

    it('should return 400 for invalid contact ID', async () => {
      const castError = new Error('Cast to ObjectId failed');
      castError.name = 'CastError';
      Contact.findById = jest.fn().mockRejectedValue(castError);

      const res = await request(app)
        .delete('/api/admin/contacts/invalid-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid contact ID');
    });

    it('should reject request without authentication token', async () => {
      const res = await request(app).delete('/api/admin/contacts/123');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/admin/subscriptions', () => {
    it('should return all newsletter subscriptions for authenticated admin', async () => {
      const mockSubscriptions = [
        {
          _id: '1',
          email: 'subscriber1@example.com',
          subscribedAt: new Date(),
          isActive: true
        },
        {
          _id: '2',
          email: 'subscriber2@example.com',
          subscribedAt: new Date(),
          isActive: true
        }
      ];

      Newsletter.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockSubscriptions)
      });

      const res = await request(app)
        .get('/api/admin/subscriptions')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0]).toHaveProperty('email');
      expect(res.body.data[0]).toHaveProperty('subscribedAt');
    });

    it('should return empty array when no subscriptions exist', async () => {
      Newsletter.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([])
      });

      const res = await request(app)
        .get('/api/admin/subscriptions')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(0);
      expect(res.body.data).toEqual([]);
    });

    it('should reject request without authentication token', async () => {
      const res = await request(app).get('/api/admin/subscriptions');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject request with invalid token', async () => {
      const res = await request(app)
        .get('/api/admin/subscriptions')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/admin/subscriptions/:id', () => {
    it('should delete newsletter subscription for authenticated admin', async () => {
      const mockSubscription = {
        _id: '123',
        email: 'subscriber@example.com',
        subscribedAt: new Date(),
        isActive: true,
        deleteOne: jest.fn().mockResolvedValue({})
      };

      Newsletter.findById = jest.fn().mockResolvedValue(mockSubscription);

      const res = await request(app)
        .delete('/api/admin/subscriptions/123')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Newsletter subscription deleted successfully');
      expect(mockSubscription.deleteOne).toHaveBeenCalled();
    });

    it('should return 404 when subscription not found', async () => {
      Newsletter.findById = jest.fn().mockResolvedValue(null);

      const res = await request(app)
        .delete('/api/admin/subscriptions/nonexistent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Newsletter subscription not found');
    });

    it('should return 400 for invalid subscription ID', async () => {
      const castError = new Error('Cast to ObjectId failed');
      castError.name = 'CastError';
      Newsletter.findById = jest.fn().mockRejectedValue(castError);

      const res = await request(app)
        .delete('/api/admin/subscriptions/invalid-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid subscription ID');
    });

    it('should reject request without authentication token', async () => {
      const res = await request(app).delete('/api/admin/subscriptions/123');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
