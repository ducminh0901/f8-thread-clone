import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/schemas/registerSchema";
import { useRegisterMutation } from "@/services/auth";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Register() {
    const [registerUser, { isLoading }] = useRegisterMutation();
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (values) => {
        setErrorMsg("");
        setSuccessMsg("");

        const body = {
            username: values.username,
            email: values.email,
            password: values.password,
            password_confirmation: values.confirmPassword,
        };

        try {
            await registerUser(body).unwrap();
            setSuccessMsg(
                "Chúng tôi đã gửi một liên kết xác thực tới email của bạn. Vui lòng kiểm tra email để xác thực tài khoản.",
            );
        } catch (err) {
            console.error(err);
            setErrorMsg(err?.data?.message || "Đăng ký thất bại!");
        }
    };

    return (
        <div className="px-4 py-10">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-4 text-center">
                Đăng ký
            </h2>

            {successMsg && (
                <p className="text-center text-green-600 font-medium mb-4">
                    {successMsg}
                </p>
            )}

            {errorMsg && (
                <p className="text-center text-red-500 font-medium mb-4">
                    {errorMsg}
                </p>
            )}

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-full"
            >
                <input
                    placeholder="Tên hiển thị"
                    {...register("username")}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-200 dark:bg-neutral-700 border-none shadow-none focus:ring-1 focus:ring-neutral-300"
                />
                {errors.username && (
                    <p className="text-red-500 text-sm">
                        {errors.username.message}
                    </p>
                )}

                <input
                    placeholder="Email"
                    {...register("email")}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-200 dark:bg-neutral-700 border-none shadow-none focus:ring-1 focus:ring-neutral-300"
                />
                {errors.email && (
                    <p className="text-red-500 text-sm">
                        {errors.email.message}
                    </p>
                )}

                <input
                    type="password"
                    placeholder="Mật khẩu"
                    {...register("password")}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-200 dark:bg-neutral-700 border-none shadow-none focus:ring-1 focus:ring-neutral-300"
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
                    className="w-full px-4 py-3 rounded-xl bg-neutral-200 dark:bg-neutral-700 border-none shadow-none focus:ring-1 focus:ring-neutral-300"
                />
                {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                        {errors.confirmPassword.message}
                    </p>
                )}

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-bold mt-4 hover:opacity-90 transition-opacity"
                >
                    {isLoading ? "Loading..." : "Đăng ký"}
                </Button>
            </form>

            <p className="text-center text-sm mt-4">
                Đã có tài khoản?{" "}
                <Link className="hover:underline font-bold" to="/login">
                    Đăng nhập
                </Link>
            </p>
        </div>
    );
}
