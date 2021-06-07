import { useAuth } from '../context/auth';
import Router from 'next/router';

const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;

export default function LoggedIn() {
  const { user, setUser, logout } = useAuth();

  return (
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <div className="text-sm text-white inline-block px-4">
          {user.username}
        </div>
          <button
            type="button"
            className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
            onClick={() => {
                logout();
                setUser(null);
                Router.push('/');
            }}
          >
            <span>Logout</span>
          </button>
      </div>
    </div>
  );
}
