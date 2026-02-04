import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store/index";
import "@/styles/scrollbar.css";

createRoot(document.getElementById("root")).render(
    <ReduxProvider store={store}>
        <App />
    </ReduxProvider>
);
