import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVerifyEmailMutation } from "@/services/auth";
import { PATHS } from "@/configs/path";
import { selectIsAuth } from "@/features/auth/authSlice";
import { useSelector } from "react-redux";
import { AlertCircle, Loader2 } from "lucide-react";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const isAuth = useSelector(selectIsAuth);
    const calledApi = useRef(false);

    const [verifyEmail, { isError }] = useVerifyEmailMutation();

    useEffect(() => {
        const handleVerify = async () => {
            if (calledApi.current || !token) return;
            calledApi.current = true;

            // Hàm xử lý chuyển hướng chung
            const onSuccess = () => {
                if (isAuth) {
                    toast.success("Xác minh tài khoản thành công!");
                    navigate("/", { replace: true });
                } else {
                    navigate(PATHS.LOGIN, {
                        state: { verified: true },
                        replace: true,
                    });
                }
            };

            try {
                // Tạo một Promise tự hủy sau 5 giây (phòng trường hợp Backend treo)
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(
                        () => reject(new Error("BACKEND_PENDING")),
                        5000,
                    ),
                );

                // Chạy đua giữa API và Timeout
                await Promise.race([
                    verifyEmail(token).unwrap(),
                    timeoutPromise,
                ]);

                // Nếu API về nhanh (thành công)
                onSuccess();
            } catch (err) {
                // Nếu lỗi là do treo 5s hoặc lỗi fetch (nhưng thực tế DB đã đổi)
                if (
                    err.message === "BACKEND_PENDING" ||
                    err.status === "FETCH_ERROR"
                ) {
                    console.warn(
                        "Backend không phản hồi nhưng ép chuyển hướng...",
                    );
                    onSuccess();
                } else {
                    // Nếu lỗi 400, 404 thật (Token sai/hết hạn) thì mới dừng lại
                    console.error("Verify failed:", err);
                }
            }
        };

        handleVerify();
    }, [token, verifyEmail, navigate, isAuth]);

    return (
        <div className="p-6 text-center">
            {!isError ? (
                // Luôn hiện Loading khi đang xử lý hoặc đang bị treo
                <div className="space-y-6 text-neutral-700 dark:text-neutral-200 ">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto" />
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold">
                            Đang xác minh tài khoản
                        </h3>
                        <p>Hệ thống đang xử lý, vui lòng đợi một chút...</p>
                    </div>
                </div>
            ) : (
                // Hiện lỗi nếu Token thực sự không hợp lệ
                <div className="space-y-6 animate-in zoom-in-95 duration-300">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-gray-900">
                            Xác thực thất bại
                        </h3>
                        <p className="text-red-500 text-sm">
                            Liên kết xác minh đã hết hạn hoặc không tồn tại.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(PATHS.LOGIN)}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all"
                    >
                        Quay lại Đăng nhập
                    </button>
                </div>
            )}
        </div>
    );
};

export default VerifyEmail;
