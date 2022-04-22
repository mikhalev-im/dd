import Head from 'next/head';
import { useRouter } from 'next/router'
import { NextPage,  } from 'next';

import PageWrapper from '../../modules/common/components/page-wrapper';

const ProductPage: NextPage = () => {
  const router = useRouter();

  console.log(router);

  return (
    <PageWrapper>
      <Head>
        <title>Классный продукт</title>
        <meta name="description" content='TODO' />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>THIS IS PRODUCT PAGE</h1>
    </PageWrapper>
  );
};

export default ProductPage;
