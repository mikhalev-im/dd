import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { User, UserJson } from '../schema';

interface Context {
  Body: {
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    country?: string;
    postalCode?: string;
    address?: string;
  };
}

export default (fastify: FastifyInstance) => {
  fastify.post<Context>('/users', {
    schema: {
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
          },
          password: {
            type: 'string',
            minLength: 1,
          },
          firstName: {
            type: 'string',
          },
          lastName: {
            type: 'string',
          },
          country: {
            type: 'string',
          },
          postalCode: {
            type: 'string',
          },
          address: {
            type: 'string',
          },
        },
      },
      response: {
        201: UserJson,
      },
    },
    preHandler: [fastify.authenticate],
    handler: async (request) => {
      if (!request.user.isAdmin) {
        throw fastify.httpErrors.forbidden('Not allowed to create new users');
      }

      const User = fastify.mongoose.model<User>('User');

      // check if such email is already taken
      const user = await User.find({ email: request.body.email });
      if (user) {
        throw fastify.httpErrors.conflict('User with such email already exists');
      }

      const userData: Partial<User> = { ...request.body };
      if (request.body.password) {
        userData.password = await bcrypt.hash(request.body.password, fastify.config.PASSWORD_SALT_ROUNDS);
      }

      const newUser = await User.create(userData);

      return newUser;
    }
  });
}
