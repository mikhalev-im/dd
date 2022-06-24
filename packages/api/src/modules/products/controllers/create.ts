import { FastifyInstance } from 'fastify';
import { Product, ProductJson, ProductImage } from '../schema';

interface Context {
  Body: {
    name: string;
    sku: string;
    qty: number;
    price: number;
    oldPrice?: number;
    images: ProductImage;
    tags: string[];
    category: string;
    description?: string;
  };
}

export default (fastify: FastifyInstance) => {
  fastify.post<Context>('/products', {
    schema: {
      body: {
        type: 'object',
        required: ['name', 'sku', 'qty', 'price', 'images', 'tags', 'category'],
        properties: {
          name: {
            type: 'string',
            minLength: 1,
          },
          sku: {
            type: 'string',
            minLength: 1,
          },
          qty: {
            type: 'integer',
            default: 0,
          },
          price: {
            type: 'integer',
          },
          oldPrice: {
            type: 'integer',
          },
          images: {
            type: 'object',
            required: ['sm', 'md', 'lg'],
            properties: {
              sm: {
                type: 'string',
                format: 'url',
              },
              md: {
                type: 'string',
                format: 'url',
              },
              lg: {
                type: 'string',
                format: 'url',
              },
            },
          },
          tags: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          category: {
            type: 'string',
            enum: ['postcards'],
            default: 'postcards',
          },
          description: {
            type: 'string',
          },
        },
      },
      response: {
        201: ProductJson,
      },
    },
    preHandler: [fastify.authenticate],
    handler: async (request) => {
      if (!request.user.isAdmin) {
        throw fastify.httpErrors.forbidden('Not allowed to create new products');
      }

      const Product = fastify.mongoose.model<Product>('Product');

      // check if such sku is already taken
      const product = await Product.findOne({ sku: request.body.sku });
      if (product) {
        throw fastify.httpErrors.conflict('Product with such sku already exists');
      }

      const newProduct = await Product.create(request.body);

      return newProduct;
    }
  });
}
