import { FastifyInstance } from 'fastify';
import { ProductController } from '../controllers/product.controller';
import { 
  createProductSchema, 
  updateProductSchema, 
  getProductSchema, 
  getProductsSchema 
} from '../schemas/product.schema';
import { generalRateLimit } from '../middleware/rateLimit.middleware';

export default async function productRoutes(fastify: FastifyInstance) {
  // Apply rate limiting
  fastify.addHook('preHandler', generalRateLimit);

  // Public routes
  fastify.get('/', {
    schema: getProductsSchema,
    preHandler: fastify.optionalAuth,
    handler: ProductController.getProducts
  });

  fastify.get('/:id', {
    schema: getProductSchema,
    preHandler: fastify.optionalAuth,
    handler: ProductController.getProduct
  });

  // Protected routes (require authentication)
  fastify.addHook('preHandler', fastify.authenticate);

  // Create product
  fastify.post('/', {
    schema: createProductSchema,
    handler: ProductController.createProduct
  });

  // Update product
  fastify.put('/:id', {
    schema: updateProductSchema,
    handler: ProductController.updateProduct
  });

  // Delete product
  fastify.delete('/:id', {
    schema: getProductSchema,
    handler: ProductController.deleteProduct
  });

  // Product categories endpoint
  fastify.get('/categories/list', {
    handler: async (request, reply) => {
      // Placeholder for categories
      reply.send({
        success: true,
        data: {
          categories: [
            'Electronics',
            'Clothing',
            'Books',
            'Home & Garden',
            'Sports',
            'Toys',
            'Health & Beauty',
            'Automotive'
          ]
        }
      });
    }
  });

  // Search products endpoint
  fastify.get('/search/:query', {
    handler: async (request, reply) => {
      const query = (request.params as any).query;
      
      // Placeholder for search functionality
      reply.send({
        success: true,
        data: {
          query,
          products: [],
          total: 0,
          message: 'Search functionality placeholder'
        }
      });
    }
  });
}
