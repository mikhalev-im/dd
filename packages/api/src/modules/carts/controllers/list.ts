import { FastifyInstance } from 'fastify';
import { Cart, CartJson } from '../schema';

interface Query {
  limit: number;
  offset: number;
  sortBy: string;
  order: string;
}

interface Context {
  Querystring: Query;
}

export default (fastify: FastifyInstance) => {
  fastify.get<Context>('/carts', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            default: 25,
          },
          offset: {
            type: 'number',
            default: 0,
          },
          sortBy: {
            type: 'string',
            enum: ['createdTime'],
            default: 'createdTime',
          },
          order: {
            type: 'string',
            enum: ['asc', 'desc'],
          },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: CartJson,
            },
            total: {
              type: 'number',
            }
          },
        },
      },
    },
    preHandler: [fastify.authenticate],
    handler: async (request) => {
      if (!request.user.isAdmin) {
        throw fastify.httpErrors.forbidden('Not allowed to fetch carts');
      }

      const { limit, offset, sortBy, order } = request.query;
      const Cart = fastify.mongoose.model<Cart>('Cart');

      const total = await Cart.countDocuments({});
      const data = await Cart.find({}).limit(limit).skip(offset).sort({ [sortBy]: order }).populate(['items.product', 'promocodes.promocode']);

      return { data, total };
    }
  });
}
