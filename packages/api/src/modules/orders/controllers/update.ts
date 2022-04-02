import { FastifyInstance } from 'fastify';
import { Order, OrderJson } from '../schema';

interface Context {
  Params: { id: string };

  Body: {
    status?: 'notPaid' | 'paid' | 'shipped' | 'done';
    trackingNumber?: string;
  };
}

export default (fastify: FastifyInstance) => {
  fastify.patch<Context>('/orders/:id', {
    schema: {
      params: {
        id: {
          type: 'string',
          pattern: '^[0-9a-fA-F]{24}$',
        },
      },
      body: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['notPaid', 'paid', 'shipped', 'done'],
          },
          trackingNumber: {
            type: 'string',
          },
        },
      },
      response: {
        200: OrderJson,
      },
    },
    preHandler: [fastify.authenticate],
    handler: async (request) => {
      if (!request.user.isAdmin) {
        throw fastify.httpErrors.forbidden('Not allowed to udpate orders');
      }

      const order = await fastify.mongoose.model<Order>('Order').findById(request.params.id).populate(['user.user', 'items.product', 'promocodes.promocode']);
      if (!order) {
        throw fastify.httpErrors.notFound('Order could not be found');
      }

      const { body } = request;

      if (body.status && body.status !== order.status) {
        order.status = body.status;
      }

      if (typeof body.trackingNumber !== 'undefined' && body.trackingNumber !== order.trackingNumber) {
        order.trackingNumber = body.trackingNumber;
      }

      order.updatedTime = new Date();
      await order.save();

      return order;
    }
  });
}
