import React, { useContext } from 'react';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { useAuth } from '../context/auth';
import getIcon from '../components/Icons';

const CLASSES_TEXT_SELECTED = 'bg-gray-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md';
const CLASSES_TEXT_NORMAL = 'text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md';

function renderItems(items, pathname) {
  return items.map(item => {
    const isSelected = pathname === item.href;
    const className = isSelected ? CLASSES_TEXT_SELECTED : CLASSES_TEXT_NORMAL
    const Icon = getIcon(item.icon)
    return (
      <Link href={item.href} key={item.href}>
        <a className={className}>
          <Icon isSelected={isSelected} /> {item.label}
        </a>
      </Link>
    );
  })
}

export default function DesktopMenu({ items }) {
  const { user, setUser, logout } = useAuth();
  const router = useRouter();

  // Handle log out
  function userLogout() {
    logout();
    setUser(null);
    Router.push('/');
  }

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-white text-2xl font-thin widest">HonorBox</span>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-gray-800 space-y-1">
              { renderItems(items, router.pathname) }
            </nav>
          </div>
          <div className="flex-shrink-0 flex bg-gray-700 p-4">
            <span className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user ? user.username : 'fetching ...'}</p>
                  <p className="text-xs font-small text-gray-300 group-hover:text-gray-200">
                    <span className="inline-block p-1 mt-1 bg-gray-800 hover:bg-gray-900 rounded-md cursor-pointer" onClick={userLogout}>Logout</span>
                  </p>
                </div>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
