import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { User, UserJson } from '../schema';

interface Context {
  Params: { id: string };

  Body: {
    password?: string;
    firstName?: string;
    lastName?: string;
    country?: string;
    postalCode?: string;
    address?: string;
  };
}

export default (fastify: FastifyInstance) => {
  fastify.patch<Context>('/users/:id', {
    schema: {
      params: {
        id: {
          type: 'string',
          pattern: '^[0-9a-fA-F]{24}$',
        },
      },
      body: {
        type: 'object',
        properties: {
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
        200: UserJson,
      },
    },
    preHandler: [fastify.authenticate],
    handler: async (request) => {
      // non admin users can only edit themselves
      if (request.params.id !== request.user._id.toString() && !request.user.isAdmin) {
        throw fastify.httpErrors.forbidden('Not allowed to edit other users');
      }

      const User = fastify.mongoose.model<User>('User');

      const user = request.user._id.toString() === request.params.id
        ? request.user
        : await User.findById(request.params.id);

      if (!user) {
        throw fastify.httpErrors.notFound('User could not be found');
      }

      if (request.body.password) {
        user.password = await bcrypt.hash(request.body.password, fastify.config.PASSWORD_SALT_ROUNDS);
      }

      if (typeof request.body.firstName !== 'undefined') {
        user.firstName = request.body.firstName;
      }

      if (typeof request.body.lastName !== 'undefined') {
        user.lastName = request.body.lastName;
      }

      if (typeof request.body.country !== 'undefined') {
        user.country = request.body.country;
      }

      if (typeof request.body.postalCode !== 'undefined') {
        user.postalCode = request.body.postalCode;
      }

      if (typeof request.body.address !== 'undefined') {
        user.address = request.body.address;
      }

      await user.save();

      return user;
    }
  });
}
