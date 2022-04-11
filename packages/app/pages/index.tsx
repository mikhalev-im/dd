import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { HiOutlineShoppingBag, HiOutlineUserCircle } from 'react-icons/hi';

const menu = [
  { label: 'Открытки' },
  { label: 'Поиск' },
  { label: 'О нас' },
];

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Интернет магазин почтовых открыток для посткроссинга DarlingDove</title>
        <meta name="description" content='Чудесный магазин почтовых открыток! Здесь вы можете купить качественные почтовые открытки для посткроссинга и сопутствующие товары!' />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded">
          <div className="container flex flex-wrap justify-between items-center mx-auto">
            <div className="hidden z-50 my-4 text-base list-none bg-white rounded divide-y divide-gray-100 shadow">
              <ul className="py-1" aria-labelledby="dropdown">
                {menu.map(({ label }) => (
                  <li key={label}>
                    <a href="#" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <a href="/" className="flex items-center">
              <span className="self-center text-xl font-semibold whitespace-nowrap">DarlingDove</span>
            </a>
            <div className="flex items-center md:order-2 space-x-4">
              <a className='text-gray-700 md:hover:text-blue-700' href='#'><HiOutlineUserCircle size={24} /></a>
              <a className='text-gray-700 md:hover:text-blue-700' href='#'><HiOutlineShoppingBag size={24} /></a>
            </div>
            <div className="hidden justify-between items-center w-full md:flex md:w-auto md:order-1" id="mobile-menu-2">
              <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
                {menu.map(({ label }, index) => {
                  const classes = index === 5
                    ? 'block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0'
                    : 'block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0';
                  return (
                    <li key={label}>
                      <a href="#" className={classes}>{label}</a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main className='container mx-auto'>
        {/* <Image src='/greeting.jpeg' width={1900} height={550} /> */}
        <div className='py-40 w-96'>
          <h1 className='text-4xl'>Открытки объединяющие мир</h1>
          <p>some text below</p>
        </div>
      </main>

      <footer>
        <h2>FOOTER</h2>
      </footer>
    </div>
  )
}

export default Home
