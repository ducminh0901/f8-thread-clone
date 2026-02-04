import httpRequests from "@/utils/httpRequests";

export const replyService = {
    // Sử dụng httpRequests đã cấu hình sẵn baseURL và interceptors
    getReplies: (postId, page) =>
        httpRequests.get(`/posts/${postId}/replies`, {
            params: { page },
        }),

    createReply: (postId, body) =>
        httpRequests.post(`/posts/${postId}/reply`, body),
};
