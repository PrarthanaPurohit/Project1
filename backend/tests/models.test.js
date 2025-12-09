const mongoose = require('mongoose');
const Project = require('../models/Project');
const Client = require('../models/Client');
const Contact = require('../models/Contact');
const Newsletter = require('../models/Newsletter');
const Admin = require('../models/Admin');

// Mock mongoose connection
jest.mock('../utils/db', () => jest.fn());

describe('Database Models', () => {
  describe('Project Model', () => {
    test('should create a valid project instance', () => {
      const projectData = {
        name: 'Test Project',
        description: 'Test Description',
        image: '/path/to/image.jpg'
      };
      const project = new Project(projectData);
      expect(project.name).toBe(projectData.name);
      expect(project.description).toBe(projectData.description);
      expect(project.image).toBe(projectData.image);
    });

    test('should fail validation without required fields', () => {
      const project = new Project({});
      const validationError = project.validateSync();
      expect(validationError.errors.name).toBeDefined();
      expect(validationError.errors.description).toBeDefined();
      expect(validationError.errors.image).toBeDefined();
    });
  });

  describe('Client Model', () => {
    test('should create a valid client instance', () => {
      const clientData = {
        name: 'John Doe',
        description: 'Great experience',
        designation: 'CEO',
        image: '/path/to/image.jpg'
      };
      const client = new Client(clientData);
      expect(client.name).toBe(clientData.name);
      expect(client.description).toBe(clientData.description);
      expect(client.designation).toBe(clientData.designation);
      expect(client.image).toBe(clientData.image);
    });

    test('should fail validation without required fields', () => {
      const client = new Client({});
      const validationError = client.validateSync();
      expect(validationError.errors.name).toBeDefined();
      expect(validationError.errors.description).toBeDefined();
      expect(validationError.errors.designation).toBeDefined();
      expect(validationError.errors.image).toBeDefined();
    });
  });

  describe('Contact Model', () => {
    test('should create a valid contact instance', () => {
      const contactData = {
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        mobileNumber: '+1234567890',
        city: 'New York'
      };
      const contact = new Contact(contactData);
      expect(contact.fullName).toBe(contactData.fullName);
      expect(contact.email).toBe(contactData.email);
      expect(contact.mobileNumber).toBe(contactData.mobileNumber);
      expect(contact.city).toBe(contactData.city);
      expect(contact.isRead).toBe(false);
    });

    test('should fail validation without required fields', () => {
      const contact = new Contact({});
      const validationError = contact.validateSync();
      expect(validationError.errors.fullName).toBeDefined();
      expect(validationError.errors.email).toBeDefined();
      expect(validationError.errors.mobileNumber).toBeDefined();
      expect(validationError.errors.city).toBeDefined();
    });

    test('should validate email format', () => {
      const contact = new Contact({
        fullName: 'Test User',
        email: 'invalid-email',
        mobileNumber: '1234567890',
        city: 'Test City'
      });
      const validationError = contact.validateSync();
      expect(validationError.errors.email).toBeDefined();
    });
  });

  describe('Newsletter Model', () => {
    test('should create a valid newsletter instance', () => {
      const newsletterData = {
        email: 'subscriber@example.com'
      };
      const newsletter = new Newsletter(newsletterData);
      expect(newsletter.email).toBe(newsletterData.email);
      expect(newsletter.isActive).toBe(true);
    });

    test('should fail validation without email', () => {
      const newsletter = new Newsletter({});
      const validationError = newsletter.validateSync();
      expect(validationError.errors.email).toBeDefined();
    });

    test('should validate email format', () => {
      const newsletter = new Newsletter({
        email: 'not-an-email'
      });
      const validationError = newsletter.validateSync();
      expect(validationError.errors.email).toBeDefined();
    });
  });

  describe('Admin Model', () => {
    test('should create a valid admin instance', () => {
      const adminData = {
        username: 'admin',
        password: 'password123',
        email: 'admin@example.com'
      };
      const admin = new Admin(adminData);
      expect(admin.username).toBe(adminData.username);
      expect(admin.email).toBe(adminData.email);
    });

    test('should fail validation without required fields', () => {
      const admin = new Admin({});
      const validationError = admin.validateSync();
      expect(validationError.errors.username).toBeDefined();
      expect(validationError.errors.password).toBeDefined();
      expect(validationError.errors.email).toBeDefined();
    });

    test('should validate email format', () => {
      const admin = new Admin({
        username: 'testadmin',
        password: 'password123',
        email: 'invalid-email'
      });
      const validationError = admin.validateSync();
      expect(validationError.errors.email).toBeDefined();
    });
  });
});
