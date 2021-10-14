import React, { createContext, useState } from 'react';

export const MenuOpenedContext = createContext();

const MenuOpenedContextProvider = (props) => {
  const [menuOpened, setMenuOpened] = useState(false);
  return (
    <MenuOpenedContext.Provider value={{ menuOpened, setMenuOpened }}>
      {props.children}
    </MenuOpenedContext.Provider>
  )
}

export default MenuOpenedContextProvider;