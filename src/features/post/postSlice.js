import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postService } from "@/services/postService";
import { PAGINATION } from "@/configs/constants";
import { openAuthDialog } from "../ui/uiSlice";

// map data
const mapPosts = (posts = []) =>
    posts.map((post) => ({
        ...post,
        author: post.user?.username || post.author,
        likeCount: post.likes_count ?? 0,
        reposts: post.reposts_and_quotes_count ?? 0,
        isLiked: !!post.is_liked_by_auth,
        isReposted: !!post.is_reposted_by_auth,
        comments: post.replies_count ?? 0,
        shares: 0,
    }));

// fetch page đầu
export const fetchInitialPosts = createAsyncThunk(
    "post/fetchInitial",
    async () => {
        const res = await postService.getFeed({
            page: PAGINATION.DEFAULT_PAGE,
            type: "for_you",
        });
        return res.data;
    },
);

// fetch infinite scroll
export const fetchNextPosts = createAsyncThunk(
    "post/fetchNext",
    async (_, { getState }) => {
        const { page } = getState().posts;

        const res = await postService.getFeed({
            page,
            type: "for_you",
        });

        return res.data;
    },
);

export const fetchPostDetail = createAsyncThunk(
    "post/fetchDetail",
    async (postId, { rejectWithValue }) => {
        try {
            const res = await postService.getPostById(postId);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

// like
export const likePost = createAsyncThunk(
    "post/like",
    async (postId, { rejectWithValue }) => {
        try {
            const res = await postService.likePost(postId);
            return { postId, serverData: res.data };
        } catch (err) {
            return rejectWithValue(postId);
        }
    },
);

// repost
export const repostPost = createAsyncThunk(
    "post/repost",
    async (postId, { rejectWithValue }) => {
        try {
            const res = await postService.repost(postId);
            // Giả sử server trả về: { is_reposted: true, reposts_count: 3 }
            return { postId, serverData: res.data };
        } catch (err) {
            return rejectWithValue(postId);
        }
    },
);

export const addPost = createAsyncThunk(
    "post/addPost",
    async (postData, { rejectWithValue, dispatch }) => {
        try {
            const res = await postService.createPost(postData);
            return res.data;
        } catch (err) {
            if (err.message === "UNAUTHORIZED") {
                dispatch(openAuthDialog());
            }
            return rejectWithValue(err.message);
        }
    },
);

export const deletePost = createAsyncThunk(
    "post/delete",
    async (postId, { rejectWithValue, dispatch }) => {
        try {
            await postService.deletePost(postId);
            return postId;
        } catch (err) {
            if (err.message === "UNAUTHORIZED") {
                dispatch(openAuthDialog());
            }
            return rejectWithValue(err.message);
        }
    },
);

export const editPost = createAsyncThunk(
    "post/edit",
    async ({ postId, content, topic }, { rejectWithValue, dispatch }) => {
        try {
            const res = await postService.updatePost(postId, {
                content,
                topic,
            });
            return res.data;
        } catch (err) {
            if (err.message === "UNAUTHORIZED") dispatch(openAuthDialog());
            return rejectWithValue(err.message);
        }
    },
);

export const quotePost = createAsyncThunk(
    "post/quote",
    async ({ postId, content }, { rejectWithValue, dispatch }) => {
        try {
            const res = await postService.quotePost(postId, content);
            return res.data;
        } catch (err) {
            if (err.message === "UNAUTHORIZED") {
                dispatch(openAuthDialog());
            }
            return rejectWithValue(err.message);
        }
    },
);

const postSlice = createSlice({
    name: "post",
    initialState: {
        posts: [],
        currentPost: null,
        page: PAGINATION.DEFAULT_PAGE,
        hasMore: true,
        isInitialLoading: false,
        isFetchingMore: false,
        isPosting: false,
    },
    reducers: {
        createPost(state, action) {
            state.posts.unshift(action.payload);
        },

        // optimistic like
        toggleLike: (state, action) => {
            const post =
                state.posts.find((p) => p.id === action.payload) ||
                state.currentPost;
            if (post && post.id === action.payload) {
                post.isLiked = !post.isLiked;
                post.likeCount += post.isLiked ? 1 : -1;
            }
        },

        // optimistic repost
        toggleRepost: (state, action) => {
            const post =
                state.posts.find((p) => p.id === action.payload) ||
                state.currentPost;
            if (post && post.id === action.payload) {
                post.isReposted = !post.isReposted;
                post.reposts += post.isReposted ? 1 : -1;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // initial
            .addCase(fetchInitialPosts.pending, (state) => {
                state.isInitialLoading = true;
            })
            .addCase(fetchInitialPosts.fulfilled, (state, action) => {
                state.posts = mapPosts(action.payload);
                state.page = PAGINATION.DEFAULT_PAGE + 1;
                state.hasMore = action.payload.length > 0;
                state.isInitialLoading = false;
            })
            .addCase(fetchInitialPosts.rejected, (state) => {
                state.isInitialLoading = false;
                state.posts = [];
            })

            // add post
            .addCase(addPost.pending, (state) => {
                state.isPosting = true;
            })
            .addCase(addPost.fulfilled, (state, action) => {
                state.isPosting = false;
                if (action.payload) {
                    const newPost = mapPosts([action.payload])[0];
                    state.posts.unshift(newPost);
                }
            })
            .addCase(addPost.rejected, (state) => {
                state.isPosting = false;
            })

            // next page
            .addCase(fetchNextPosts.pending, (state) => {
                state.isFetchingMore = true;
            })
            .addCase(fetchNextPosts.fulfilled, (state, action) => {
                const incomingPosts = mapPosts(action.payload);

                // Lọc bỏ những bài đã có trong state (tránh trùng do unshift addPost)
                const uniqueNewPosts = incomingPosts.filter(
                    (newPost) => !state.posts.some((p) => p.id === newPost.id),
                );

                state.posts.push(...uniqueNewPosts);
                state.page += 1;
                state.isFetchingMore = false;
                // Nếu số lượng bài về ít hơn limit, nghĩa là đã hết dữ liệu
                state.hasMore = action.payload.length > 0;
            })

            .addCase(fetchNextPosts.rejected, (state) => {
                state.isFetchingMore = false;
            })

            .addCase(fetchPostDetail.pending, (state) => {
                state.isInitialLoading = true;
                state.currentPost = null;
            })
            .addCase(fetchPostDetail.fulfilled, (state, action) => {
                state.isInitialLoading = false;
                const mappedPost = mapPosts([action.payload])[0];
                state.currentPost = mappedPost;
            })
            .addCase(fetchPostDetail.rejected, (state) => {
                state.isInitialLoading = false;
                state.currentPost = null;
            })

            // rollback like
            .addCase(likePost.fulfilled, (state, action) => {
                const { postId, serverData } = action.payload;
                const update = (p) => {
                    if (p && p.id === postId) {
                        p.isLiked = serverData.is_liked;
                        p.likeCount = serverData.likes_count;
                    }
                };
                state.posts.forEach(update);
                update(state.currentPost);
            })

            .addCase(likePost.rejected, (state, action) => {
                // Nếu lỗi thì đảo ngược lại trạng thái đã "lỡ" update ở toggleLike
                const post =
                    state.posts.find((p) => p.id === action.payload) ||
                    console.log(action.payload);
                state.currentPost;
                if (post && post.id === action.payload) {
                    post.isLiked = !post.isLiked;
                    post.likeCount += post.isLiked ? 1 : -1;
                }
            })

            // rollback repost
            .addCase(repostPost.fulfilled, (state, action) => {
                const { postId, serverData } = action.payload;
                const update = (p) => {
                    if (p && p.id === postId) {
                        // Ghi đè số chuẩn từ server, dập tắt hiện tượng nhảy số 2
                        p.isReposted = serverData.is_reposted;
                        p.reposts = serverData.reposts_and_quotes_count;
                    }
                };
                state.posts.forEach(update);
                update(state.currentPost);
            })

            .addCase(repostPost.rejected, (state, action) => {
                const post =
                    state.posts.find((p) => p.id === action.payload) ||
                    state.currentPost;
                if (post && post.id === action.payload) {
                    post.isReposted = !post.isReposted;
                    post.reposts += post.isReposted ? 1 : -1;
                }
            })

            .addCase(deletePost.fulfilled, (state, action) => {
                // action.payload lúc này chính là postId được return từ thunk
                state.posts = state.posts.filter(
                    (post) => post.id !== action.payload,
                );
            })

            .addCase(deletePost.rejected, (state, action) => {
                // Bạn có thể thêm state thông báo lỗi ở đây nếu cần
                console.error("Xóa thất bại:", action.payload);
            })

            .addCase(editPost.fulfilled, (state, action) => {
                const updatedPost = action.payload;
                const index = state.posts.findIndex(
                    (p) => p.id === updatedPost.id,
                );

                if (index !== -1) {
                    // Map lại data từ BE để khớp với format FE (author, likeCount, ...)
                    const mappedPost = mapPosts([updatedPost])[0];

                    // Cập nhật bài viết tại vị trí đó
                    state.posts[index] = {
                        ...state.posts[index], // Giữ lại các state local nếu có
                        ...mappedPost, // Ghi đè bằng data mới từ server
                    };
                }
            })

            .addCase(quotePost.pending, (state) => {
                state.isPosting = true; // Dùng chung loading với addPost cho tiện
            })
            .addCase(quotePost.fulfilled, (state, action) => {
                state.isPosting = false;
                if (action.payload) {
                    // Map lại data từ BE để khớp format FE (author, likeCount...)
                    const newQuotePost = mapPosts([action.payload])[0];
                    // Đẩy bài mới lên đầu danh sách
                    state.posts.unshift(newQuotePost);
                }
            })
            .addCase(quotePost.rejected, (state) => {
                state.isPosting = false;
            });
    },
});

export const { createPost, toggleLike, toggleRepost } = postSlice.actions;

export default postSlice.reducer;
