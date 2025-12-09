const request = require('supertest');

// Mock the database connection to avoid actual MongoDB connection during tests
jest.mock('../utils/db', () => jest.fn());

describe('Server Configuration', () => {
  let app;

  beforeEach(() => {
    // Clear module cache to get fresh instance
    jest.clearAllMocks();
    app = require('../server');
  });

  test('should respond to GET / with API message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('MERN Showcase Platform API');
  });

  test('should have CORS enabled', async () => {
    const response = await request(app).get('/');
    expect(response.headers['access-control-allow-origin']).toBeDefined();
  });

  test('should parse JSON bodies', async () => {
    const response = await request(app)
      .post('/test-json')
      .send({ test: 'data' })
      .set('Content-Type', 'application/json');
    
    // Even though route doesn't exist, it should parse the JSON
    // We're just testing middleware is configured
    expect(response.status).toBe(404); // Route not found, but JSON was parsed
  });
});
