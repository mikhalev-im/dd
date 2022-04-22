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
      <s>{oldPrice} р</s> <span className="bg-pink-500 text-white rounded px-1">{price} ₽</span>
    </p>
  );
};

export default ProductPrice;
