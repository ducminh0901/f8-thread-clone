import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    useResetPasswordMutation,
    useVerifyResetTokenMutation,
} from "@/services/auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Schema validate password
const resetPasswordSchema = z
    .object({
        password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    });

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token")?.trim();
    const navigate = useNavigate();

    const [verifyToken] = useVerifyResetTokenMutation();
    const [resetPassword] = useResetPasswordMutation();

    const [isValidToken, setIsValidToken] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
    });

    // Check token hợp lệ
    useEffect(() => {
        async function checkToken() {
            if (!token) {
                setIsValidToken(false);
                setErrorMessage("Liên kết không hợp lệ");
                return;
            }
            try {
                await verifyToken(token).unwrap();
                setIsValidToken(true);
            } catch (err) {
                setIsValidToken(false);
                setErrorMessage(
                    "Liên kết đã hết hạn hoặc không hợp lệ, vui lòng gửi lại yêu cầu quên mật khẩu",
                );
            }
        }
        checkToken();
    }, [token]);

    const onSubmit = async (data) => {
        if (!token) {
            toast.error(
                "Liên kết không hợp lệ, vui lòng gửi lại yêu cầu quên mật khẩu",
            );
            return;
        }

        try {
            await resetPassword({
                token,
                password: data.password.trim(),
                password_confirmation: data.confirmPassword.trim(),
            }).unwrap();

            navigate("/login", {
                state: {
                    message: "Tạo mật khẩu mới thành công, vui lòng đăng nhập",
                },
            });
        } catch (err) {
            const msg =
                err?.data?.message ||
                "Reset password thất bại, token có thể đã hết hạn";
            alert(msg);

            // Nếu token hết hạn, redirect về forgot-password
            if (msg.toLowerCase().includes("token")) {
                navigate("/forgot-password");
            }
        }
    };

    if (isValidToken === null)
        return <p className="text-center mt-10">Đang kiểm tra liên kết...</p>;

    if (isValidToken === false)
        return <p className="text-center mt-10 text-red-500">{errorMessage}</p>;

    return (
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto mt-10">
            <h2 className="text-xl font-bold text-center">Tạo mật khẩu mới</h2>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 mt-4"
            >
                <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    {...register("password")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                {errors.password && (
                    <p className="text-red-500 text-sm">
                        {errors.password.message}
                    </p>
                )}

                <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    {...register("confirmPassword")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                        {errors.confirmPassword.message}
                    </p>
                )}

                <Button type="submit" className="w-full">
                    Tạo mật khẩu mới
                </Button>
            </form>
        </div>
    );
}
