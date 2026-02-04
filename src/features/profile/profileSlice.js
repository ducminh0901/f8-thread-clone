import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profileService } from "@/services/profileService";
// 1. IMPORT hành động followUser từ searchSlice
import { followUser } from "@/features/search/searchSlice";

export const fetchProfileData = createAsyncThunk(
    "profile/fetchData",
    async (userId, { rejectWithValue }) => {
        try {
            const userRes = await profileService.getMe();
            const myInfo = userRes.data?.data || userRes.data;
            const targetId = userId || myInfo.id;
            const repostsRes = await profileService.getReposts(targetId);
            const repostsData = repostsRes.data?.data || repostsRes.data || [];

            return {
                user: myInfo,
                reposts: repostsData,
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

export const updateProfile = createAsyncThunk(
    "profile/updateProfile",
    async (profileData, { rejectWithValue, dispatch }) => {
        try {
            const response = await profileService.updateMe(profileData);
            dispatch(fetchProfileData());
            return response.data?.data || response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message,
            );
        }
    },
);

export const fetchFollowers = createAsyncThunk(
    "profile/fetchFollowers",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await profileService.getFollowers(userId);
            return response.data?.data || response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

export const fetchFollowing = createAsyncThunk(
    "profile/fetchFollowing",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await profileService.getFollowing(userId);
            return response.data?.data || response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

const profileSlice = createSlice({
    name: "profile",
    initialState: {
        currentUser: JSON.parse(localStorage.getItem("cachedUser")) || null,
        reposts: [],
        followers: [],
        followings: [],
        followingsCount: parseInt(localStorage.getItem("followingsCount")) || 0,
        followersCount: parseInt(localStorage.getItem("followersCount")) || 0,
        isLoading: false,
    },
    reducers: {
        clearProfileData: (state) => {
            state.followers = [];
            state.followings = [];
            state.reposts = [];
            localStorage.removeItem("cachedUser");
            localStorage.removeItem("followingsCount");
            localStorage.removeItem("followersCount");
        },
    },
    extraReducers: (builder) => {
        builder
            // Xử lý Lấy danh sách đang theo dõi
            .addCase(fetchFollowing.fulfilled, (state, action) => {
                state.isLoading = false;
                const payloadData = action.payload.data || action.payload;
                const pagination = action.payload.pagination;

                state.followings = Array.isArray(payloadData)
                    ? payloadData
                    : [];

                // Sửa lỗi biến 'total' chưa định nghĩa
                const totalCount = pagination?.total || state.followings.length;
                state.followingsCount = totalCount;

                localStorage.setItem("followingsCount", totalCount.toString());
                if (state.currentUser) {
                    state.currentUser.followings_count = totalCount;
                }
            })

            // Xử lý Lấy danh sách người theo dõi
            .addCase(fetchFollowers.fulfilled, (state, action) => {
                state.isLoading = false;
                const payloadData = action.payload.data || action.payload;
                const pagination = action.payload.pagination;

                state.followers = Array.isArray(payloadData) ? payloadData : [];

                const totalCount = pagination?.total || state.followers.length;
                state.followersCount = totalCount;

                localStorage.setItem("followersCount", totalCount.toString());
                if (state.currentUser) {
                    state.currentUser.followers_count = totalCount;
                }
            })

            // 2. LẮNG NGHE FOLLOW TỪ SEARCH SLICE
            .addCase(followUser.fulfilled, (state, action) => {
                const { userId, nextState } = action.payload;

                if (nextState) {
                    // Nếu là FOLLOW
                    state.followingsCount += 1;
                    // Thêm vào list tạm để modal không bị rỗng
                    const exists = state.followings.some(
                        (u) => String(u.id) === String(userId),
                    );
                    if (!exists) {
                        state.followings.push({
                            id: userId,
                            is_following: true,
                        });
                    }
                } else {
                    // Nếu là UNFOLLOW
                    state.followingsCount = Math.max(
                        0,
                        state.followingsCount - 1,
                    );
                    state.followings = state.followings.filter(
                        (u) => String(u.id) !== String(userId),
                    );
                }

                // Cập nhật count vào currentUser và LocalStorage
                if (state.currentUser) {
                    state.currentUser.followings_count = state.followingsCount;
                }
                localStorage.setItem(
                    "followingsCount",
                    state.followingsCount.toString(),
                );
            })

            .addCase(fetchProfileData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProfileData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentUser = action.payload.user;
                state.reposts = action.payload.reposts;
                localStorage.setItem(
                    "cachedUser",
                    JSON.stringify(action.payload.user),
                );
            })
            .addCase(fetchProfileData.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isUpdating = false;
                if (state.currentUser) {
                    state.currentUser = {
                        ...state.currentUser,
                        ...action.payload,
                    };
                }
            });
    },
});

export const { clearProfileData } = profileSlice.actions;
export default profileSlice.reducer;
