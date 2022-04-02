import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import mongoose from 'mongoose';

import User, { User as UserInterface } from '../../users/schema';
import Product, { Product as ProductInterface } from '../../products/schema';
import Cart, { Cart as CartInterface } from '../../carts/schema';
import Order, { Order as OrderInterface } from '../../orders/schema';
import Promocode, { Promocode as PromocodeInterface } from '../../promocodes/schema';

export default fp(async function mongoosePlugin (fastify: FastifyInstance) {
  mongoose.model<UserInterface>('User', User);
  mongoose.model<ProductInterface>('Product', Product);
  mongoose.model<CartInterface>('Cart', Cart);
  mongoose.model<OrderInterface>('Order', Order);
  mongoose.model<PromocodeInterface>('Promocode', Promocode);

  await mongoose.connect(fastify.config.MONGO_URI);

  mongoose.connection.on('error', err => {
    fastify.log.error({ err }, 'mongoose connection error occured');
  });

  fastify.decorate('mongoose', mongoose);
});