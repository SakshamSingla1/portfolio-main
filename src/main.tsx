import "./index.css";
import App from "./App";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { DefaultColorThemeProvider } from './contexts/DefaultColorThemeContext';

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <BrowserRouter>
        <DefaultColorThemeProvider>
            <App />
        </DefaultColorThemeProvider>
    </BrowserRouter>
);