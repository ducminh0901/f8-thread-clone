import { PAGE_TITLES, PATHS } from "@/configs/path";
import DefaultLayout from "@/layouts/DefaultLayout";
import AuthLayout from "@/layouts/AuthLayout";

import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Profile from "@/pages/Profile";
import Activity from "@/pages/Activity";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";
import EmbedLayout from "./layouts/EmbedLayout";
import Embed from "./pages/Embed";
import PostDetailPage from "./pages/PostDetailPage";
import VerifyEmail from "@/pages/Auth/VerifyEmail";

const ROUTES = [
    {
        layout: DefaultLayout,
        children: [
            { path: PATHS.HOME, element: Home, title: PAGE_TITLES[PATHS.HOME] },
            {
                path: PATHS.SEARCH,
                element: Search,
                title: PAGE_TITLES[PATHS.SEARCH],
            },
            {
                path: PATHS.CREATE,
                element: Home,
                title: PAGE_TITLES[PATHS.CREATE],
            },
            {
                path: PATHS.PROFILE,
                element: Profile,
            },
            {
                path: PATHS.ACTIVITY,
                element: Activity,
                title: PAGE_TITLES[PATHS.ACTIVITY],
            },
            {
                path: PATHS.POST_DETAIL,
                element: PostDetailPage,
            },
        ],
    },
    {
        layout: AuthLayout,
        children: [
            {
                path: PATHS.LOGIN,
                element: Login,
                title: PAGE_TITLES[PATHS.LOGIN],
            },
            {
                path: PATHS.REGISTER,
                element: Register,
                title: PAGE_TITLES[PATHS.REGISTER],
            },
            {
                path: PATHS.FORGOT_PASSWORD,
                element: ForgotPassword,
                title: PAGE_TITLES[PATHS.FORGOT_PASSWORD],
            },
            {
                path: PATHS.RESET_PASSWORD,
                element: ResetPassword,
                title: PAGE_TITLES[PATHS.RESET_PASSWORD],
            },
            {
                path: PATHS.VERIFY_EMAIL,
                element: VerifyEmail,
                title: PAGE_TITLES[PATHS.VERIFY_EMAIL],
            },
        ],
    },
    {
        layout: EmbedLayout,
        children: [
            {
                path: PATHS.POST_EMBED,
                element: Embed,
                title: PAGE_TITLES[PATHS.POST_EMBED],
            },
        ],
    },
];

export { ROUTES };
