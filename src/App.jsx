import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ROUTES } from "./routes";
import { Toaster } from "sonner";
import AuthDialog from "./components/auth/AuthDialog";
import QuoteModal from "./components/posts/Modal/QuoteModal";
import ReplyModal from "./components/posts/Modal/ReplyModal";
import EmbedModal from "./components/posts/Modal/EmbedModal";

import { useEffect } from "react";
import { useSelector } from "react-redux";

const PageTitle = ({ title, children }) => {
    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);

    return children;
};

function App() {
    const theme = useSelector((state) => state.ui.theme);

    useEffect(() => {
        const root = window.document.documentElement; // Chính là thẻ <html> trong file của bạn

        const applyTheme = () => {
            root.classList.remove("light", "dark");

            if (theme === "system") {
                const systemTheme = window.matchMedia(
                    "(prefers-color-scheme: dark)",
                ).matches
                    ? "dark"
                    : "light";
                root.classList.add(systemTheme);
            } else {
                root.classList.add(theme);
            }
        };

        applyTheme();

        // Lắng nghe nếu người dùng đổi theme hệ thống (Windows/macOS)
        if (theme === "system") {
            const mediaQuery = window.matchMedia(
                "(prefers-color-scheme: dark)",
            );
            mediaQuery.addEventListener("change", applyTheme);
            return () => mediaQuery.removeEventListener("change", applyTheme);
        }
    }, [theme]);
    return (
        <>
            <Toaster richColors position="top-right" />

            <Router basename="/f8-thread-clone">
                <Routes>
                    {ROUTES.map((rou, index) => {
                        const Layout = rou.layout;
                        return (
                            <Route key={index} element={<Layout />}>
                                {rou.children.map((child, index) => {
                                    const Element = child.element;
                                    return (
                                        <Route
                                            key={index}
                                            path={child.path}
                                            element={
                                                <PageTitle title={child.title}>
                                                    <Element />
                                                </PageTitle>
                                            }
                                        />
                                    );
                                })}
                            </Route>
                        );
                    })}
                </Routes>

                <AuthDialog />

                <QuoteModal />
                <ReplyModal />
                <EmbedModal />
            </Router>
        </>
    );
}

export default App;
