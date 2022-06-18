import type { NextPage } from 'next';
import { useRef, useState } from 'react';
import { HiSearch } from 'react-icons/hi';

import PageWrapper from '../modules/common/components/page-wrapper';
import ProductList from '../modules/common/components/product-list';

const pageSize = 36;
const iconStyle = { top: '10px', right: '20px' };
const searchBarStyle = { maxWidth: '800px' };

const Search: NextPage = () => {
  const [searchPhrase, setSearchPhrase] = useState('');
  const [offset, setOffset] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateSearchPhrase = () => {
    setSearchPhrase(inputRef.current?.value || '');
    setOffset(0);
  }

  const onPageChange = (newOffset: number) => {
    setOffset(newOffset);
  }

  return (
    <PageWrapper
      title='Поиск - Darlingdove'
    >
      <div className='mb-6 px-2 py-4'>
        <div className='px-4 py-2 rounded-full border bg-white relative mx-auto' style={searchBarStyle}>
          <input
            ref={inputRef}
            className='w-full border-none outline-none'
            type="text"
            name="search"
            placeholder='Введите фразу'
            onKeyDown={(e) => e.key === 'Enter' && updateSearchPhrase()}
          />
          <HiSearch
            className='absolute hover:text-blue-700 cursor-pointer'
            style={iconStyle}
            size={20}
            onClick={updateSearchPhrase}
          />
        </div>
      </div>

      <>{searchPhrase && <ProductList cacheKey='products-search' filters={{ offset, limit: pageSize, search: searchPhrase, inStock: true }} pagination={{ pageSize, onChange: onPageChange }} />}</>

    </PageWrapper>
  )
}

export default Search;
