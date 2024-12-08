import { useState } from 'react';
import { useRouter } from 'next/router'
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from 'react-query';
import ContentLoader from 'react-content-loader';

import { getProductBySku, Product } from '../../modules/common/api';
import { addToCart } from '../../modules/carts';
import PageWrapper from '../../modules/common/components/page-wrapper';
import ErrorCmp from '../../modules/common/components/error';
import QtyInput from '../../modules/common/components/quantity-input';
import ProductList from '../../modules/common/components/product-list';

type QueyrParam = string | string[] | undefined;

const getProduct = (routerReady: boolean, sku: QueyrParam) => () => {
  if (!routerReady) return;
  if (!sku || typeof sku !== 'string') throw new Error('Invalid sku');
  return getProductBySku(sku);
};

const ProductPage: NextPage = () => {
  const router = useRouter();

  const { sku } = router.query;
  const { status, error, data: product } = useQuery<Product | undefined, Error>(['product', sku], getProduct(router.isReady, sku));
  const [qty, setQty] = useState(1);

  const isLoading = !router.isReady || status === 'loading';
  // TODO: use only lg image
  const imageSrc = product?.images.lg || product?.images.md || '';

  const meta = {
    title: product ? `${product.name} - Darlingdove` : 'Открытка - Darlingdove',
    description: product ? product.description : 'Открытка для посткроссинга',
    image: imageSrc,
  };

  if (status === 'error') return (
    <PageWrapper {...meta} >
      <div className='px-2'><ErrorCmp error={error} /></div>
    </PageWrapper>
  );

  const toCart = () => {
    if (!product) return;
    addToCart(product._id, qty);
  }

  return (
    <PageWrapper {...meta} >
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-2 px-2 py-4 mb-4'>
        <div className='lg:col-span-2'>
          {isLoading
            ? (
              <ContentLoader
                viewBox="0 0 100 88"
                backgroundColor="#e5e7eb"
                foregroundColor="#d1d5db"
              >
                <rect x="0" y="0" rx="2" ry="2" width="100" height="88" />
              </ContentLoader>
            )
            : (
              <Image
                src={imageSrc}
                width={1400}
                height={1400}
                alt={product?.description}
                className='rounded'
              />
            )
          }
        </div>
        <div>
          {isLoading
            ? (
              <ContentLoader
                viewBox="0 0 100 88"
                backgroundColor="#e5e7eb"
                foregroundColor="#d1d5db"
              >
                <rect x="0" y="0" rx="2" ry="2" width="100" height="88" />
              </ContentLoader>
            )
            : (
              <>
                <h1 className='text-3xl font-semibold mb-4'>{product?.name}</h1>
                <p className='mb-4'>{product?.description}</p>
                <div className='mb-4 text-sm'>
                  <table>
                    <tr >
                      <td className='text-slate-500'>Наличие:</td>
                      <td className='px-2'>{product?.qty}</td>
                    </tr>
                    <tr>
                      <td className='text-slate-500'>Артикул:</td>
                      <td className='px-2'>{product?.sku}</td>
                    </tr>
                    <tr >
                      <td className='text-slate-500'>Размер:</td>
                      <td className='px-2'>148 x 105 мм</td>
                    </tr>
                    <tr >
                      <td className='text-slate-500'>Плотность:</td>
                      <td className='px-2'>295 гр/кв.м.</td>
                    </tr>
                  </table>
                </div>

                <p className='text-lg font-semibold mb-4'>
                  <span className={`${product?.oldPrice ? 'bg-pink-500 text-white rounded px-1' : ''}`}>{product?.price} ₽</span>
                  {product?.oldPrice && (<s className='ml-2 text-base'>{product.oldPrice} ₽</s>)}
                </p>

                <p className='grid grid-cols-1 lg:grid-cols-3 gap-2 mb-6'>
                  <QtyInput value={qty} onChange={(n) => setQty(n)} />
                  <button className='rounded bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 lg:col-span-2' onClick={toCart} >Добавить в корзину</button>
                </p>

                <p className='flex flex-wrap gap-2'>
                  {product?.tags.map(tag => (
                    <Link key={tag} href={`/category/postcards?tags=${tag}`}>
                      <a className='rounded-full bg-neutral-200 hover:bg-neutral-300 px-3 py-1 text-sm'>{tag}</a>
                    </Link>
                  ))}
                </p>
              </>
            )
          }
        </div>
      </div>

      <div>
        <h2 className='px-2 text-2xl mb-4'>Вам также может понравиться:</h2>
        <ProductList cacheKey={`related-products-${sku}`} filters={{ limit: 4, sortBy: 'random', inStock: true }} />
      </div>
    </PageWrapper>
  );
};

export default ProductPage;
