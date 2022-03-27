import { Schema, Types  } from "mongoose";

export interface User {
  _id: Types.ObjectId,
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  postalCode?: string;
  address?: string;
  createdAt: Date;
  updatedTime?: Date;
  isAdmin: boolean;
}

export const UserJson = {
  type: 'object',
  properties: {
    _id: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    country: {
      type: 'string',
    },
    postalCode: {
      type: 'string',
    },
    address: {
      type: 'string',
    },
    createdAt: {
      type: 'string',
    },
    updatedTime: {
      type: 'string',
    },
    isAdmin: {
      type: 'boolean'
    },
  },
};

const User = new Schema<User>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  postalCode: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedTime: {
    type: Date,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

export default User;
