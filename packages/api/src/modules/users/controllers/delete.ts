import { FastifyInstance } from 'fastify';
import { User } from '../schema';

interface Context {
  Params: { id: string; },
}

export default (fastify: FastifyInstance) => {
  fastify.delete<Context>('/users/:id', {
    schema: {
      params: {
        id: {
          type: 'string',
          pattern: '^[0-9a-fA-F]{24}$',
        },
      },
      response: {
        204: {},
      },
    },
    preHandler: [fastify.authenticate],
    handler: async (request) => {
      if (!request.user.isAdmin) {
        throw fastify.httpErrors.forbidden('Not allowed to delete users');
      }

      if (request.user._id.toString() === request.params.id) {
        throw fastify.httpErrors.forbidden('Not possible to delete yourself');
      }

      await fastify.mongoose.model<User>('User').deleteOne({ _id: request.params.id });

      return {};
    }
  });
}
