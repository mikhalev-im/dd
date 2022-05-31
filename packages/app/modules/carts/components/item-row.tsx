import Link from 'next/link';
import Image from 'next/image';
import { HiOutlineX } from 'react-icons/hi';

import { Product } from '../../common/api';

interface ItemRowProps {
  product: Product;
  qty: number;
  onDelete: () => void;
  onChange: (value: number) => void;
}

const ItemRow = ({ product, qty, onDelete, onChange }: ItemRowProps) => {
  const src = product.images.find(i => i.type === 'big')?.url || '';
  const notEnoughInStock = product.qty < qty;

  return (
    <tr className='border-b last:border-b-0'>
      <td className='hidden md:table-cell w-48 py-2'>
        <Image
          src={src}
          alt={product.description}
          width={175}
          height={125}
          className='rounded'
        />
      </td>
      <td className='py-2'>
        <p>
          <Link href={`/product/${product.sku}`}>
            <a className='hover:text-blue-700'>{product.name}</a>
          </Link></p>
        <p className='text-xs text-slate-500'>{product.sku}</p>
      </td>
      <td className='px-2 w-20 text-right'>
        {product.price} ₽
      </td>
      <td className='px-2 text-center'>
        <input
          className={`w-8 spin-btn-none text-center outline-none rounded border ${notEnoughInStock ? 'border-pink-500' : ''}`}
          type="number"
          defaultValue={qty}
          min={1}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
        />
      </td>
      <td className='px-2 w-20 hidden ss-table-cell'>
        {product.price * qty} ₽
      </td>
      <td>
        <button className='hover:text-blue-700 mt-2' onClick={onDelete}>
          <HiOutlineX size={16} />
        </button>
      </td>
    </tr>
  );
}

export default ItemRow;
