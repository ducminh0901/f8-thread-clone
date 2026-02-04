import httpRequests from "@/utils/httpRequests";

// --- Các hành động với Profile ---
export const profileService = {
    async getMe() {
        return httpRequests.get(`/auth/user`);
    },
    async getReposts(userId) {
        return httpRequests.get(`/users/${userId}/reposts`);
    },
    async updateMe(data) {
        return httpRequests.put(`/auth/profile`, data);
    },

    async followUser(userId) {
        return httpRequests.post(`/users/${userId}/follow`);
    },

    async unfollowUser(userId) {
        return httpRequests.delete(`/users/${userId}/follow`);
    },

    async getFollowers(userId) {
        return httpRequests.get(`/users/${userId}/followers`);
    },

    async getFollowing(userId) {
        return httpRequests.get(`/users/${userId}/followings`);
    },
};
