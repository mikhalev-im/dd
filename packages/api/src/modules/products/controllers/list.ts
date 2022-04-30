import { FastifyInstance } from 'fastify';
import type { FilterQuery } from 'mongoose';
import { Product, ProductJson } from '../schema';

interface Query {
  limit: number;
  offset: number;
  sortBy: string;
  order: string;
  tags?: string | string[];
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
            default: 'asc',
          },
          tags: {
            oneOf: [
              {
                type: 'array',
                items: {
                  type: 'string'
                }
              },
              {
                type: 'string',
              }
            ],
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
      const { limit, offset, sortBy, order, tags } = request.query;
      const Product = fastify.mongoose.model<Product>('Product');

      const filters: FilterQuery<Product> = {};
      if (tags) {
        filters.tags = { $in: Array.isArray(tags) ? tags : [tags] };
      }

      const total = await Product.countDocuments(filters);
      const data = await Product.find(filters).limit(limit).skip(offset).sort({ [sortBy]: order });

      return { data, total };
    }
  });
}
