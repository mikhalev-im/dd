import { Schema, Types } from "mongoose";

interface PromocodeDiscount {
  type: 'fixed' | 'percent';
  amount: number;
}

interface PromocodeLimitations {
  perUser: number;
  total: number;
  minSum: number;
}

interface Promocode {
  _id: Types.ObjectId,
  code: string;
  discount: PromocodeDiscount;
  limitations: PromocodeLimitations;
  startTime: Date;
  endTime: Date;
  createdTime: Date;
}

export const PromocodeJson = {
  type: 'object',
  properties: {
    code: {
      type: 'string',
    },
    discount: {
      type: {
        type: 'string',
      },
      amount: {
        type: 'integer'
      },
    },
    limitations: {
      type: 'object',
      properties: {
        perUser: {
          type: 'integer',
        },
        total: {
          type: 'integer',
        },
        minSum: {
          type: 'integer',
        },
      },
    },
    startTime: {
      type: 'string',
    },
    endTime: {
      type: 'string',
    },
    createdTime: {
      type: 'string',
    },
  },
};

const Promocode = new Schema<Promocode>({
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
  },
  limitations: {
    perUser: {
      type: Number,
    },
    total: {
      type: Number,
    },
    minSum: {
      type: Number,
    },
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  createdTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export default Promocode;
