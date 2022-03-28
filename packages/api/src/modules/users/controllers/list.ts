import { FastifyInstance } from 'fastify';
import { User, UserJson } from '../schema';

interface Query {
  limit: number;
  offset: number;
  sortBy: string;
  order: string;
}

interface Context {
  Querystring: Query;
}

export default (fastify: FastifyInstance) => {
  fastify.get<Context>('/users', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            default: 25,
          },
          offset: {
            type: 'number',
            default: 0,
          },
          sortBy: {
            type: 'string',
            enum: ['createdAt', 'email'],
            default: 'createdAt',
          },
          order: {
            type: 'string',
            enum: ['asc', 'desc'],
          }
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: UserJson,
            },
            total: {
              type: 'number',
            }
          },
        },
      },
    },
    preHandler: [fastify.authenticate],
    handler: async (request) => {
      if (!request.user.isAdmin) {
        return {
          data: [request.user],
          total: 1,
        };
      }

      const { limit, offset, sortBy, order } = request.query;
      const User = fastify.mongoose.model<User>('User');

      const total = await User.countDocuments({});
      const data = await User.find({}).limit(limit).skip(offset).sort({ [sortBy]: order });

      return { data, total };
    }
  });
}
