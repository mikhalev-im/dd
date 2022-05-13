import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router'
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from 'react-query';
import { getProductBySku, Product } from '../../modules/common/api';

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
  const { isLoading, error, data: product } = useQuery<Product | undefined, Error>(['product', sku], getProduct(router.isReady, sku));
  const [qty, setQty] = useState(1);

  if (isLoading || !router.isReady) return (
    <PageWrapper>
      <div className='px-2'><h1>Loading ...</h1></div>
    </PageWrapper>
  );

  if (error) return (
    <PageWrapper>
      <div className='px-2'><ErrorCmp error={error} /></div>
    </PageWrapper>
  );

  const { url: imgUrl } = product?.images.find(img => img.type === 'big') || { url: '' };

  return (
    <PageWrapper>
      <Head>
        <title>Классный продукт</title>
        <meta name="description" content='TODO' />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-x-4 px-2 py-4 mb-4'>
        <div className='lg:col-span-2'>
          <Image
            src={imgUrl}
            width={1400}
            height={1000}
            alt={product?.description}
            className='rounded'
          />
        </div>
        <div>
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
            <button className='rounded bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 lg:col-span-2' >Добавить в корзину</button>
          </p>

          <p className='flex flex-wrap gap-2'>
            {product?.tags.map(tag => (
              <Link key={tag} href={`/category/postcards?tags=${tag}`}>
                <a className='rounded-full bg-neutral-200 hover:bg-neutral-300 px-3 py-1 text-sm'>{tag}</a>
              </Link>
            ))}
          </p>
        </div>
      </div>

      <div>
        <h2 className='px-2 text-2xl mb-4'>Вам также может понравиться:</h2>
        <ProductList cacheKey='related-products' filters={{ limit: 4, sortBy: 'random' }} />
      </div>
    </PageWrapper>
  );
};

export default ProductPage;
