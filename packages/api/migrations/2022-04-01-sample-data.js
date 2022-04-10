// EXEC: mongo dd 2022-04-01-sample-data.js

const dd = db.getSiblingDB('dd');

dd.getCollection('users').insertMany([
  {
    _id: ObjectId('624fcebc5faf8f3ed1bd4001'),
    email: 'admin@test.test',
    password: '$2b$10$wqK2NoqpYw8n5j.Dfd2CrOMVf49Smbgf.p0E8InTDRJniBgyTsbpm', // 123456
    isAdmin: true,
    createdAt: new Date(),
  },
  {
    _id: ObjectId('624fcebc5faf8f3ed1bd4002'),
    email: 'user@test.test',
    password: '$2b$10$wqK2NoqpYw8n5j.Dfd2CrOMVf49Smbgf.p0E8InTDRJniBgyTsbpm', // 123456
    isAdmin: false,
    createdAt: new Date(),
  },
]);

db.getCollection('products').insertMany([
  {
    _id: ObjectId('623728aaa7937b4955274001'),
    name: 'Capybara',
    sku: 'card-001',
    qty: 48,
    price: 15,
    ordersCount: 3,
    category: 'postcards',
    images: [
      {
        type: 'card',
        url: 'https://storage.yandexcloud.net/darlingdove/cards/1494-front-card.jpg',
        width: 260,
        height: 187,
      },
      {
        type: 'big',
        url: 'https://storage.yandexcloud.net/darlingdove/cards/1494-front-big.jpg',
        width: 530,
        height: 380,
      }
    ],
    tags: ['new', 'animals'],
    description: 'This is a postcard with Capybara',
    createdTime: new Date(),
  },
  {
    _id: ObjectId('623728aaa7937b4955274002'),
    name: 'Squirrel',
    sku: 'card-002',
    qty: 17,
    price: 15,
    ordersCount: 7,
    category: 'postcards',
    images: [
      {
        type: 'card',
        url: 'https://storage.yandexcloud.net/darlingdove/cards/1495-front-card.jpg',
        width: 260,
        height: 187,
      },
      {
        type: 'big',
        url: 'https://storage.yandexcloud.net/darlingdove/cards/1495-front-big.jpg',
        width: 530,
        height: 380,
      }
    ],
    tags: ['new', 'squirrels'],
    description: 'This is a postcard with Squirrel',
    createdTime: new Date(),
  },
  {
    _id: ObjectId('623728aaa7937b4955274003'),
    name: 'Breeze',
    sku: 'card-003',
    qty: 15,
    price: 15,
    ordersCount: 4,
    category: 'postcards',
    images: [
      {
        type: 'card',
        url: 'https://storage.yandexcloud.net/darlingdove/cards/1367-front-card.jpg',
        width: 260,
        height: 187,
      },
      {
        type: 'big',
        url: 'https://storage.yandexcloud.net/darlingdove/cards/1367-front-big.jpg',
        width: 530,
        height: 380,
      }
    ],
    tags: ['summer'],
    description: 'This is a postcard with Breeze',
    createdTime: new Date(),
  },
  {
    _id: ObjectId('623728aaa7937b4955274004'),
    name: 'Bicycle',
    sku: 'card-004',
    qty: 4,
    price: 12,
    oldPrice: 15,
    ordersCount: 4,
    category: 'postcards',
    images: [
      {
        type: 'card',
        url: 'https://storage.yandexcloud.net/darlingdove/cards/0131-front-card.jpg',
        width: 260,
        height: 187,
      },
      {
        type: 'big',
        url: 'https://storage.yandexcloud.net/darlingdove/cards/0131-front-big.jpg',
        width: 530,
        height: 380,
      }
    ],
    tags: ['bicycles'],
    description: 'This is a postcard with Bicycle',
    createdTime: new Date(),
  },
  {
    _id: ObjectId('623728aaa7937b4955274005'),
    name: 'Sky',
    sku: 'card-005',
    qty: 11,
    price: 12,
    oldPrice: 15,
    ordersCount: 7,
    category: 'postcards',
    images: [
      {
        type: 'card',
        url: 'https://storage.yandexcloud.net/darlingdove/cards/1171-front-card.jpg',
        width: 260,
        height: 187,
      },
      {
        type: 'big',
        url: 'https://storage.yandexcloud.net/darlingdove/cards/1171-front-big.jpg',
        width: 530,
        height: 380,
      }
    ],
    tags: ['sky'],
    description: 'This is a postcard with Sky',
    createdTime: new Date(),
  },
]);

db.getCollection('orders').insertMany([
  {
    _id: ObjectId('61b099e4cbd2ed13b01f8001'),
    items: [
      {
        qty: 4,
        price: 12,
        product: ObjectId('623728aaa7937b4955274004'),
      },
      {
        qty: 2,
        price: 18,
        product: ObjectId('623728aaa7937b4955274001'),
      },
    ],
    services: [{
      type: 'PAID_DELIVERY',
      price: 100,
    }],
    promocodes: [],
    total: 10,
    user: {
      user: ObjectId('624fcebc5faf8f3ed1bd4002'),
      firstName: 'Ingvar',
      lastName: 'Voytenko',
      address: 'Moscow, Pushkina, 7',
      country: 'Russia',
      postalCode: '168220'
    },
    comment: 'order comment',
    shortId: 'PPBqWA9',
    status: 'shipped',
    trackingNumber: '168220777888',
    createdTime: new Date(),
  },
]);
