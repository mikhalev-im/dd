import { Schema, Types } from "mongoose";
import { ProductJson } from "../products/schema";
import { PromocodeJson } from "../promocodes/schema";
import { UserJson } from "../users/schema";

export interface OrderItem {
  product: Types.ObjectId;
  qty: number;
  price: number;
}

export interface OrderService {
  type: 'FREE_DELIVERY' | 'PAID_DELIVERY';
  price: number;
}

export interface OrderPromocode {
  promocode: Types.ObjectId;
  code: string;
  discount: {
    type: 'fixed' | 'percent';
    amount: number;
    total: number;
  };
  minSum: number;
}

// TODO: migration _id -> user
export interface OrderUser {
  user: Types.ObjectId;
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  postalCode: string;
}

export interface Order {
  _id: Types.ObjectId;
  items: OrderItem[];
  services: OrderService[];
  promocodes: OrderPromocode[];
  total: number;
  user: OrderUser;
  comment: string;
  shortId: string;
  status: 'notPaid' | 'paid' | 'shipped' | 'done';
  trackingNumber: string;
  updatedTime: Date;
  createdTime: Date;
}

export const OrderJson = {
  type: 'object',
  properties: {
    _id: {
      type: 'string',
    },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          qty: {
            type: 'integer',
          },
          price: {
            type: 'integer',
          },
          product: ProductJson,
        },
      },
    },
    services: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['FREE_DELIVERY', 'PAID_DELIVERY'],
          },
          price: {
            type: 'integer',
          },
        },
      },
    },
    promocodes: {
      type: 'array',
      items: {
        promocode: PromocodeJson,
        code: {
          type: 'string',
        },
        discount: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['fixed', 'percent'],
            },
            amount: {
              type: 'integer',
            },
            total: {
              type: 'integer',
            },
          },
        },
        minSum: {
          type: 'integer',
        },
      },
    },
    total: {
      type: 'integer',
    },
    user: {
      type: 'object',
      properties: {
        user: UserJson,
        firstName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
        address: {
          type: 'string',
        },
        country: {
          type: 'string',
        },
        postalCode: {
          type: 'string',
        },
      },
    },
    comment: {
      type: 'string',
    },
    shortId: {
      type: 'string',
    },
    status: {
      type: 'string',
      enum: ['notPaid', 'paid', 'shipped', 'done'],
    },
    trackingNumber: {
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

const Order = new Schema<Order>({
  items: [
    {
      product: {
        type: Types.ObjectId,
        required: true,
        ref: 'Product',
      },
      qty: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  services: [
    {
      type: {
        type: String,
        required: true,
        enum: ['FREE_DELIVERY', 'PAID_DELIVERY'],
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  promocodes: [
    {
      promocode: {
        type: Types.ObjectId,
        required: true,
        ref: 'Promocode',
      },
      code: {
        type: String,
        required: true,
      },
      discount: {
        type: {
          type: String,
          required: true,
          enum: ['fixed', 'percent'],
        },
        amount: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
      },
      minSum: {
        type: Number,
        required: false,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  user: {
    user: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    firstName: String,
    lastName: String,
    address: String,
    country: String,
    postalCode: String,
  },
  comment: {
    type: String,
    required: false,
  },
  shortId: {
    type: String,
  },
  status: {
    type: String,
    enum: ['notPaid', 'paid', 'shipped', 'done'],
  },
  trackingNumber: {
    type: String,
    required: false,
  },
  updatedTime: {
    type: Date,
    required: false,
  },
  createdTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export default Order;
