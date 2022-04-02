// EXEC: mongo dd 2022-04-02-change-order-user-field.js

const dd = db.getSiblingDB('dd');

dd.getCollection('orders').updateMany({}, { $rename: { 'user._id': 'user.user' } });
