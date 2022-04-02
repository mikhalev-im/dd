import { FastifyInstance } from 'fastify';
import { Product, ProductJson, ProductImage } from '../schema';

interface Context {
  Params: { id: string };

  Body: {
    name?: string;
    category?: string;
    description?: string;
    sku?: string;
    qty?: number;
    price?: number;
    oldPrice?: number;
    tags?: string[];
    images?: ProductImage[];
  };
}

export default (fastify: FastifyInstance) => {
  fastify.patch<Context>('/products/:id', {
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
          },
          price: {
            type: 'integer',
          },
          oldPrice: {
            type: 'integer',
          },
          images: {
            type: 'array',
            items: {
              type: 'object',
              required: ['type', 'width', 'height', 'url'],
              properties: {
                type: {
                  type: 'string',
                  enum: ['card', 'big'],
                },
                width: {
                  type: 'integer',
                },
                height: {
                  type: 'integer'
                },
                url: {
                  type: 'string',
                  format: 'url',
                },
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
          },
          description: {
            type: 'string',
          },
        },
      },
      response: {
        200: ProductJson,
      },
    },
    preHandler: [fastify.authenticate],
    handler: async (request) => {
      if (!request.user.isAdmin) {
        throw fastify.httpErrors.forbidden('Not allowed to udpate products');
      }

      const Product = fastify.mongoose.model<Product>('Product');

      const product = await Product.findById(request.params.id);

      if (!product) {
        throw fastify.httpErrors.notFound('Product could not be found');
      }

      const { body } = request;

      if (body.name && body.name !== product.name) {
        product.name = body.name;
      }

      if (typeof body.sku !== 'undefined' && body.sku !== product.sku) {
        // check that there is no other product with such sku
        const existingProduct = await Product.findOne({
          _id: { $ne: request.params.id },
          sku: request.body.sku,
        });

        if (existingProduct) {
          throw fastify.httpErrors.conflict('Product with such sku already exists');
        }

        product.sku = body.sku;
      }

      if (typeof body.description !== 'undefined' && body.description !== product.description) {
        product.description = body.description;
      }

      if (typeof body.category !== 'undefined' && body.category !== product.category) {
        product.category = body.category;
      }

      if (typeof body.qty !== 'undefined' && body.qty !== product.qty) {
        product.qty = body.qty;
      }

      if (typeof body.price !== 'undefined' && body.price !== product.price) {
        product.price = body.price;
      }

      if (typeof body.oldPrice !== 'undefined' && body.oldPrice !== product.oldPrice) {
        product.oldPrice = body.oldPrice;
      }

      if (body.images) {
        product.images = body.images;
      }

      if (body.tags) {
        product.tags = body.tags;
      }

      product.updatedTime = new Date();
      await product.save();

      return product;
    }
  });
}
