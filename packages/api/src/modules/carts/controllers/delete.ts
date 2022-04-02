import { FastifyInstance } from 'fastify';
import { Cart } from '../schema';

interface Context {
  Params: { id: string; },
}

export default (fastify: FastifyInstance) => {
  fastify.delete<Context>('/carts/:id', {
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
        throw fastify.httpErrors.forbidden('Not allowed to delete carts');
      }

      await fastify.mongoose.model<Cart>('Cart').deleteOne({ _id: request.params.id });

      return {};
    }
  });
}
