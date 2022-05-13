import { useQuery } from 'react-query';

import { getProducts, GetProductsResponse, ProductsFilters } from '../api';
import ProductCard from "./product-card"
import ProductPlaceholder from './porduct-placeholder';
import Pagination from './pagination';
import Error from './error';

interface ProductListProps {
  title?: string;
  filters: ProductsFilters;
  cacheKey: string;
  narrow?: boolean;
  pagination?: {
    pageSize: number,
    onChange: (offset: number) => void;
  }
}

const fetchProducts = (filters: ProductsFilters) => () => getProducts(filters);

const ProductList = ({ cacheKey, title, filters, pagination, narrow }: ProductListProps) => {
  const { status, data, error } = useQuery<GetProductsResponse, Error>([cacheKey, filters], fetchProducts(filters));

  let content;
  switch (status) {
    case 'error':
      content = [];
      break;
    case 'loading':
      const range = Array.from(Array(filters.limit || 4).keys());
      content = range.map((index) => (<ProductPlaceholder key={index} />));
      break;
    case 'success':
      content =  data.data.length
        ? data.data.map((product) => (<ProductCard product={product} key={product._id} />))
        : <p>Товары не найдены</p>
  }

  return (
    <section className='mb-6 px-4'>
      {title && (<h2 className='text-2xl mb-4'>{title}</h2>)}
      {error && (<Error error={error} />)}
      <div className={`grid ${narrow ? 'lg:grid-cols-3 md:grid-cols-2' : 'lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2'} gap-x-6 gap-y-4`} >
        {content}
      </div>
      {pagination && <Pagination total={data?.total || 0} pageSize={pagination.pageSize} offset={filters.offset || 0} onChange={pagination.onChange} />}
    </section>
  );
};

export default ProductList;
