import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/auth';
import OpenSideBar from './OpenSidebar';
import NavBarButtons from './NavBarButtons';

const CLASSES_TEXT_SELECTED = 'bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium';
const CLASSES_TEXT_NORMAL = 'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium';

const CLASSES_MOBILE_TEXT_SELECTED = 'bg-gray-900 block text-white px-3 py-2 rounded-md text-base font-medium';
const CLASSES_MOBILE_TEXT_NORMAL = 'text-gray-300 block hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium';

const menuItems = [
  {
    label: 'About',
    href: '/about'
  }
]

function renderMenuItems(pathname, isMobile) {
  return menuItems.map((item) => {
    const isSelected = item.href === pathname;
    let className;
    if (isMobile) {
      className = isSelected ? CLASSES_MOBILE_TEXT_SELECTED : CLASSES_MOBILE_TEXT_NORMAL;
    } else {
      className = isSelected ? CLASSES_TEXT_SELECTED : CLASSES_TEXT_NORMAL;
    }
    return (
      <Link href={item.href} key={item.href}>
        <a className={className}>{item.label}</a>
      </Link>
    );
  });
}

export default function NavBar() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <div className="bg-gray-800 fixed top-0 inset-x-0 h-16">
      <nav>
        <div className="mx-auto px-1 md:px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <OpenSideBar />
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  <span className="text-white text-2xl font-thin widest mr-8 cursor-pointer">
                    HonorBox
                  </span>
                </Link>
              </div>
              { !isAuthenticated ? (
                 <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                 { renderMenuItems(router.pathname, false) }
               </div>
              ) : (
                <></>
              )}
            </div>
            <NavBarButtons />
          </div>
        </div>
      </nav>
    </div>
  );
}
