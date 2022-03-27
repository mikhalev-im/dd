import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { User, UserJson } from '../schema';

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
        200: UserJson,
      },
    },
    handler: async (request, reply) => {
      const user = await fastify.mongoose.model<User>('User').findOne({ email: request.body.email });

      if (!user) {
        throw fastify.httpErrors.notFound('User cannot be found');
      };

      const passwordValid = await bcrypt.compare(request.body.password, user.password);
      if (!passwordValid) {
        throw fastify.httpErrors.notFound('User cannot be found');
      }

      const token = fastify.jwt.sign({ email: user.email });
      reply.setCookie('token', token, {
        sameSite: true,
        httpOnly: true,
        secure: fastify.config.NODE_ENV === 'production',
      });

      return user;
    }
  });
}
