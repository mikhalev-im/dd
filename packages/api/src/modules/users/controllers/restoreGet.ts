import { FastifyInstance } from 'fastify';
import { User, UserJson } from '../schema';

interface Context {
  Querystring: {
    token: string;
  };
}

export default (fastify: FastifyInstance) => {
  fastify.get<Context>('/users/restore', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
          },
        },
      },
      response: {
        200: UserJson,
      },
    },
    handler: async (request, reply) => {
      let payload;
      try {
        payload = fastify.jwt.verify<{ email: string }>(request.query.token);
      }
      catch (err) {
        throw fastify.httpErrors.badRequest('Invalid token');
      }

      const user = await fastify.mongoose.model<User>('User').findOne({ email: payload.email });
      if (!user) {
        throw fastify.httpErrors.notFound('User cannot be found');
      };

      const token = fastify.jwt.sign({ email: user.email });
      reply.setCookie('token', token, {
        sameSite: true,
        httpOnly: true,
        secure: fastify.config.NODE_ENV === 'production',
        path: '/',
      });

      return user;
    }
  });
}
