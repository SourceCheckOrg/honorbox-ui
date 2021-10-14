import Link from 'next/link';
import { useRouter } from 'next/router';
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
  const router = useRouter();

  return (
    <div className="hidden md:flex md:flex-shrink-0 fixed h-screen top-0 pt-16">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-gray-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 bg-gray-700 space-y-1">
              { renderItems(items, router.pathname) }
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
