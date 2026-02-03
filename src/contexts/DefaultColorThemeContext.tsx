import React, { useEffect, useMemo, useState} from "react";
import { type ColorTheme } from "../utils/types";

interface DefaultColorThemeProviderType {
    children: React.ReactNode;
}

export interface DefaultColorThemeContextType {
    defaultTheme: ColorTheme | null;
    setDefaultTheme: (theme: ColorTheme | null) => void;
}

export const DefaultColorThemeContext = React.createContext<DefaultColorThemeContextType>({
    defaultTheme: null,
    setDefaultTheme: () => {},
});

export const DefaultColorThemeProvider: React.FC<DefaultColorThemeProviderType> = ({ children }) => {
    const [defaultTheme, setDefaultTheme] = useState<ColorTheme | null>(() => {
        try {
            const stored = localStorage.getItem("defaultTheme");
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (defaultTheme) localStorage.setItem("defaultTheme", JSON.stringify(defaultTheme));
        else localStorage.removeItem("defaultTheme");
    }, [defaultTheme]);

    const providerValue = useMemo(
        () => ({
            defaultTheme,
            setDefaultTheme,
        }),
        [defaultTheme]
    );

    return (
        <DefaultColorThemeContext.Provider value={providerValue}>
            {children}
        </DefaultColorThemeContext.Provider>
    );
};
