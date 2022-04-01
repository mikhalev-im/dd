import { FastifyInstance } from 'fastify';
import { Product, ProductJson } from '../schema';

interface Context {
  Params: { id: string };
}

export default (fastify: FastifyInstance) => {
  fastify.get<Context>('/products/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$',
          },
        },
      },
      response: {
        200: ProductJson,
      },
    },
    handler: async (request) => {
      const product = await fastify.mongoose.model<Product>('Product').findById(request.params.id);
      if (!product) {
        throw fastify.httpErrors.notFound('No product with such id found');
      }

      return product;
    }
  });
}
