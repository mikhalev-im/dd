import { FastifyInstance } from 'fastify';

import list from './list';
import get from './get';
import create from './create';
import update from './update';
import remove from './delete';

export default async (fastify: FastifyInstance) => {
  list(fastify);
  get(fastify);
  create(fastify);
  update(fastify);
  remove(fastify);
};