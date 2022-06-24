import { Schema, Types } from "mongoose";

export interface ProductImage {
  sm: string; // 260 x 187
  md: string; // 530 x 380
  lg: string; // 1400 x 1000
}

export interface Product {
  _id: Types.ObjectId;
  name: string;
  description: string;
  sku: string;
  qty: number;
  price: number;
  oldPrice: number;
  images: ProductImage;
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
      type: 'object',
      properties: {
        sm: {
          type: 'string',
        },
        md: {
          type: 'string',
        },
        lg: {
          type: 'string',
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
  images: {
    sm: String,
    md: String,
    lg: String,
  },
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
