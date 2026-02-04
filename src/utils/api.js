import { LOCAL_STORAGE_KEYS, HTTP_STATUS } from "@/configs/constants";

export const handleResponse = async (res) => {
    if (res.status === HTTP_STATUS.UNAUTHORIZED) {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

        throw new Error("UNAUTHORIZED_ERROR");
    }

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "REQUEST_FAILED");
    }

    return res;
};

export const getAuthHeaders = () => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    return {
        ...(token && { Authorization: `Bearer ${token}` }),
        "Content-Type": "application/json",
    };
};
