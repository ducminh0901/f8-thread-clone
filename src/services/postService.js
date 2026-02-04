import httpRequests from "@/utils/httpRequests"; // File chứa interceptor của bạn
import { PAGINATION } from "@/configs/constants";

export const postService = {
    async getFeed({ page = PAGINATION.DEFAULT_PAGE, type = "for_you" } = {}) {
        return httpRequests.get("/posts/feed", {
            params: { type, page },
        });
    },

    async createPost(postData) {
        return httpRequests.post("/posts", postData);
    },

    // --- Các hành động tương tác ---
    async likePost(postId) {
        return httpRequests.post(`/posts/${postId}/like`);
    },

    async repost(postId) {
        return httpRequests.post(`/posts/${postId}/repost`);
    },

    async toggleSave(postId) {
        return httpRequests.post(`/posts/${postId}/save`);
    },

    async notInterested(postId) {
        return httpRequests.post(`/posts/${postId}/hide`);
    },

    async quotePost(postId, content) {
        return httpRequests.post(`/posts/${postId}/quote`, { content });
    },

    // --- Các hành động với User ---
    async muteUser(userId) {
        return httpRequests.post(`/users/${userId}/mute`);
    },

    async blockUser(userId) {
        return httpRequests.post(`/users/${userId}/block`);
    },

    // --- Quản lý bài viết ---
    async reportPost(postId, reason) {
        return httpRequests.post(`/posts/${postId}/report`, reason);
    },

    async deletePost(postId) {
        return httpRequests.post(`/posts/${postId}`, { _method: "DELETE" });
    },

    async updatePost(postId, data) {
        return httpRequests.post(`/posts/${postId}`, {
            _method: "PUT",
            ...data,
        });
    },

    async getPostById(postId) {
        return httpRequests.get(`/posts/${postId}`);
    },
};
