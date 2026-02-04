import { useLocation } from "react-router-dom";

const titleMap = {
    "/": "Dành cho bạn",
    "/search": "Tìm kiếm",
    "/activity": "Hoạt động",
    "/profile": "Trang cá nhân",
};

export default function FeedHeader() {
    const { pathname } = useLocation();

    const title =
        titleMap[pathname] ||
        (pathname.startsWith("/profile") ? "Trang cá nhân" : "Threads");

    return (
        <div className="flex justify-center">
            <div className="px-4 text-center font-semibold">{title}</div>
        </div>
    );
}
