import { FastifyInstance } from 'fastify';
import { Cart, CartJson } from '../schema';

interface Context {
  Params: { id: string };
}

export default (fastify: FastifyInstance) => {
  fastify.get<Context>('/carts/:id', {
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
        200: CartJson,
      },
    },
    handler: async (request) => {
      const cart = await fastify.mongoose.model<Cart>('Cart').findById(request.params.id).populate(['items.product', 'promocodes.promocode']);
      if (!cart) {
        throw fastify.httpErrors.notFound('No cart with such id found');
      }

      return cart;
    }
  });
}
