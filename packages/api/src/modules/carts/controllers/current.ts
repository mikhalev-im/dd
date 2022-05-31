import { FastifyInstance } from 'fastify';
import { Cart, CartJson } from '../schema';

export default (fastify: FastifyInstance) => {
  fastify.get('/carts/current', {
    schema: {
      response: {
        200: CartJson,
      },
    },
    handler: async (request) => {
      const { cartId } = request.cookies;

      if (!cartId) {
        throw fastify.httpErrors.notFound('No cart with such id found');
      }

      const cart = await fastify.mongoose.model<Cart>('Cart').findById(cartId).populate(['items.product', 'promocodes.promocode']);
      if (!cart) {
        throw fastify.httpErrors.notFound('No cart with such id found');
      }

      return cart;
    }
  });
}
