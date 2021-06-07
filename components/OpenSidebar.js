import { IconMenu } from '../components/Icons';

export default function OpenSideBar({ menuOpened, setMenuOpened }) {
  return (
    <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
      <button
        onClick={() => setMenuOpened(!menuOpened)}
        className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      >
        <span className="sr-only">Open sidebar</span>
        <IconMenu />
      </button>
    </div>
  );
}
