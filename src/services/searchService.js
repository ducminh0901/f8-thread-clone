import { PAGINATION } from "@/configs/constants";
import httpRequest from "@/utils/httpRequests";

export const searchService = {
    // API Search tổng hợp: Trả về cả topics và users
    searchAll: (q, page = PAGINATION.DEFAULT_PAGE) =>
        httpRequest.get("/search", {
            params: { q, page },
        }),

    // API Search riêng cho Topics
    searchTopics: (q) =>
        httpRequest.get("/topics/search", {
            params: { q },
        }),

    getFollowSuggestions: (
        page = PAGINATION.DEFAULT_PAGE,
        per_page = PAGINATION.DEFAULT_LIMIT,
    ) =>
        httpRequest.get("/users/suggestions", {
            params: { page, per_page },
        }),
};
