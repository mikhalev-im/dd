import { FastifyInstance } from 'fastify';
import { stringify } from 'querystring';
import https from 'https';
import { Order } from '../schema';

interface Context {
  Params: {
    id: string;
  };
  Body: {
    cartId: string;
    comment?: string;
  };
}

export default (fastify: FastifyInstance) => {
  fastify.post<Context>('/orders/:id/pay', {
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
        201: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
            },
          },
        },
      },
    },
    preHandler: [fastify.authenticate],
    handler: async (request) => {
      const { user } = request;

      const order = await fastify.mongoose.model<Order>('Order').findById(request.params.id);
      if (!order || order.user.user.toString() !== user._id.toString()) {
        throw fastify.httpErrors.notFound('Order could not be found');
      }

      if (order.status !== 'notPaid') {
        throw fastify.httpErrors.badRequest('Order is already paid');
      }

      const data = stringify({
        sum: order.total,
        label: order._id.toString(),
        receiver: fastify.config.YANDEX_WALLET,
        'quickpay-form': 'shop',
        paymentType: 'AC',
        successURL: `${fastify.config.BASE_URL}/profile`,
        targets: `DarlingDove Заказ №${order.shortId}`,
      });

      const options = {
        host: 'yoomoney.ru',
        port: 443,
        path: '/quickpay/confirm.xml',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': data.length,
        },
      };

      const url = await new Promise((resolve, reject) => {
        // request object
        const req = https.request(options, res => {
          res.on('data', () => {});
          res.on('end', () => resolve(res.headers.location));
          res.on('error', reject);
        });

        // req error
        req.on('error', reject);

        //send request witht the postData form
        req.write(data);
        req.end();
      });

      return { url };
    }
  });
}
