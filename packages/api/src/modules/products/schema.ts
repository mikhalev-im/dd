import { Schema, Types } from "mongoose";

export interface ProductImage {
  type: 'card' | 'big';
  width: number;
  height: number;
  url: string;
}

export interface Product {
  _id: Types.ObjectId;
  name: string;
  description: string;
  sku: string;
  qty: number;
  price: number;
  oldPrice: number;
  images: ProductImage[];
  ordersCount: number;
  tags: string[];
  category: string;
  updatedTime: Date;
  createdTime: Date;
}

export const ProductJson = {
  type: 'object',
  properties: {
    _id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    sku: {
      type: 'string',
    },
    qty: {
      type: 'integer',
    },
    price: {
      type: 'integer',
      minimum: 0,
    },
    oldPrice: {
      type: 'integer',
      minimum: 0,
    },
    ordersCount: {
      type: 'integer',
      minimum: 0,
    },
    images: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['card', 'big'],
          },
          width: {
            type: 'integer',
            minimum: 0,
          },
          height: {
            type: 'integer',
            minimum: 0,
          },
          url: {
            type: 'string',
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
    },
    updatedTime: {
      type: 'string',
    },
    createdTime: {
      type: 'string',
    },
  },
};

const Product = new Schema<Product>({
  name: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    default: 0,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  oldPrice: {
    type: Number,
    required: false,
    min: 0,
  },
  images: [
    {
      type: {
        type: String,
        enum: ['card', 'big'],
      },
      width: {
        type: Number,
      },
      height: {
        type: Number,
      },
      url: {
        type: String,
      },
    },
  ],
  ordersCount: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  tags: [String],
  category: String,
  updatedTime: {
    type: Date,
    required: false,
  },
  createdTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

export default Product;
