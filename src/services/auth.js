import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "@/services/baseQuery";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery,
    endpoints: (builder) => ({
        me: builder.query({
            query: () => "/auth/me",
        }),

        login: builder.mutation({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body,
            }),
        }),

        register: builder.mutation({
            query: (body) => ({
                url: "/auth/register",
                method: "POST",
                body,
            }),
        }),

        checkUsername: builder.query({
            query: (username) => `/auth/check-username?username=${username}`,
        }),

        checkEmail: builder.query({
            query: (email) => `/auth/check-email?email=${email}`,
        }),

        forgotPassword: builder.mutation({
            query: (body) => ({
                url: "/auth/forgot-password",
                method: "POST",
                body,
            }),
        }),

        resetPassword: builder.mutation({
            query: ({ token, password, password_confirmation }) => ({
                url: "/auth/reset-password",
                method: "POST",
                body: { token, password, password_confirmation },
            }),
        }),

        verifyResetToken: builder.mutation({
            query: (token) => ({
                url: `/auth/reset-password/validate?token=${token}`,
                method: "GET",
            }),
        }),

        verifyEmail: builder.mutation({
            query: (token) => ({
                url: `/auth/verify-email?token=${token}`,
                method: "POST",
            }),
        }),

        resendVerification: builder.mutation({
            query: ({ email, token }) => {
                return {
                    url: "/auth/resend-verification-email",
                    method: "POST",
                    body: { email },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
            },
        }),
    }),
});

// export hooks
export const {
    useMeQuery,
    useLoginMutation,
    useRegisterMutation,
    useCheckUsernameQuery,
    useCheckEmailQuery,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useVerifyResetTokenMutation,
    useVerifyEmailMutation,
    useResendVerificationMutation,
} = authApi;
