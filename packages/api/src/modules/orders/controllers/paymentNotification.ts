import { FastifyInstance } from 'fastify';
import { createHash } from 'crypto';
import { Order } from '../schema';
import { User } from '../../users/schema';

interface Context {
  Body: {
    sha1_hash: string;
    notification_type: string;
    operation_id: string;
    amount: string;
    currency: string;
    datetime: string;
    sender: string;
    codepro: string;
    label: string;
    unaccepted: string;
  };
}

export default (fastify: FastifyInstance) => {
  fastify.post<Context>('/orders/paymentNotification', {
    schema: {
      response: {
        204: {},
      },
    },
    handler: async (request) => {
      const { body } = request;

      // no erros should be thrown on this route
      if (!body) return {};

      fastify.log.info({ body }, 'incoming payment notification');

      // check hash
      if (!body.sha1_hash) return;

      const hashStr = `${body.notification_type}&${body.operation_id}&${body.amount}&${body.currency}&${body.datetime}&${body.sender}&${body.codepro}&${process.env.YANDEX_PAYMENT_NOTIFICATION_SECRET}&${body.label}`;
      const myHash = createHash('sha1');
      myHash.update(hashStr);

      const hashResult = myHash.digest('hex');

      fastify.log.info({ hashResult }, 'payment notification hash result');

      if (hashResult !== body.sha1_hash) {
        fastify.log.error({ hashResult, hash: body.sha1_hash }, 'payment notification hash does not match');
        return {};
      }

      // payment not accepted
      if (body.unaccepted === 'true') return {};
      // payment is protected with code
      if (body.codepro === 'true') return {};
      // payment not from this store
      if (!body.label) return {};

      const order = await fastify.mongoose.model<Order>('Order').findById(body.label);
      // order does not exist
      if (!order) {
        fastify.log.error({ body }, 'payment notification order was not found');
        return;
      }
      // order already paid
      if (order.status === 'paid') return {};

      // update order status
      order.status = 'paid';
      order.updatedTime = new Date();
      await order.save();

      // send mail to the user
      try {
        const user = await fastify.mongoose.model<User>('User').findById(order.user.user);
        if (!user) {
          fastify.log.error({ body }, 'user of the order was not found while trying to send payment notification email');
          return {};
        }

        await fastify.mailer.sendMail({
          to: user.email,
          subject: `Оплата заказа от ${order.createdTime.toLocaleDateString('ru-RU')} (${order.shortId})`,
          html: `
            <div style="width: 680px; margin: 0 auto; font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #000000;">
              <a href="https://darlingdove.ru" title="Darlingdove" style="display: block; text-align: center;">
                <img src="https://storage.yandexcloud.net/darlingdove/head.png" alt="Darlingdove" style="margin-bottom: 20px; border: none;" />
              </a>
              <p style="margin-top: 0px; margin-bottom: 20px;">Ваш заказ был успешно оплачен!</p>
              <p>Если у Вас есть какие-либо вопросы, просто ответьте на это письмо.</p>
              <a href="https://darlingdove.ru" target="_blank">https://darlingdove.ru</a>
              <br/>
              <a href="https://vk.com/darlingdove" target="_blank">https://vk.com/darlingdove</a>
            </div>
          `
        });
      }
      catch (err) {
        fastify.log.error({ body, err }, 'error sending payment notification to the user');
      }

      return {};
    }
  });
}
