import { FastifySchema } from 'fastify';

export const createProductSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['name', 'description', 'price', 'category', 'stock'],
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 100 },
      description: { type: 'string', minLength: 1, maxLength: 1000 },
      price: { type: 'number', minimum: 0 },
      category: { type: 'string', minLength: 1, maxLength: 50 },
      stock: { type: 'integer', minimum: 0 },
      images: { 
        type: 'array', 
        items: { type: 'string', format: 'uri' },
        maxItems: 10
      }
    }
  }
};

export const updateProductSchema: FastifySchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 100 },
      description: { type: 'string', minLength: 1, maxLength: 1000 },
      price: { type: 'number', minimum: 0 },
      category: { type: 'string', minLength: 1, maxLength: 50 },
      stock: { type: 'integer', minimum: 0 },
      images: { 
        type: 'array', 
        items: { type: 'string', format: 'uri' },
        maxItems: 10
      },
      isActive: { type: 'boolean' }
    }
  }
};

export const getProductSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }
    }
  }
};

export const getProductsSchema: FastifySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'integer', minimum: 1, default: 1 },
      limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
      category: { type: 'string' },
      minPrice: { type: 'number', minimum: 0 },
      maxPrice: { type: 'number', minimum: 0 },
      inStock: { type: 'boolean' },
      search: { type: 'string' }
    }
  }
};
