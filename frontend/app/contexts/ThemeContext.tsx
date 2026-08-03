"use client";

import {
    createContext,
    useContext,
    useLayoutEffect,
    useState,
    ReactNode,
} from "react";

type ThemeContextType = {
    isDarkMode: boolean;
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [isDarkMode, setIsDarkMode] = useState(true);

    useLayoutEffect(() => {
        const temaSalvo = localStorage.getItem("theme");

        if (temaSalvo !== null) {
            setIsDarkMode(temaSalvo === "dark");
        }
    }, []);

    useLayoutEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);

    return (
        <ThemeContext.Provider
            value={{
                isDarkMode,
                setIsDarkMode,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme deve ser usado dentro do ThemeProvider");
    }

    return context;
}