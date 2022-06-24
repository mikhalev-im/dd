// EXEC: mongo dd 2022-06-25-product-image-sizes.js

const dd = db.getSiblingDB('dd');

// sm: 260 x 187
// md: 530 x 380
dd.getCollection('products').find({}).forEach((product) => {
  const images = product.images.reduce((res, item) => {
    const type = item.type === 'card' ? 'sm' : 'md';
    res[type] = item.url;
    return res;
  }, {});

  dd.getCollection('products').updateOne({ _id: product._id }, { $set: { images } });
});
