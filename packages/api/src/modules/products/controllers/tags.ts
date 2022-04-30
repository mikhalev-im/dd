import { FastifyInstance } from 'fastify';
import { Product } from '../schema';

export default (fastify: FastifyInstance) => {
  fastify.get('/products/tags', {
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    },
    handler: async () => {
      const tags = await fastify.mongoose.model<Product>('Product').distinct('tags');
      return tags;
    }
  });
}
