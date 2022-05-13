import { FastifyInstance } from 'fastify';

import list from './list';
import get from './get';
import getBySku from './getBySku';
import create from './create';
import update from './update';
import remove from './delete';
import tags from './tags';

export default async (fastify: FastifyInstance) => {
  list(fastify);
  get(fastify);
  getBySku(fastify);
  create(fastify);
  update(fastify);
  remove(fastify);

  tags(fastify);
};