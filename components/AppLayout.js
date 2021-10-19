import React from "react";
import NavBar from "./NavBar";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import { useAuth } from '../context/auth';

const menuItems = [
  /*
  {
    icon: 'home',
    label: 'Dashboard',
    href: '/dashboard'
  },
  */
  {
    icon: 'user',
    label: 'Profile',
    href: '/profile'
  },
  /*
  {
    icon: 'currencyDollar',
    label: 'Revenue Shares',
    href: '/revenue-shares'
  },
  */
  {
    icon: 'bookOpen',
    label: 'Publications',
    href: '/publications'
  },
]

export default function Layout(props) {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="pt-16 bg-gray-50 relative h-full min-h-screen">
      <NavBar />
      <div className="flex">
        <MobileMenu items={menuItems} />
        { isAuthenticated ? (
          <>
            <DesktopMenu items={menuItems} />
            <div className="flex flex-col w-0 flex-1 md:ml-64">
              {props.children}
            </div>
          </>
        ) : (
          <div className="flex flex-col w-0 flex-1">
            {props.children}
          </div>
        )}
      </div>
    </div>
  );
}
