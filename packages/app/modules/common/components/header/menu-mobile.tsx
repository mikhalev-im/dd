import { useState } from "react";
import Link from 'next/link';
import { HiOutlineMenu } from 'react-icons/hi';

const iconStyle = { paddingTop: '2px' };

interface MenuMobileProps {
  menu: { label: string, href: string }[];
}

const MenuMobile = ({ menu }: MenuMobileProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button className='mr-2 block hover:text-blue-700' style={iconStyle}>
        <HiOutlineMenu size={24} onClick={() => setMenuOpen(true)} />
      </button>
      <div
        className={`fixed top-0 bottom-0 left-0 right-0 bg-opacity-50 bg-black z-40 transition-opacity ${menuOpen ? 'opacity-100' : 'hidden'}`}
        onClick={() => setMenuOpen(false)}
      />
      <div className={`fixed w-1/4 min-w-fit bg-gray-100 top-0 left-0 bottom-0 z-50 transition-transform ${menuOpen ? '' : '-translate-x-full'}`}>
        <ul className="">
          {menu.map(({ label, href }) => (
            <li key={label}>
              <Link href={href}>
                <a className="block p-4 border-b text-sm">{label}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MenuMobile;
