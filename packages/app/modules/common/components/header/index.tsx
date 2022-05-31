import Link from 'next/link';
import { HiOutlineShoppingBag, HiOutlineUserCircle } from 'react-icons/hi';
import MenuMobile from './menu-mobile';
import { useCart } from '../../../carts';

const menu = [
  { label: 'Открытки', href: '/category/postcards' },
  { label: 'Поиск', href: '/search' },
  { label: 'О нас', href: '/about' },
];

const Header = () => {
  const count = useCart();

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
            <Link href='/cart'>
              <a className='hover:text-blue-700 relative'>
                <HiOutlineShoppingBag size={24} />
                {count ? <span className='text-xs text-white text-center absolute -bottom-2 left-3.5 bg-pink-500 rounded px-1'>{count}</span> : null }
              </a>
            </Link>

          </div>

        </div>
      </nav>
    </header>
  );
}

export default Header;
