import { FastifyInstance } from 'fastify';
import { Cart, CartJson } from '../schema';

interface Context {
  Params: { productId: string; },
}

export default (fastify: FastifyInstance) => {
  fastify.delete<Context>('/carts/items/:productId', {
    schema: {
      params: {
        id: {
          type: 'string',
          pattern: '^[0-9a-fA-F]{24}$',
        },
      },
      response: {
        200: CartJson,
      },
    },
    handler: async (request) => {
      const { cartId } = request.cookies;

      if (!cartId) {
        throw fastify.httpErrors.notFound('No cart with such id found');
      }

      const Cart = fastify.mongoose.model<Cart>('Cart');
      let cart = await Cart.findById(cartId);

      if (!cart) {
        cart = await Cart.create({});
        return cart;
      }

      cart.items = cart.items.filter(item => item.product.toString() !== request.params.productId);
      await cart.calcDelivery();
      await cart.save();

      return cart;
    }
  });
}
