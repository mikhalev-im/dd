import { FastifyInstance } from 'fastify';
import { User, UserJson } from '../schema';

interface Context {
  Params: { id: string };
}

export default (fastify: FastifyInstance) => {
  fastify.get<Context>('/users/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$',
          },
        },
      },
      response: {
        200: UserJson,
      },
    },
    preHandler: [fastify.authenticate],
    handler: async (request) => {
      if (!request.user.isAdmin) {
        if (request.user._id.toString() !== request.params.id) {
          throw fastify.httpErrors.forbidden('Not possible to get users except your own');
        }

        return request.user;
      }

      const user = await fastify.mongoose.model<User>('User').findById(request.params.id);
      if (!user) {
        throw fastify.httpErrors.notFound('No user with such id found');
      }

      return user;
    }
  });
}
