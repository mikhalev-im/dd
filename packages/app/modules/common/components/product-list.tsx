import { useQuery } from 'react-query';

import { getProducts, GetProductsResponse, ProductsFilters } from '../api';
import ProductCard from "./product-card"
import ProductPlaceholder from './porduct-placeholder';
import Error from './error';

interface ProductListProps {
  title?: string;
  filters: ProductsFilters;
  cacheKey: string;
}

const fetchProducts = (filters: ProductsFilters) => () => getProducts(filters);

const ProductList = ({ cacheKey, title, filters }: ProductListProps) => {
  const { status, data, error } = useQuery<GetProductsResponse, Error>(cacheKey, fetchProducts(filters));

  let content;
  switch (status) {
    case 'loading':
      const range = Array.from(Array(filters.limit || 4).keys());
      content = range.map((index) => (<ProductPlaceholder key={index} />));
      break;
    case 'error':
      content = (<Error error={error} />);
      break;
    case 'success':
      content = data.data.map((product) => (<ProductCard product={product} key={product._id} />));
  }

  return (
    <section className='mb-6 px-4'>
      {title && (<h2 className='text-3xl mb-4'>{title}</h2>)}
      <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-x-6 gap-y-4'>
        {content}
      </div>
    </section>
  );
};

export default ProductList;
