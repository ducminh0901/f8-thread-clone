import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setTheme } from "@/features/ui/uiSlice";
import { logOut, selectIsAuth } from "@/features/auth/authSlice";

export function MenuNav() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector(selectIsAuth);

    const handleLogOut = () => {
        dispatch(logOut());
        navigate("/login");
    };

    const menuItem = "h-10 cursor-pointer";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="size-12 hover:bg-gray-100 dark:hover:bg-neutral-800"
                >
                    <svg
                        aria-label="More"
                        role="img"
                        viewBox="0 0 24 24"
                        className="size-6"
                        fill="currentColor"
                    >
                        <rect
                            rx="1.25"
                            x="3"
                            y="7"
                            width="21"
                            height="2.5"
                        ></rect>
                        <rect
                            rx="1.25"
                            x="3"
                            y="15"
                            width="14"
                            height="2.5"
                        ></rect>
                    </svg>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                className="w-64 rounded-xl p-2 text-[15px] font-medium shadow-xl"
            >
                <DropdownMenuGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className={menuItem}>
                            Giao diện
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent className="rounded-xl p-2 text-[15px] font-medium">
                                <DropdownMenuItem
                                    className={menuItem}
                                    onClick={() => dispatch(setTheme("light"))}
                                >
                                    Sáng
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className={menuItem}
                                    onClick={() => dispatch(setTheme("dark"))}
                                >
                                    Tối
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className={menuItem}
                                    onClick={() => dispatch(setTheme("system"))}
                                >
                                    Tự động
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>

                    {isLoggedIn && (
                        <>
                            <DropdownMenuItem className={menuItem}>
                                Thông tin chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem className={menuItem}>
                                Cài đặt
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuGroup>

                {isLoggedIn && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger className={menuItem}>
                                    Bảng feed
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent className="rounded-xl p-2 font-medium">
                                        <DropdownMenuItem className={menuItem}>
                                            Dành cho bạn
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className={menuItem}>
                                            Đang theo dõi
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuItem className={menuItem}>
                                Đã lưu
                            </DropdownMenuItem>
                            <DropdownMenuItem className={menuItem}>
                                Đã thích
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem className={menuItem}>
                    Báo cáo sự cố
                </DropdownMenuItem>

                {isLoggedIn && (
                    <DropdownMenuItem
                        className="h-10 text-red-500 focus:text-red-500 cursor-pointer"
                        onClick={handleLogOut}
                    >
                        Đăng xuất
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
