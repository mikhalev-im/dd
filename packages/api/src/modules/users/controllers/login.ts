import { FastifyInstance } from 'fastify';
import { User } from '../schema';

interface Body {
  email: string;
  password: string;
}

interface Context {
  Body: Body
};

export default (fastify: FastifyInstance) => {
  fastify.post<Context>('/users/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email'
          },
          password: {
            type: 'string',
            minLength: 1,
          },
        },
      },
      response: {
        200: {}
      },
    },
    handler: async (request, reply) => {
      const user = await fastify.mongoose.model<User>('User').findOne({ email: request.body.email });

      if (!user) {
        throw fastify.httpErrors.notFound('User cannot be found');
      };

      // fastify.jwt.

      // check password

      return { hello: 'world' }
    }
  });
}
