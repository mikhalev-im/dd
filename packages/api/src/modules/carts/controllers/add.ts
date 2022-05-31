import { FastifyInstance } from 'fastify';
import { Product } from '../../products/schema';
import { Cart, CartJson } from '../schema';

interface Context {
  Params: { productId: string };
  Body: { qty: number };
}

export default (fastify: FastifyInstance) => {
  fastify.post<Context>('/carts/items/:productId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          productId: {
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$',
          },
        },
      },
      body: {
        type: 'object',
        properties: {
          qty: {
            type: 'number',
            minimum: 1,
            default: 1,
          },
        },
      },
      response: {
        200: CartJson,
      },
    },
    handler: async (request, reply) => {
      // check if such product exists
      const { productId } = request.params;
      const product = await fastify.mongoose.model<Product>('Product').findById(productId);
      if (!product || product.qty <= 0) {
        throw fastify.httpErrors.notFound('No product with such id found');
      }

      const Cart = fastify.mongoose.model<Cart>('Cart');
      const { cartId } = request.cookies;

      let cart;
      if (cartId) {
        cart = await Cart.findById(cartId);
      }
      if (!cart) {
        cart = await Cart.create({});
      }

      // if item already in the cart - update the qty
      const item = cart.items.find((i) => i.product.toString() === productId);
      if (item) {
        item.qty += request.body.qty;
      }
      else {
        cart.items.push({
          product: product._id,
          qty: request.body.qty
        });
      }

      await cart.calcDelivery();
      await cart.save();

      reply.setCookie('cartId', cart._id.toString(), {
        sameSite: true,
        httpOnly: true,
        secure: fastify.config.NODE_ENV === 'production',
        path: '/',
      });

      return cart;
    }
  });
}
