import React, { useState } from "react";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import OpenSideBar from "./OpenSidebar";

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
  {
    icon: 'currencyDollar',
    label: 'Revenue Shares',
    href: '/revenue-shares'
  },
  {
    icon: 'bookOpen',
    label: 'Publications',
    href: '/publications'
  },
]

export default function Layout(props) {
  const [menuOpened, setMenuOpened] = useState(false);
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <DesktopMenu items={menuItems} />
      <MobileMenu items={menuItems} menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <OpenSideBar menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
        {props.children}
      </div>
    </div>
  );
}
