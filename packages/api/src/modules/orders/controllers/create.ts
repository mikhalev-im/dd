import { FastifyInstance } from 'fastify';
import { Order, OrderJson } from '../schema';

interface Context {
  Body: {};
}

export default (fastify: FastifyInstance) => {
  fastify.post<Context>('/orders', {
    schema: {
      body: {
        type: 'object',
        required: [],
        properties: {
          name: {
            type: 'string',
            minLength: 1,
          },
        },
      },
      response: {
        201: OrderJson,
      },
    },
    preHandler: [fastify.authenticate],
    handler: async (request) => {
      const Order = fastify.mongoose.model<Order>('Order');
      // TODO: create from cart id
      const newOrder = await Order.create(request.body);

      return newOrder;
    }
  });
}
