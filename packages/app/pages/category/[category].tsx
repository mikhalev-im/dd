import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import PageWrapper from "../../modules/common/components/page-wrapper";
import ProductList from '../../modules/common/components/product-list';
import TagsFilter from '../../modules/categories/components/tags';
import TagsFilterMobile from '../../modules/categories/components/tags/mobile';
import Select from '../../modules/common/components/select';
import { ProductsFilters } from '../../modules/common/api';
import { getProductTags } from '../../modules/common/api';
import type { ParsedUrlQuery } from 'querystring';

const pageSize = 36;
const options = [
  { label: 'Сначала новые', value: 'createdTime_desc' },
  { label: 'Сначала старые', value: 'createdTime_asc' },
  { label: 'Сначала популярные', value: 'ordersCount_desc' },
  { label: 'Сначала непопулярные', value: 'ordersCount_asc' },
  { label: 'В алфавитном порядке', value: 'name_asc' },
  { label: 'В обратном алфавитном порядке', value: 'name_desc' },
];
const asideStyle = { minWidth: '260px' };

const parseQuery = (query: ParsedUrlQuery) => {
  // make sure tags is always an array
  let tags: string[] = [];
  if (query.tags) {
    tags = Array.isArray(query.tags) ? query.tags : [query.tags];
  }

  let offset = 0;
  if (typeof query.offset === 'string') {
    offset = parseInt(query.offset, 10) || 0;
  }

  let sort = 'createdTime_desc';
  if (typeof query.sort === 'string') {
    sort = query.sort;
  }

  return { tags, offset, sort };
};

const createQuery = (filters: { tags: string[], offset: number, sort: string }) => {
  const tags = filters.tags.map(v => `tags=${v}`).join('&');
  return `${tags}&offset=${filters.offset}&sort=${filters.sort}`;
}

const CategoryPage = () => {
  const tagsData = useQuery<string[], Error>('product-tags', getProductTags);
  const router = useRouter();

  const { tags, offset, sort } = parseQuery(router.query);
  const [sortBy, order] = sort.split('_') as [ProductsFilters['sortBy'], ProductsFilters['order']];

  const onTagsFilterChange = (value: string[]) => {
    router.push(`${window.location.pathname}?${createQuery({ tags: value, offset: 0, sort })}`);
  }

  const onPageChange = (value: number) => {
    router.push(`${window.location.pathname}?${createQuery({ tags, offset: value, sort })}`);
  }

  const onSortChange = (value: string) => {
    router.push(`${window.location.pathname}?${createQuery({ tags, offset: 0, sort: value })}`);
  }

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
          <aside className='hidden lg:block' style={asideStyle}>
            <TagsFilter value={tags} onChange={onTagsFilterChange} options={tagsData.data} error={tagsData.error} />
          </aside>
          <div className='grow'>
            <div className='px-4 mb-4 flex place-content-between'>
              <Select options={options} value={sort} onChange={onSortChange} />
              <TagsFilterMobile value={tags} onChange={onTagsFilterChange} options={tagsData.data} error={tagsData.error} />
            </div>
            <ProductList cacheKey='category-products' filters={{ limit: pageSize, offset, sortBy, order, tags }} pagination={{ pageSize, onChange: onPageChange }} />
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default CategoryPage;
