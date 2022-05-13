import { FastifyInstance } from 'fastify';
import { Product, ProductJson } from '../schema';

interface Context {
  Params: { sku: string };
}

export default (fastify: FastifyInstance) => {
  fastify.get<Context>('/products/sku/:sku', {
    schema: {
      params: {
        type: 'object',
        properties: {
          sku: {
            type: 'string',
          },
        },
      },
      response: {
        200: ProductJson,
      },
    },
    handler: async (request) => {
      const product = await fastify.mongoose.model<Product>('Product').findOne({ sku: request.params.sku });
      if (!product) {
        throw fastify.httpErrors.notFound('No product with such sku found');
      }

      return product;
    }
  });
}
