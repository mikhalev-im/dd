import { ReactElement } from 'react';
import Head from 'next/head';
import Header from './header';

interface PageWrapperProps {
  title?: string;
  description?: string;
  schema?: string;
  image?: string;
  children: ReactElement | ReactElement[];
}

const schemaOrg = {
  '@context': 'http://schema.org',
  "@type": 'Organization',
  name: 'DarlingDove',
  url: 'https://darlingdove.ru',
  email: 'info@darlingdove.ru',
  logo: 'https://storage.yandexcloud.net/darlingdove/head.png'
};

const defaults = {
  title: 'Интернет магазин почтовых открыток для посткроссинга DarlingDove',
  description: 'Чудесный магазин почтовых открыток! Здесь вы можете купить качественные почтовые открытки для посткроссинга и сопутствующие товары!',
  schema: JSON.stringify(schemaOrg),
};

const PageWrapper = ({ title, description, image, schema, children }: PageWrapperProps) => {
  const meta = {
    title: title || defaults.title,
    description: description || defaults.description,
    image: image || 'https://storage.yandexcloud.net/darlingdove/greeting.jpg',
  };

  return (
    <div>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="shortcut icon" href="https://storage.yandexcloud.net/darlingdove/fav.png" />
        <meta name="keywords" content="Купить почтовые открытки карточки почта посткроссинг postcrossing интернет магазин"></meta>

        {/* opengraph */}
        <meta property="og:title" content={meta.title} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={globalThis.location?.href} />
        <meta property="og:image" content={meta.image} />

        {/* schema.org */}
        <script type="application/ld+json">
          {schema || defaults.schema}
        </script>
      </Head>

      <Header />

      <main className='container mx-auto text-gray-700'>
        {children}
      </main>
    </div>
  );
}

export default PageWrapper;
