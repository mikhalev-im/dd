import { FastifyInstance } from 'fastify';
import { Types } from 'mongoose';
import { Order, OrderJson } from '../schema';

interface Query {
  limit: number;
  offset: number;
  sortBy: string;
  order: string;
  category: string;
}

interface Context {
  Querystring: Query;
}

interface DbQueryFilters {
  ['user.user']?: Types.ObjectId;
}

export default (fastify: FastifyInstance) => {
  fastify.get<Context>('/orders', {
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
              items: OrderJson,
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
      const { limit, offset, sortBy, order } = request.query;
      const Order = fastify.mongoose.model<Order>('Order');

      const filters: DbQueryFilters = {};
      if (!request.user.isAdmin) {
        filters['user.user'] = request.user._id;
      }

      const total = await Order.countDocuments(filters);
      const data = await Order.find(filters).limit(limit).skip(offset).sort({ [sortBy]: order }).populate(['user.user', 'items.product', 'promocodes.promocode']);

      return { data, total };
    }
  });
}
