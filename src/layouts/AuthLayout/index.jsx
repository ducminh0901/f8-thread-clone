import { Outlet } from "react-router-dom";

function AuthLayout() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-neutral-900">
            <div className="w-full max-w-md">
                <Outlet />
            </div>
        </div>
    );
}

export default AuthLayout;
