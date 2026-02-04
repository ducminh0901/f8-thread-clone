import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForgotPasswordMutation } from "@/services/auth";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// 1. Schema validate email
const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Email không hợp lệ" }),
});

export default function ForgotPassword() {
    const [forgotPassword] = useForgotPasswordMutation();
    const [successMessage, setSuccessMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (values) => {
        try {
            await forgotPassword(values).unwrap();
            setSuccessMessage(
                "Liên kết đặt lại mật khẩu đã được gửi tới email của bạn",
            );
        } catch (err) {
            alert(err?.data?.message || "Gửi email thất bại");
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto mt-20 text-neutral-700 dark:text-neutral-200">
            <h2 className="text-xl font-bold text-center">Quên mật khẩu</h2>
            <p className="text-sm text-center">
                Nhập email của bạn để nhận liên kết đặt lại mật khẩu
            </p>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 mt-4"
            >
                <input
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-200 dark:bg-neutral-700 border-none shadow-none focus:ring-1 focus:ring-neutral-500"
                />
                {errors.email && (
                    <p className="text-red-500 text-sm">
                        {errors.email.message}
                    </p>
                )}

                <Button
                    type="submit"
                    className="w-full h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-neutral-700 font-bold mt-4 hover:opacity-90 transition-opacity"
                >
                    Đặt lại mật khẩu
                </Button>
            </form>

            {successMessage && (
                <p className="text-green-600 text-center mt-4">
                    {successMessage}
                </p>
            )}
        </div>
    );
}
