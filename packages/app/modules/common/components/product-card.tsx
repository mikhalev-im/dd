import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineShoppingBag } from 'react-icons/hi';

import { Product } from '../api';
import { addToCart } from '../../carts';
import ProductPrice from './product-price';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className=''>
      <div className='rounded flex border cursor-pointer'>
        <Link href={`/product/${product.sku}`} >
          <a style={{ width: '100%' }}>
            <Image
              src={product.images.md}
              alt={product.description}
              width={700}
              height={700}
              layout='responsive'
              className='rounded'
            />
          </a>
        </Link>
      </div>
      <div className="p-2">
        <p className="text-sm text-center">{product.name}</p>
        <div className="flex gap-4 justify-center">
          <ProductPrice price={product.price} oldPrice={product.oldPrice} />
          <button className='block hover:text-blue-700' onClick={() => addToCart(product._id)}>
            <HiOutlineShoppingBag size={20} className='svg-path-stroke-1' />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
