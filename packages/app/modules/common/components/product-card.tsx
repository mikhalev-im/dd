import Image from 'next/image';
import { HiOutlinePlus, HiOutlineShoppingBag, HiOutlineShoppingCart } from 'react-icons/hi';

import { Product } from '../api';
import ProductPrice from './product-price';

const SAMPLE_SRC = [
  // VERTICAL
  // 'https://storage.yandexcloud.net/darlingdove/cards/0313-front-big.jpg',
  // 'https://storage.yandexcloud.net/darlingdove/cards/1367-front-big.jpg',
  // 'https://storage.yandexcloud.net/darlingdove/cards/1492-front-big.jpg',
  // 'https://storage.yandexcloud.net/darlingdove/cards/0738-front-big.jpg',
  // 'https://storage.yandexcloud.net/darlingdove/cards/1151-front-big.jpg',

  // HORIZONTAL
  'https://storage.yandexcloud.net/darlingdove/cards/0314-front-big.jpg',
  'https://storage.yandexcloud.net/darlingdove/cards/0672-front-big.jpg',
  'https://storage.yandexcloud.net/darlingdove/cards/1451-front-big.jpg',
  'https://storage.yandexcloud.net/darlingdove/cards/0732-front-big.jpg',
  'https://storage.yandexcloud.net/darlingdove/cards/0411-front-big.jpg',
];

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const src = SAMPLE_SRC[Math.floor(Math.random() * SAMPLE_SRC.length)]

  return (
    <div className=''>
      {/* TODO: pick good image width */}
      <div className='rounded flex border cursor-pointer'>
        <Image
          src={src}
          alt={product.description}
          width={530}
          height={380}
          className='rounded'
        />
      </div>
      <div className="p-2">
        <p className="text-sm text-center">{product.name}</p>
        <div className="flex gap-4 justify-center">
          <ProductPrice price={product.price} oldPrice={product.oldPrice} />
          <a href='#' className='block hover:text-blue-700'>
            <HiOutlineShoppingBag size={20} className='svg-path-stroke-1' />
          </a>
        </div>

      </div>

    </div>
  );
}

export default ProductCard;
