import React, { useEffect, useMemo, useState } from "react";
import { type ColorTheme } from "../utils/types";

interface DefaultColorThemeProviderType {
    children: React.ReactNode;
}

export interface DefaultColorThemeContextType {
    profileId: string | null;
    setProfileId: (profileId: string | null) => void;
    defaultTheme: ColorTheme | null;
    setDefaultTheme: (theme: ColorTheme | null) => void;
}

export const DefaultColorThemeContext = React.createContext<DefaultColorThemeContextType>({
    profileId: null,
    setProfileId: () => {},
    defaultTheme: null,
    setDefaultTheme: () => {},
});

export const DefaultColorThemeProvider: React.FC<DefaultColorThemeProviderType> = ({ children }) => {
    const [profileId, setProfileId] = useState<string | null>(() => {
        try {
            const stored = localStorage.getItem("profileId");
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (profileId) localStorage.setItem("profileId", JSON.stringify(profileId));
        else localStorage.removeItem("profileId");
    }, [profileId]);

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
            profileId,
            setProfileId,
            defaultTheme,
            setDefaultTheme,
        }),
        [profileId, defaultTheme]
    );

    return (
        <DefaultColorThemeContext.Provider value={providerValue}>
            {children}
        </DefaultColorThemeContext.Provider>
    );
};
