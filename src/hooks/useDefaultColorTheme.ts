import React from "react";
import { DefaultColorThemeContext } from "../contexts/DefaultColorThemeContext";

export const useDefaultColorTheme = () => {
    const context = React.useContext(DefaultColorThemeContext);
    
    if (!context) {
        throw new Error("useDefaultColorTheme must be used within a DefaultColorThemeProvider");
    }

    return context;
};