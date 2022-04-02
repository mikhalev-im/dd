import { FastifyInstance } from 'fastify';
import { Types } from 'mongoose';
import { Order, OrderJson } from '../schema';

interface Context {
  Params: { id: string };
}

interface DbQueryFilters {
  ['user.user']?: Types.ObjectId;
}

export default (fastify: FastifyInstance) => {
  fastify.get<Context>('/orders/:id', {
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
        200: OrderJson,
      },
    },
    preHandler: [fastify.authenticate],
    handler: async (request) => {
      const filters: DbQueryFilters = {};
      if (!request.user.isAdmin) {
        filters['user.user'] = request.user._id;
      }

      const order = await fastify.mongoose.model<Order>('Order').findById(request.params.id).populate(['user.user', 'items.product', 'promocodes.promocode']);
      if (!order) {
        throw fastify.httpErrors.notFound('No order with such id found');
      }

      return order;
    }
  });
}
