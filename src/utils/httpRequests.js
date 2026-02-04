import axios from "axios";
import env from "@/configs/env";
import { HTTP_STATUS, LOCAL_STORAGE_KEYS } from "@/configs/constants";

const httpRequest = axios.create({
    baseURL: env.apiBaseUrl,
    timeout: env.apiTimeout,
    withCredentials: false,
});

let isRefreshing = false;
let queueJobs = [];

async function sendRefreshToken(refreshToken) {
    const response = await axios.post(`${env.apiBaseUrl}/auth/refresh-token`, {
        refresh_token: refreshToken,
    });

    const { access_token, refresh_token } = response.data.data;

    localStorage.setItem("accessToken", access_token);
    localStorage.setItem("refreshToken", refresh_token);

    return access_token;
}

httpRequest.interceptors.request.use((config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

httpRequest.interceptors.response.use(
    (res) => res.data,

    async (err) => {
        const refreshToken = localStorage.getItem(
            LOCAL_STORAGE_KEYS.REFRESH_TOKEN,
        );
        const originalRequest = err.config;

        if (
            err.response?.status === HTTP_STATUS.UNAUTHORIZED &&
            refreshToken &&
            !originalRequest.url.includes("/auth/refresh-token")
        ) {
            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const newAccessToken = await sendRefreshToken(refreshToken);

                    httpRequest.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    queueJobs.forEach((job) => job.resolve(newAccessToken));
                    queueJobs = [];

                    return httpRequest(originalRequest);
                } catch (error) {
                    queueJobs.forEach((job) => job.reject(error));
                    queueJobs = [];

                    localStorage.clear();
                    window.location.href = "/login";
                    return Promise.reject(error);
                } finally {
                    isRefreshing = false;
                }
            }

            return new Promise((resolve, reject) => {
                queueJobs.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return httpRequest(originalRequest);
            });
        }

        return Promise.reject(err);
    },
);

export default httpRequest;
