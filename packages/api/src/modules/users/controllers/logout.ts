import { FastifyInstance } from 'fastify';

export default (fastify: FastifyInstance) => {
  fastify.post('/users/logout', {
    schema: {
      response: {
        200: {},
      },
    },
    handler: async (request, reply) => {
      reply.clearCookie('token');
      return {};
    }
  });
}
