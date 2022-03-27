import { FastifyInstance } from 'fastify';

import list from './list';
import me from './me';
import login from './login';
import register from './register';

export default async (fastify: FastifyInstance) => {
  login(fastify);
  register(fastify);

  me(fastify);

  fastify.route(list);
};