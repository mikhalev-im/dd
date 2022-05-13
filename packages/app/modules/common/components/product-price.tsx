interface ProductPriceProps {
  price: number;
  oldPrice?: number;
}

const ProductPrice = ({ price, oldPrice}: ProductPriceProps) => {
  if (!oldPrice) {
    return (
      <p className="text-sm">{price} ₽</p>
    );
  }

  return (
    <p className="text-sm">
      <span className="bg-pink-500 text-white rounded px-1">{price} ₽</span> <s className="text-xs">{oldPrice} ₽</s>
    </p>
  );
};

export default ProductPrice;
