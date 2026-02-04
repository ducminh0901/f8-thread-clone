import { VALIDATION_RULES } from "@/configs/constants";
import { z } from "zod";

export const registerSchema = z
    .object({
        username: z
            .string()
            .min(VALIDATION_RULES.USERNAME_MIN_LENGTH, "Tên quá ngắn"),
        email: z.string().email("Email không hợp lệ"),
        password: z
            .string()
            .min(VALIDATION_RULES.PASSWORD_MIN_LENGTH, "Tối thiểu 8 ký tự"),
        confirmPassword: z
            .string()
            .min(VALIDATION_RULES.PASSWORD_MIN_LENGTH, "Tối thiểu 8 ký tự"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
    });
