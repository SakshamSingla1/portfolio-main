import React from "react";
import { DefaultColorThemeContext } from "../contexts/defaultColorThemeContextValue";

export const useDefaultColorTheme = () => {
  const context = React.useContext(DefaultColorThemeContext);

  if (!context) {
    throw new Error(
      "useDefaultColorTheme must be used within DefaultColorThemeProvider"
    );
  }

  return context;
};
