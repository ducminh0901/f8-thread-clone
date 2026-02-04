import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "@/components/navigation/Sidebar";
import LoginPanel from "@/components/auth/LoginPanel";
import FeedHeader from "@/components/feed/FeedHeader";
import { PATHS } from "@/configs/path";
import CreatePostModal from "@/components/posts/Modal/CreatePostModal";
import CreatePostButton from "@/components/feed/PostButton";
import ProtectedView from "@/components/auth/ProtectedView";
import { Button } from "@/components/ui/button";
import { BottomSidebar } from "@/components/navigation/BottomSidebar";
import { MobileHeader } from "@/components/navigation/MobileHeader";
import { selectIsAuth } from "@/features/auth/authSlice";
import { useSelector } from "react-redux";

export default function DefaultLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const isLoggedIn = useSelector(selectIsAuth);

    return (
        <div className="h-screen w-full bg-gray-50 dark:bg-neutral-950 transition-colors duration-300 overflow-hidden flex">
            {/* 1. SIDEBAR */}
            <aside className="hidden md:block w-20 xl:w-64 shrink-0 transition-all duration-300">
                <Sidebar />
            </aside>

            {/* 2. PHẦN CÒN LẠI */}
            <div className="flex-1 flex justify-center overflow-hidden">
                {/* 3. CONTAINER TRUNG TÂM */}
                <div className="flex h-full w-full max-w-250 gap-3 px-0 md:px-4">
                    {/* FEED COLUMN*/}
                    <div className="flex flex-1 flex-col pt-0 md:pt-4 items-center">
                        <div className="w-full flex flex-col h-full">
                            {/* Header */}
                            <div className="hidden md:block sticky top-0 z-50 bg-gray-50 dark:bg-neutral-950 pb-3">
                                <FeedHeader />
                            </div>

                            <MobileHeader />

                            {/* Main Content */}
                            <main className="rounded-none md:rounded-t-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 overflow-hidden transition-all">
                                <div className="h-full overflow-y-auto no-scrollbar">
                                    <Outlet />
                                </div>
                            </main>

                            {location.pathname === PATHS.CREATE && (
                                <CreatePostModal />
                            )}

                            <ProtectedView>
                                <div className="fixed bottom-6 right-6 hidden md:block md:absolute md:bottom-10 md:right-10">
                                    <CreatePostButton />
                                </div>
                            </ProtectedView>
                        </div>
                    </div>

                    {/* 4. LOGIN PANEL */}
                    <aside className="hidden lg:block shrink-0 pt-4 mt-9">
                        <div className="hidden xl:block w-85">
                            <LoginPanel />
                        </div>

                        <div className="hidden sm:block xl:hidden">
                            <Button
                                className="shadow-sm rounded-xl hover:bg-white dark:hover:bg-neutral-800 transition-all"
                                onClick={() => navigate(PATHS.LOGIN)}
                            >
                                Đăng nhập
                            </Button>
                        </div>
                    </aside>
                </div>
            </div>

            <BottomSidebar />
        </div>
    );
}
