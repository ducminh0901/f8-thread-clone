import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchService } from "@/services/searchService";
import { profileService } from "@/services/profileService";

export const fetchFollowSuggestions = createAsyncThunk(
    "search/fetchSuggestions",
    async (page = 1, { rejectWithValue }) => {
        try {
            const response = await searchService.getFollowSuggestions(page);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const fetchNextSuggestions = createAsyncThunk(
    "search/fetchNextSuggestions",
    async (_, { getState, rejectWithValue }) => {
        try {
            const { currentPage } = getState().search;
            const response = await searchService.getFollowSuggestions(
                currentPage + 1,
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const fetchInitialSearch = createAsyncThunk(
    "search/fetchInitial",
    async ({ q }, { rejectWithValue }) => {
        try {
            const response = await searchService.searchAll(q);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const followUser = createAsyncThunk(
    "search/followUser",
    async (userId, { getState, rejectWithValue }) => {
        try {
            const { profile } = getState();

            const isCurrentlyFollowing = profile.followings.some(
                (u) => String(u.id) === String(userId),
            );

            if (isCurrentlyFollowing) {
                await profileService.unfollowUser(userId);
                return { userId, nextState: false };
            } else {
                await profileService.followUser(userId);
                return { userId, nextState: true };
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

const searchSlice = createSlice({
    name: "search",
    initialState: {
        keyword: "",
        suggestions: [],
        userResults: [],
        topicResults: [],
        status: "idle",
        isInitialLoading: false,
        isFetchingMore: false,
        hasMore: true,
        currentPage: 1,
    },
    reducers: {
        setKeyword: (state, action) => {
            state.keyword = action.payload;
            if (action.payload === "") {
                state.userResults = [];
                state.topicResults = [];
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFollowSuggestions.pending, (state) => {
                state.status = "loading";
                state.isInitialLoading = true; // Bật loading khi bắt đầu gọi API lần đầu
            })
            .addCase(fetchFollowSuggestions.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.isInitialLoading = false;
                const data = action.payload;

                state.suggestions = Array.isArray(data) ? data : [];
                state.currentPage = 1;
                state.hasMore = state.suggestions.length >= 15;
            })

            .addCase(fetchFollowSuggestions.rejected, (state) => {
                state.status = "failed";
                state.isInitialLoading = false;
            })
            // Xử lý Load more Suggestions
            .addCase(fetchNextSuggestions.pending, (state) => {
                state.isFetchingMore = true;
            })
            .addCase(fetchNextSuggestions.fulfilled, (state, action) => {
                state.isFetchingMore = false;
                const newUsers = action.payload;

                if (Array.isArray(newUsers) && newUsers.length > 0) {
                    const existingIds = new Set(
                        state.suggestions.map((user) => user.id),
                    );

                    const uniqueNewUsers = newUsers.filter(
                        (user) => !existingIds.has(user.id),
                    );

                    if (uniqueNewUsers.length > 0) {
                        state.suggestions = [
                            ...state.suggestions,
                            ...uniqueNewUsers,
                        ];
                        state.currentPage += 1;
                    }

                    state.hasMore = newUsers.length >= 15;
                } else {
                    state.hasMore = false;
                }
            })
            .addCase(fetchInitialSearch.pending, (state) => {
                state.status = "loading";
                state.userResults = [];
                state.topicResults = [];
            })
            .addCase(fetchInitialSearch.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.userResults = action.payload.users || [];
                state.topicResults = action.payload.topics || [];
            })

            .addCase(followUser.fulfilled, (state, action) => {
                const userId = action.meta.arg;

                const updateList = (list) => {
                    const user = list.find((u) => u.id === userId);
                    if (!user) return;

                    const prev = user.is_following;
                    user.is_following = !prev;

                    if (user.is_following) {
                        user.followers_count += 1;
                    } else {
                        user.followers_count = Math.max(
                            0,
                            user.followers_count - 1,
                        );
                    }
                };

                updateList(state.suggestions);
                updateList(state.userResults);
            });
    },
});

export const { setKeyword } = searchSlice.actions;
export default searchSlice.reducer;
