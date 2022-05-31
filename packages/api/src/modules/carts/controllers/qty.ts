import { FastifyInstance } from 'fastify';
import { Cart, CartJson } from '../schema';

interface Context {
  Params: {
    productId: string;
  },
  Body: {
    qty: number;
  }
}

export default (fastify: FastifyInstance) => {
  fastify.patch<Context>('/carts/items/:productId/qty', {
    schema: {
      params: {
        id: {
          type: 'string',
          pattern: '^[0-9a-fA-F]{24}$',
        },
      },
      body: {
        qty: {
          type: 'number',
          minimum: 1,
        },
      },
      response: {
        200: CartJson,
      },
    },
    handler: async (request) => {
      const { cartId } = request.cookies;
      const { productId } = request.params;

      if (!cartId) {
        throw fastify.httpErrors.notFound('No cart with such id found');
      }

      const Cart = fastify.mongoose.model<Cart>('Cart');
      let cart = await Cart.findById(cartId);

      if (!cart) {
        cart = await Cart.create({});
        return cart;
      }

      const item = cart.items.find((item) => item.product._id.toString() === productId);
      if (!item) return cart;

      item.qty = request.body.qty;
      await cart.calcDelivery();
      await cart.save();

      return cart;
    }
  });
}
