import { FastifyInstance } from 'fastify';

import list from './list';
import get from './get';
import remove from './delete';

export default async (fastify: FastifyInstance) => {
  list(fastify);
  get(fastify);
  remove(fastify);
};
