import { FastifyInstance } from 'fastify';
import { Product } from '../schema';

interface Context {
  Params: { id: string; },
}

export default (fastify: FastifyInstance) => {
  fastify.delete<Context>('/products/:id', {
    schema: {
      params: {
        id: {
          type: 'string',
          pattern: '^[0-9a-fA-F]{24}$',
        },
      },
      response: {
        204: {},
      },
    },
    preHandler: [fastify.authenticate],
    handler: async (request) => {
      if (!request.user.isAdmin) {
        throw fastify.httpErrors.forbidden('Not allowed to delete products');
      }

      await fastify.mongoose.model<Product>('Product').deleteOne({ _id: request.params.id });

      return {};
    }
  });
}
