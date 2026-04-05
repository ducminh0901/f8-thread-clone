import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { NAV_ITEMS } from "@/configs/path";
import { cn } from "@/lib/utils";
import { selectCurrentUser, selectIsAuth } from "@/features/auth/authSlice";
import { openAuthDialog } from "@/features/ui/uiSlice";

export function BottomSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const currentUser = useSelector(selectCurrentUser);
    const isLoggedIn = useSelector(selectIsAuth);

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-neutral-950 backdrop-blur-lg border-t border-neutral-200 dark:border-neutral-800 z-50 px-4">
            <div className="flex justify-around items-center h-full max-w-lg mx-auto">
                {NAV_ITEMS.map((item) => {
                    // 1. Xử lý path (Profile cần username động)
                    const path =
                        item.path === "/profile/:username"
                            ? `/profile/${currentUser?.username || "you"}`
                            : item.path;
                    console.log(
                        "Current path:",
                        location.pathname,
                        " vs ",
                        path,
                    );

                    const isActive = location.pathname === path;
                    const Icon = item.icon;

                    // 2. Xác định type cho Auth Dialog (giống Sidebar desktop)
                    let authType = null;
                    if (item.path === "/compose/post") authType = "post";
                    else if (
                        item.path === "/activity" ||
                        item.path === "/profile/:username"
                    ) {
                        authType = "default";
                    }

                    return (
                        <div
                            key={item.path}
                            onClick={() => {
                                if (authType && !isLoggedIn) {
                                    dispatch(
                                        openAuthDialog({ type: authType }),
                                    );
                                } else {
                                    navigate(path);
                                }
                            }}
                            className={cn(
                                "p-3 transition-all duration-200 rounded-xl cursor-pointer",
                                isActive
                                    ? "text-black dark:text-white bg-neutral-100 dark:bg-neutral-900"
                                    : "text-neutral-500 hover:bg-gray-100 dark:hover:bg-neutral-900",
                            )}
                        >
                            <Icon
                                className={cn(
                                    "size-6",
                                    isActive && "stroke-[2.5px]",
                                )}
                            />
                        </div>
                    );
                })}
            </div>
        </nav>
    );
}
