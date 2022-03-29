import { FastifyInstance } from 'fastify';

import login from './login';
import logout from './logout';
import register from './register';
import me from './me';
import list from './list';
import get from './get';
import create from './create';
import update from './update';
import remove from './delete';

export default async (fastify: FastifyInstance) => {
  login(fastify);
  logout(fastify);
  register(fastify);

  me(fastify);
  list(fastify);
  get(fastify);
  create(fastify);
  update(fastify);
  remove(fastify);
};