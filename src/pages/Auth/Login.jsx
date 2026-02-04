import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/loginSchema";
import {
    useLoginMutation,
    useResendVerificationMutation,
} from "@/services/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircleIcon } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();
    const [resendEmail, { isLoading: isResending }] =
        useResendVerificationMutation();

    // States quản lý UI
    const [unverifiedEmail, setUnverifiedEmail] = useState(null);
    const [tempToken, setTempToken] = useState(null);
    const [showVerifiedBanner, setShowVerifiedBanner] = useState(
        !!location.state?.verified,
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    // Hiện thông báo nếu có message từ redirect (nhưng không phải verified)
    useEffect(() => {
        if (location.state?.message && !location.state?.verified) {
            toast.success(location.state.message);
        }
    }, [location.state]);

    const onSubmit = async (values) => {
        setShowVerifiedBanner(false); // Tắt banner xanh khi bắt đầu login lại

        try {
            const res = await login(values).unwrap();
            const { user, access_token, refresh_token } = res.data;

            // TRƯỜNG HỢP: CHƯA VERIFY
            if (!user.verified || user.email_verified_at === null) {
                setUnverifiedEmail(user.email);
                setTempToken(access_token);
                toast.error("Tài khoản chưa được xác minh!");
                return;
            }

            // TRƯỜNG HỢP: THÀNH CÔNG
            dispatch(setCredentials({ accessToken: access_token, user }));
            localStorage.setItem("refreshToken", refresh_token);
            toast.success("Đăng nhập thành công!");
            navigate("/");
        } catch (err) {
            setUnverifiedEmail(null);
            setTempToken(null);
            toast.error("Mật khẩu hoặc tên đăng nhập không đúng");
        }
    };

    const handleResend = async () => {
        try {
            await resendEmail({
                email: unverifiedEmail,
                token: tempToken,
            }).unwrap();
            toast.success("Đã gửi lại link xác minh vào email của bạn!");
            setUnverifiedEmail(null); // Gửi xong thì ẩn thông báo đi cho sạch
        } catch (err) {
            toast.error(
                err?.data?.message || "Không thể gửi lại email lúc này.",
            );
        }
    };

    return (
        <div className="px-4 py-10">
            <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mb-4 text-center">
                Đăng nhập bằng tài khoản instagram
            </h2>
            {/* BANNER XANH: Xuất hiện khi vừa click link verify từ email về */}
            {showVerifiedBanner && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 mb-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">
                        Xác minh thành công! Vui lòng đăng nhập lại.
                    </span>
                </div>
            )}

            {/* BANNER VÀNG: Xuất hiện khi login vào acc chưa verify */}
            {unverifiedEmail && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl shadow-sm animate-in zoom-in-95">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold">
                                Bạn chưa xác minh email!
                            </p>
                            <p className="text-xs opacity-90 mb-2">
                                Vui lòng kiểm tra hộp thư {unverifiedEmail}
                            </p>
                            <button
                                onClick={handleResend}
                                disabled={isResending}
                                className="text-xs bg-amber-200/50 hover:bg-amber-200 px-3 py-1.5 rounded-lg font-bold transition-colors disabled:opacity-50"
                            >
                                {isResending
                                    ? "Đang gửi lại..."
                                    : "Gửi lại link xác minh"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-full"
            >
                <input
                    placeholder="Tên người dùng, số điện thoại hoặc email"
                    {...register("login")}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-200 dark:bg-neutral-700 border-none shadow-none focus:ring-1 focus:ring-neutral-300"
                />
                {errors.login && (
                    <p className="text-red-500 text-sm">
                        {errors.login.message}
                    </p>
                )}

                <input
                    type="password"
                    placeholder="Mật khẩu"
                    {...register("password")}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-200 dark:bg-neutral-700 border-none shadow-none focus:ring-1 focus:ring-neutral-300"
                />
                <Link
                    to="/forgot-password"
                    className="text-sm text-neutral-500 mt-1 hover:underline self-end"
                >
                    Quên mật khẩu?
                </Link>

                {errors.password && (
                    <p className="text-red-500 text-sm">
                        {errors.password.message}
                    </p>
                )}

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-bold mt-4 hover:opacity-90 transition-opacity"
                >
                    {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                </Button>
            </form>

            <p className="text-center text-sm mt-4">
                Chưa có tài khoản?{" "}
                <Link className="hover:underline font-bold" to="/register">
                    Đăng ký
                </Link>
            </p>

            <footer className="mt-10 text-xs text-gray-500 flex justify-center gap-3">
                <span>© 2025</span>
                <a className="hover:underline" href="#">
                    Threads Terms
                </a>
                <a className="hover:underline" href="#">
                    Privacy Policy
                </a>
                <a className="hover:underline" href="#">
                    Cookies Policy
                </a>
                <a className="hover:underline" href="#">
                    Report a problem
                </a>
            </footer>
        </div>
    );
}
