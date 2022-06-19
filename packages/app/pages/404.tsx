import type { NextPage } from 'next';
import PageWrapper from '../modules/common/components/page-wrapper';

const NotFound: NextPage = () => {
  return (
    <PageWrapper>
      <div className='px-2'>
        <h1 className='text-3xl font-semibold mb-4'>Страница не найдена!</h1>
      </div>
    </PageWrapper>
  )
}

export default NotFound;
