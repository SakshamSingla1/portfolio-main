import React from "react";
import { type ColorTheme } from "../utils/types";

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
