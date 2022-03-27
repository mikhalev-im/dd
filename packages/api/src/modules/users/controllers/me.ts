import { FastifyInstance } from 'fastify';
import { User } from '../schema';

export default (fastify: FastifyInstance) => {
  fastify.get('/users/me', {
    schema: {
      response: {
        200: {}
      },
    },
    preHandler: [fastify.authenticate],
    handler: async (request, reply) => {
      return request.user;
    }
  });
}
