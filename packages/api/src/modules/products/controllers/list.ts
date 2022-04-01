import { FastifyInstance } from 'fastify';
import { Product, ProductJson } from '../schema';

interface Query {
  limit: number;
  offset: number;
  sortBy: string;
  order: string;
  category: string;
}

interface Context {
  Querystring: Query;
}

export default (fastify: FastifyInstance) => {
  fastify.get<Context>('/products', {
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
            enum: ['createdTime', 'ordersCount', 'name', 'price'],
            default: 'createdTime',
          },
          order: {
            type: 'string',
            enum: ['asc', 'desc'],
          },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: ProductJson,
            },
            total: {
              type: 'number',
            }
          },
        },
      },
    },
    handler: async (request) => {
      const { limit, offset, sortBy, order } = request.query;
      const Product = fastify.mongoose.model<Product>('Product');

      const total = await Product.countDocuments({});
      const data = await Product.find({}).limit(limit).skip(offset).sort({ [sortBy]: order });

      return { data, total };
    }
  });
}
