const fs = require('fs');
const request = require('supertest');
const express = require('express');
const { readData } = require('../items');
const itemsRouter = require('../items');

// Mock fs
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  },
  writeFileSync: jest.fn(),
}));

// Create test app
const app = express();
app.use(express.json());
app.use('/api/items', itemsRouter);

describe('readData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully read and parse JSON data', async () => {
    const mockData = [
      { id: 1, name: 'Test Item' }
    ];
    const mockJsonString = JSON.stringify(mockData);
    
    fs.promises.readFile.mockResolvedValue(mockJsonString);
    
    const result = await readData();
    
    expect(fs.promises.readFile).toHaveBeenCalledWith(expect.stringContaining('items.json'), "utf8");
    expect(result).toEqual(mockData);
  });

  test('should throw error when file reading fails', async () => {
    const mockError = new Error('File not found');
    fs.promises.readFile.mockRejectedValue(mockError);
    
    await expect(readData()).rejects.toThrow('File not found');
  });

  test('should throw error when JSON parsing fails', async () => {
    const invalidJson = '{ invalid json }';
    fs.promises.readFile.mockResolvedValue(invalidJson);
    
    await expect(readData()).rejects.toThrow();
  });
});

describe('GET /api/items', () => {
  const mockData = [
    { id: 1, name: 'Apple iPhone 14', category: 'Electronics', price: 999 },
    { id: 2, name: 'Samsung Galaxy S23', category: 'Electronics', price: 899 },
    { id: 3, name: 'Nike Air Max', category: 'Footwear', price: 150 },
    { id: 4, name: 'Adidas Ultraboost', category: 'Footwear', price: 180 },
    { id: 5, name: 'Apple MacBook Pro', category: 'Electronics', price: 2499 }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    fs.promises.readFile.mockResolvedValue(JSON.stringify(mockData));
  });

  test('should respond with 200 and the list of items', async () => {
    const response = await request(app)
      .get('/api/items')
      .set('Accept', 'application/json');
    
    expect(response.status).toBe(200);
    expect(response.body.items).toEqual(mockData);
  });

  test('should return all items with default pagination', async () => {
    const response = await request(app)
      .get('/api/items')
      .expect(200);

    expect(response.body.items).toHaveLength(5);
    expect(response.body.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalItems: 5,
      pageSize: 10,
      hasNext: false,
      hasPrev: false
    });
  });

  test('should return paginated results with custom limit and page', async () => {
    const response = await request(app)
      .get('/api/items?limit=2&page=2')
      .expect(200);

    expect(response.body.items).toHaveLength(2);
    expect(response.body.items[0]).toEqual(mockData[2]); // Third item (index 2)
    expect(response.body.items[1]).toEqual(mockData[3]); // Fourth item (index 3)
    expect(response.body.pagination).toEqual({
      currentPage: 2,
      totalPages: 3,
      totalItems: 5,
      pageSize: 2,
      hasNext: true,
      hasPrev: true
    });
  });

  test('should filter items by search query', async () => {
    const response = await request(app)
      .get('/api/items?q=apple')
      .expect(200);

    expect(response.body.items).toHaveLength(2);
    expect(response.body.items[0].name).toBe('Apple iPhone 14');
    expect(response.body.items[1].name).toBe('Apple MacBook Pro');
    expect(response.body.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalItems: 2,
      pageSize: 10,
      hasNext: false,
      hasPrev: false
    });
  });
});
