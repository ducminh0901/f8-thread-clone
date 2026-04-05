import { Home, Search, Plus, Heart, User } from "lucide-react";

export const PATHS = {
    // Public routes
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    VERIFY_EMAIL: "/verify-email",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",

    // Protected routes
    PROFILE: "/profile/:username",
    POST_DETAIL: "/:username/post/:postId",
    POST_EMBED: "/:username/post/:postId/embed",
    EDIT_POST: "/post/:id/edit",

    // Feature routes
    SEARCH: "/search",
    ACTIVITY: "/activity",
    FOLLOWING: "/following",
    FOR_YOU: "/for-you",
    CREATE: "/compose/post",

    // Settings
    SETTINGS: "/settings",
    SETTINGS_PROFILE: "/settings/profile",
    SETTINGS_PRIVACY: "/settings/privacy",

    // Error pages
    NOT_FOUND: "/404",
    SERVER_ERROR: "/500",
};

// Navigation items
export const NAV_ITEMS = [
    { path: "/", label: "nav.home", icon: Home },
    { path: "/search", label: "nav.search", icon: Search },
    {
        path: "/compose/post",
        label: "nav.create",
        icon: Plus,
        requireAuth: true,
    },
    {
        path: "/activity",
        label: "nav.activity",
        icon: Heart,
        requireAuth: true,
    },
    {
        path: "/profile/:username",
        label: "nav.profile",
        icon: User,
        requireAuth: true,
    },
];

export const PAGE_TITLES = {
    [PATHS.HOME]: "Trang chủ • Threads",
    [PATHS.SEARCH]: "Tìm kiếm • Threads",
    [PATHS.ACTIVITY]: "Hoạt động • Threads",
    [PATHS.LOGIN]: "Đăng nhập • Threads",
    [PATHS.REGISTER]: "Đăng ký • Threads",
    [PATHS.CREATE]: "Tạo bài viết mới • Threads",
    [PATHS.SETTINGS]: "Cài đặt • Threads",
    // Đối với các route có params, ta để title mặc định

    [PATHS.POST_DETAIL]: "Chi tiết bài viết",

    [PATHS.POST_LOGIN]: "Đăng nhập • Threads",
    [PATHS.POST_REGISTER]: "Đăng ký • Threads",
    [PATHS.FORGOT_PASSWORD]: "Quên mật khẩu • Threads",
    [PATHS.RESET_PASSWORD]: "Đặt lại mật khẩu • Threads",
    [PATHS.VERIFY_EMAIL]: "Xác minh email • Threads",
};
