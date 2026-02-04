import { VALIDATION_RULES } from "@/configs/constants";
import { z } from "zod";

export const loginSchema = z.object({
    login: z
        .string()
        .min(1, "Không được để trống")
        .refine(
            (v) => v.includes("@") || v.length >= 3,
            "Email hoặc username không hợp lệ"
        ),

    password: z
        .string()
        .min(VALIDATION_RULES.PASSWORD_MIN_LENGTH, "Tối thiểu 8 ký tự"),
});
