import { FastifyInstance } from 'fastify';
import type { FilterQuery } from 'mongoose';
import { Product, ProductJson } from '../schema';

interface Query {
  limit: number;
  offset: number;
  sortBy: string;
  order: string;
  tags?: string | string[];
  search?: string;
  inStock: boolean;
}

interface Context {
  Querystring: Query;
}

// copied from 'escape-string-regexp' package
const escapeStringRegexp = (str: string) => {
  return str
    .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
    .replace(/-/g, '\\x2d');
};

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
            enum: ['createdTime', 'ordersCount', 'name', 'price', 'random', 'qty'],
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
          search: {
            type: 'string',
          },
          inStock: {
            type: 'boolean'
          }
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
      const { limit, offset, sortBy, order, tags, search, inStock } = request.query;

      const Product = fastify.mongoose.model<Product>('Product');

      const filters: FilterQuery<Product> = {};
      if (tags) {
        filters.tags = { $in: Array.isArray(tags) ? tags : [tags] };
      }

      if (search) {
        const escapedRegExp = new RegExp(escapeStringRegexp(search), 'i');
        filters.$or = [{ name: escapedRegExp }, { sku: escapedRegExp }];
      }

      if (inStock) {
        filters.qty = { $gte: 1 };
      }

      const total = await Product.countDocuments(filters);
      const data = sortBy !== 'random'
        ? await Product.find(filters).limit(limit).skip(offset).sort({ [sortBy]: order })
        : await Product.aggregate([{ $match: filters }, { $sample: { size: limit } }]);

      return { data, total };
    }
  });
}
