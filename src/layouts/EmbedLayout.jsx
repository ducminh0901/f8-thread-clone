// src/layouts/EmbedLayout.jsx
import { Outlet } from "react-router-dom";

const EmbedLayout = () => {
    return (
        <main className="w-full min-h-screen bg-white dark:bg-neutral-900 flex justify-center items-start">
            <div className="w-full">
                <Outlet />
            </div>
        </main>
    );
};

export default EmbedLayout;
