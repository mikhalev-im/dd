import { FastifyInstance } from 'fastify';

import list from './list';
import get from './get';
import create from './create';
import update from './update';
import remove from './delete';
import pay from './pay';
import paymentNotification from './paymentNotification';

export default async (fastify: FastifyInstance) => {
  paymentNotification(fastify);
  pay(fastify);

  list(fastify);
  get(fastify);
  create(fastify);
  update(fastify);
  remove(fastify);
};