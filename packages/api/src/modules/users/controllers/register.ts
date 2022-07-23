import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { User, UserJson } from '../schema';

interface Body {
  email: string;
  password: string;
  passwordConfirm: string;
}

interface Context {
  Body: Body
};

export default (fastify: FastifyInstance) => {
  fastify.post<Context>('/users/register', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password', 'passwordConfirm'],
        properties: {
          email: {
            type: 'string',
            format: 'email'
          },
          password: {
            type: 'string',
            minLength: 1,
          },
          passwordConfirm: {
            type: 'string',
            minLength: 1,
          },
        },
      },
      response: {
        201: UserJson,
      },
    },
    handler: async (request, reply) => {
      if (request.body.password !== request.body.passwordConfirm) {
        throw fastify.httpErrors.badRequest('Passwords do not match');
      }

      const User = fastify.mongoose.model<User>('User');

      const existingUser = await User.findOne({ email: request.body.email });
      if (existingUser) {
        throw fastify.httpErrors.conflict('User with such email already exists');
      }

      const password = await bcrypt.hash(request.body.password, fastify.config.PASSWORD_SALT_ROUNDS);

      const user = await User.create({
        email: request.body.email,
        password,
      });

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
