import { FastifyInstance } from 'fastify';
import { UserJson } from '../schema';

export default (fastify: FastifyInstance) => {
  fastify.get('/users/me', {
    schema: {
      response: {
        200: UserJson,
      },
    },
    preHandler: [fastify.authenticate],
    handler: async (request, reply) => {
      return request.user;
    }
  });
}
