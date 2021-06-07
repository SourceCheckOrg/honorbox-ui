import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { Transition } from '@headlessui/react';
import { useAuth } from '../context/auth';
import getIcon from '../components/Icons';

const CLASSES_TEXT_SELECTED = 'bg-gray-900 text-white group flex items-center px-2 py-2 text-base font-medium rounded-md';
const CLASSES_TEXT_NORMAL = 'text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-base font-medium rounded-md';

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

export default function MobileMenu({ items, menuOpened, setMenuOpened }) {
  const { user, setUser, logout } = useAuth();
  const router = useRouter();
  const IconX = getIcon('x');

  function userLogout() {
    logout();
    setUser(null);
    Router.push('/');
  }

  return (
    <Transition show={menuOpened}>
      <div id="off-canvas-menu-mobile" className={`${menuOpened ? "block" : "block"} md:hidden`}>
        <div className="fixed inset-0 flex z-40">
          <Transition.Child
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div id="off-canvas-menu-overlay" className="fixed inset-0">
              <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
            </div>
          </Transition.Child>
          <Transition.Child
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div id="off-canvas-menu" className="relative flex-1 flex flex-col max-w-xs w-full h-full  bg-gray-800">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setMenuOpened(!menuOpened)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <span className="sr-only">Close sidebar</span>
                  <IconX />
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <span className="text-white text-2xl font-thin widest">HonorBox</span>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  { renderItems(items, router.pathname) }
                </nav>
              </div>
              <div className="flex-shrink-0 flex bg-gray-700 p-4">
                <span className="flex-shrink-0 w-full group block">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{user ? user.username : 'Fetching user ...'}</p>
                      <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                        <span className="inline-block p-1 mt-1 bg-gray-800 hover:bg-gray-900 rounded-md cursor-pointer" onClick={userLogout}>Logout</span>
                      </p>
                    </div>
                  </div>
                </span>
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14"></div>
        </div>
      </div>
    </Transition>
  );
}
