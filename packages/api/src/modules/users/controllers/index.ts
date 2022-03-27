import { FastifyInstance } from 'fastify';

import list from './list';
import me from './me';
import login from './login';
import logout from './logout';
import register from './register';

export default async (fastify: FastifyInstance) => {
  login(fastify);
  logout(fastify);
  register(fastify);

  me(fastify);

  fastify.route(list);
};