import { FastifyInstance } from 'fastify';

import list from './list';
import get from './get';
import remove from './delete';
import current from './current';
import addItem from './add';
import removeItem from './remove';
import changeItemQty from './qty';

export default async (fastify: FastifyInstance) => {
  current(fastify);
  addItem(fastify);
  removeItem(fastify);
  changeItemQty(fastify);

  list(fastify);
  get(fastify);
  remove(fastify);
};
