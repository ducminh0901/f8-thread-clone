import { NavLink } from "react-router";
import { Instagram } from "lucide-react";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";

function LoginPanel() {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    if (isLoggedIn) return null;

    const links = [
        "Điều khoản của Threads",
        "Chính sách quyền riêng tư",
        "Chính sách cookie",
        "Báo cáo sự cố",
    ];

    return (
        <aside className="select-none">
            {/* Box Login chính */}
            <div
                className="
                    rounded-3xl
                    bg-white
                    dark:bg-neutral-900
                    border
                    px-8 py-8
                    min-h-70
                    flex flex-col justify-center
                    text-center
                "
            >
                <h2 className="text-xl font-bold tracking-tight ">
                    Đăng nhập hoặc đăng ký Threads
                </h2>

                <p className="mt-4 text-[15px] leading-relaxed px-2">
                    Xem mọi người đang nói về điều gì và tham gia cuộc trò
                    chuyện.
                </p>

                <div className="mt-8 space-y-4">
                    <Button
                        className="
                            flex w-full items-center justify-center gap-3
                            rounded-2xl
                            text-base
                            bg-neutral-100
                            h-14 
                            font-semibold
                            text-neutral-900
                            hover:bg-neutral-200
                            transition-all active:scale-[0.98]
                        "
                    >
                        <Instagram className="h-5 w-5" />
                        Tiếp tục bằng Instagram
                    </Button>

                    <NavLink
                        to="/login"
                        className="block text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                    >
                        Đăng nhập bằng tên người dùng
                    </NavLink>
                </div>
            </div>

            {/* Footer đi kèm */}
            <div className="mt-2 px-6 text-center">
                <div className="flex flex-wrap justify-center gap-x-4 text-[12px] text-neutral-500/80">
                    <span className="cursor-default">© 2026</span>
                    {links.map((link) => (
                        <a
                            key={link}
                            href="#"
                            className="hover:underline transition-all dark:hover:text-neutral-300"
                        >
                            {link}
                        </a>
                    ))}
                </div>
            </div>
        </aside>
    );
}

export default LoginPanel;
