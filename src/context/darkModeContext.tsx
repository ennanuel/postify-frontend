import { createContext, useState, useEffect } from 'react';

type ContextArgTypes = { 
    darkMode: boolean;
    toggle: React.MouseEventHandler<HTMLButtonElement>
}

export const DarkModeContext = createContext<ContextArgTypes>({ darkMode: false, toggle: () => null });

export function DarkModeContextProvider ({ children } : { children: JSX.Element }) {
    const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === 'true');

    const toggle = () => {
        setDarkMode(!darkMode);
    }

    useEffect( () => {
        localStorage.setItem("darkMode", String(darkMode));
    }, [darkMode])

    return <DarkModeContext.Provider value={{ darkMode, toggle }}>
        {children}
    </DarkModeContext.Provider>
}