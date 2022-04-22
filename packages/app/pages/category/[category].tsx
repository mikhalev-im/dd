import Head from 'next/head';
import { useState } from 'react';
import PageWrapper from "../../modules/common/components/page-wrapper";
import ProductList from '../../modules/common/components/product-list';
import Select from '../../modules/common/components/select';

const options = [
  { label: 'Сначала новые', value: 'createdTime_desc' },
  { label: 'Сначала старые', value: 'createdTime_asc' },
  { label: 'Сначала популярные', value: 'ordersCount_desc' },
  { label: 'Сначала непопулярные', value: 'ordersCount_asc' },
  { label: 'В алфавитном порядке', value: 'name_asc' },
  { label: 'В обратном алфавитном порядке', value: 'name_desc' },
];

const CategoryPage = () => {
  const [sortBy, setSortBy] = useState('createdTime_desc');

  return (
    <PageWrapper>
      <Head>
        <title>Категории</title>
        <meta name="description" content='TODO' />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='px-2'>
        <h1 className='text-4xl mb-4'>Открытки</h1>
        <div className='flex'>
          <aside className='w-1/5'>
            <h4 className='py-1 mb-1 font-semibold'>Категории</h4>
            <ul className='overflow-y-auto h-96 scrollbar' >
              {Array.from(Array(50).keys()).map(index => (
                <li key={index}>
                  <label className='flex items-center space-x-2'>
                    <input type="checkbox" className='h-4 w-4 rounded border border-gray-300 checked:bg-blue-500 checked:border-transparent focus:outline-none' />
                    <span>category {index}</span>
                  </label>
                </li>
              ))}
            </ul>
          </aside>
          <div>
            <div className='px-4 mb-4'>
              <Select options={options} value={sortBy} onChange={(value: string) => setSortBy(value)} />
            </div>
            <ProductList cacheKey='category-products' filters={{ limit: 36 }} />
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default CategoryPage;
