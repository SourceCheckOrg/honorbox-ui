import { useContext } from 'react';
import { IconMenu } from '../components/Icons';
import { MenuOpenedContext } from '../context/MenuOpenedContext';

export default function OpenSideBar() {
  const { menuOpened, setMenuOpened } = useContext(MenuOpenedContext);
  
  return (
    <div className="md:hidden pt-3">
      <button
        onClick={() => setMenuOpened(!menuOpened)}
        className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      >
        <span className="sr-only">Open sidebar</span>
        <IconMenu />
      </button>
    </div>
  );
}
