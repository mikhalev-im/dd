import { FastifyInstance } from 'fastify';

import list from './list';
import me from './me';
import login from './login';

export default async (fastify: FastifyInstance) => {
  login(fastify);

  fastify.route(list);
  fastify.route(me);
};