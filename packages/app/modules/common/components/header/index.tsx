import Link from 'next/link';
import { HiOutlineShoppingBag, HiOutlineUserCircle } from 'react-icons/hi';
import MenuMobile from './menu-mobile';

const menu = [
  { label: 'Открытки', href: '/category/postcards' },
  { label: 'Поиск', href: '#' },
  { label: 'О нас', href: '#' },
];

const Header = () => {
  return (
    <header className='text-gray-700'>
      <nav className="py-4">
        <div className="container flex justify-between items-center mx-auto px-2">

          {/* hamburger menu on small screens */}
          <MenuMobile menu={menu} />

          {/* site logo */}
          <Link href={'/'}>
            <a className="flex items-center">
              <span className="self-center text-xl font-semibold whitespace-nowrap">DarlingDove</span>
            </a>
          </Link>

          {/* main menu on wide screens */}
          <div className="justify-between items-center w-full md:flex md:w-auto">
            <ul className="hidden md:flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
              {menu.map(({ label, href }) => {
                return (
                  <li key={label}>
                    <Link href={href}>
                      <a className={'block py-2 pr-4 pl-3 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 hover:text-blue-700 md:p-0'}>{label}</a>
                    </Link>

                  </li>
                );
              })}
            </ul>
          </div>

          {/* profile and cart links */}
          <div className="flex items-center space-x-4">
            <a className='hover:text-blue-700' href='#'><HiOutlineUserCircle size={24} /></a>
            <a className='hover:text-blue-700' href='#'><HiOutlineShoppingBag size={24} /></a>
          </div>

        </div>
      </nav>
    </header>
  );
}

export default Header;
