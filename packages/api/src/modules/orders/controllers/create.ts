import { FastifyInstance } from 'fastify';
import { Cart } from '../../carts/schema';
import { createId } from '../../common/shortid';
import { Product } from '../../products/schema';
import { Order, OrderJson } from '../schema';

interface Context {
  Body: {
    cartId: string;
    comment?: string;
  };
}

export default (fastify: FastifyInstance) => {
  fastify.post<Context>('/orders', {
    schema: {
      body: {
        type: 'object',
        required: [],
        properties: {
          cartId: {
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$',
          },
          comment: {
            type: 'string',
          }
        },
      },
      response: {
        201: OrderJson,
      },
    },
    preHandler: [fastify.authenticate],
    handler: async (request) => {
      const { user } = request;
      const { cartId, comment } = request.body;

      const Order = fastify.mongoose.model<Order>('Order');
      const Cart = fastify.mongoose.model<Cart>('Cart');

      const cart = await Cart.findById(cartId);
      if (!cart) throw fastify.httpErrors.notFound('Cart was not found');
      if (!cart.items.length) throw fastify.httpErrors.badRequest('Cart is empty');

      await cart.populate(['items.product']);

      // subtract product qty
      // and validate that all products are enough in stock
      const items = cart.items.map(item => {
        const product = (item.product as unknown) as Product;

        if (!product) throw fastify.httpErrors.notFound('Some of the products do not exist');

        const newQty = product.qty - item.qty;
        if (newQty < 0) throw fastify.httpErrors.badRequest('Not enough product qty in stock');

        product.qty = newQty;
        product.ordersCount = (product.ordersCount || 0) + 1;

        return {
          product: product._id,
          qty: item.qty,
          price: product.price,
        };
      });

      // calc delivery
      const total = await cart.calcDelivery();

      // save all products if everything is valid;
      // @ts-ignore
      await Promise.all(cart.items.map(async item => await item.product.save()));

      // create order from cart
      const order = await Order.create({
        shortId: createId(),
        items,
        comment,
        promocodes: cart.promocodes,
        user: {
          user: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          country: user.country,
          postalCode: user.postalCode,
          address: user.address,
        },
        total,
        services: cart.services,
        status: 'notPaid',
      });
      await order.save();

      // remove cart items
      cart.items = [];
      cart.services = [];
      cart.promocodes = [];
      cart.updatedTime = new Date();
      await cart.save();

      // populate order items
      await order.populate('items.product');

      // send email
      await fastify.mailer.sendMail({
        to: user.email,
        subject: `Заказ от ${order.createdTime.toLocaleDateString('ru-RU')} (${order.shortId})`,
        html: `
          <div style="width: 680px; margin: 0 auto; font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #000000;">
            <a href="https://darlingdove.ru" title="Darlingdove" style="display: block; text-align: center;">
              <img src="https://storage.yandexcloud.net/darlingdove/head.png" alt="Darlingdove" style="margin-bottom: 20px; border: none;" />
            </a>
            <p style="margin-top: 0px; margin-bottom: 20px;">Ваш заказ.</p>
            <table style="border-collapse: collapse; width: 100%; border-top: 1px solid #DDDDDD; border-left: 1px solid #DDDDDD; margin-bottom: 20px;">
              <thead>
                <tr>
                  <td style="font-size: 12px; border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; background-color: #EFEFEF; font-weight: bold; text-align: left; padding: 7px; color: #222222;" colspan="2">Детализация заказа</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: left; padding: 7px;">
                    <b>ID заказа:</b> ${order.shortId}<br />
                    <b>Дата заказа:</b> ${order.createdTime.toLocaleDateString('ru-RU')}<br />
                    <b>Способ оплаты:</b> Онлайн<br />
                  </td>
                  <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: left; padding: 7px;">
                    <b>E-mail:</b> ${user.email}<br />
                    <b>Статус заказа:</b> Ожидает оплаты<br />
                  </td>
                </tr>
              </tbody>
            </table>
            ${order.comment ? `
              <table style="border-collapse: collapse; width: 100%; border-top: 1px solid #DDDDDD; border-left: 1px solid #DDDDDD; margin-bottom: 20px;">
                <thead>
                  <tr>
                    <td style="font-size: 12px; border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; background-color: #EFEFEF; font-weight: bold; text-align: left; padding: 7px; color: #222222;">Комментарий к заказу</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: left; padding: 7px;">${order.comment}</td>
                  </tr>
                </tbody>
              </table>
            ` : ''}
            <table style="border-collapse: collapse; width: 100%; border-top: 1px solid #DDDDDD; border-left: 1px solid #DDDDDD; margin-bottom: 20px;">
              <thead>
                <tr>
                  <td style="font-size: 12px; border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; background-color: #EFEFEF; font-weight: bold; text-align: left; padding: 7px; color: #222222;">Адрес доставки</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: left; padding: 7px;">${user.address}</td>
                </tr>
              </tbody>
            </table>
            <table style="border-collapse: collapse; width: 100%; border-top: 1px solid #DDDDDD; border-left: 1px solid #DDDDDD; margin-bottom: 20px;">
              <thead>
                <tr>
                  <td style="font-size: 12px; border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; background-color: #EFEFEF; font-weight: bold; text-align: left; padding: 7px; color: #222222;">Товар</td>
                  <td style="font-size: 12px; border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; background-color: #EFEFEF; font-weight: bold; text-align: left; padding: 7px; color: #222222;">Модель</td>
                  <td style="font-size: 12px; border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; background-color: #EFEFEF; font-weight: bold; text-align: right; padding: 7px; color: #222222;">Количество</td>
                  <td style="font-size: 12px; border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; background-color: #EFEFEF; font-weight: bold; text-align: right; padding: 7px; color: #222222;">Цена</td>
                  <td style="font-size: 12px; border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; background-color: #EFEFEF; font-weight: bold; text-align: right; padding: 7px; color: #222222;">Итого:</td>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: left; padding: 7px;">
                      ${((item.product as unknown) as Product).name}
                    </td>
                    <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: left; padding: 7px;">
                      ${((item.product as unknown) as Product).sku}
                    </td>
                    <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: right; padding: 7px;">
                      ${item.qty}
                    </td>
                    <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: right; padding: 7px;">
                      ${item.price}
                    </td>
                    <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: right; padding: 7px;">
                      ${item.qty * item.price}
                    </td>
                  </tr>
                `)}
              </tbody>
              <tfoot>
                ${order.services.map(service => `
                  <tr>
                    <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: right; padding: 7px;" colspan="4"><b>Доставка:</b></td>
                    <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: right; padding: 7px;">${service.price}</td>
                  </tr>
                `)}
                <tr>
                  <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: right; padding: 7px;" colspan="4"><b>Итого:</b></td>
                  <td style="font-size: 12px;	border-right: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; text-align: right; padding: 7px;">${order.total}</td>
                </tr>
              </tfoot>
            </table>
            <p>Если у Вас есть какие-либо вопросы, просто ответьте на это письмо.</p>
            <a href="https://darlingdove.ru" target="_blank">https://darlingdove.ru</a>
            <br/>
            <a href="https://vk.com/darlingdove" target="_blank">https://vk.com/darlingdove</a>
          </div>
        `
      });

      return order;
    }
  });
}
