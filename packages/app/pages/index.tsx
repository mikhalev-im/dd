import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import { ProductsFilters } from '../modules/common/api';
import PageWrapper from '../modules/common/components/page-wrapper';
import ProductList from '../modules/common/components/product-list';

const newProductsFilters: ProductsFilters = { sortBy: 'createdTime', order: 'desc', limit: 8 };
const popularProductsFilters: ProductsFilters = { sortBy: 'ordersCount', order: 'desc', limit: 8 };

const Home: NextPage = () => {
  return (
    <PageWrapper>
      <section className="mb-4 px-2">
        <Image src='https://storage.yandexcloud.net/darlingdove/greeting.jpg' alt="greeting banner" width={1900} height={550} className='rounded-2xl' />
      </section>

      <ProductList cacheKey='main-products-new' title='Новинки' filters={newProductsFilters} />

      <section className='mb-4 px-2'>
        <Image src='https://storage.yandexcloud.net/darlingdove/shipping.jpg' alt="greeting banner" width={1900} height={550} className='rounded-2xl' />
      </section>

      <ProductList cacheKey='main-products-popular' title='Популярное' filters={popularProductsFilters} />
    </PageWrapper>
  )
}

export default Home;
