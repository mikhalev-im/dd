import { Schema, Types } from 'mongoose';
import { Product, ProductJson } from '../products/schema';
import { PromocodeJson } from '../promocodes/schema';

export const FREE_DELIVERY_THRESHOLD = 1500;
export const PAID_DELIVERY_PRICE = 160;

export interface CartItem {
  product: Types.ObjectId;
  qty: number;
}

interface CartItemPopulated {
  product: Product;
  qty: number;
}

export interface CartService {
  type: 'FREE_DELIVERY' | 'PAID_DELIVERY';
  price: number;
}

export interface CartPromocode {
  promocode: Types.ObjectId;
  code: string;
  discount: {
    type: 'fixed' | 'percent';
    amount: number;
    total: number;
  };
  minSum: number;
}

export interface Cart {
  items: CartItem[];
  services: CartService[];
  promocodes: CartPromocode[];
  updatedTime: Date;
  createdTime: Date;
  calcDelivery: () => Promise<void>;
}

export const CartJson = {
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
      type: 'object',
      properties: {
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
    updatedTime: {
      type: 'string',
    },
    createdTime: {
      type: 'string',
    },
  },
};

const Cart = new Schema<Cart>({
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
        min: 1,
      },
    },
  ],
  services: [
    {
      type: {
        type: String,
        required: true,
        enum: ['PAID_DELIVERY', 'FREE_DELIVERY'],
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

Cart.method('calcDelivery', async function() {
  // no delivery if there are no items
  if (!this.items.length) {
    this.services = [];
    return;
  }

  // populate products if not already
  if (!this.populated('items.product')) {
    await this.populate('items.product');
  }

  // calc the sum of items
  let sum = this.items.reduce((result: number, item: CartItemPopulated) => {
    result += item.qty * item.product.price;
    return result;
  }, 0);

  // apply promocodes
  sum = this.promocodes.reduce((result: number, promo: CartPromocode) => {
    // TODO: order of promocodes will matter, fix this
    if (promo.minSum && result < promo.minSum) {
      promo.discount.total = 0;
      return result;
    }

    const discount =
      promo.discount.type === 'fixed'
        ? promo.discount.amount
        : Math.floor((result / 100) * promo.discount.amount);

    promo.discount.total = result >= discount ? discount : result;

    return result - promo.discount.total;
  }, sum);

  this.services = this.services || [];

  // remove old deliveries
  this.services = this.services.filter((service: CartService) => {
    return !['FREE_DELIVERY', 'PAID_DELIVERY'].includes(service.type);
  });

  const delivery =
    sum < FREE_DELIVERY_THRESHOLD
      ? { type: 'PAID_DELIVERY', price: PAID_DELIVERY_PRICE }
      : { type: 'FREE_DELIVERY', price: 0 };

  // push new delivery
  this.services.push(delivery);

  return sum + delivery.price;
});

export default Cart;
