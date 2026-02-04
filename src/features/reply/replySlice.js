import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { replyService } from "@/services/replyService";
import { openAuthDialog } from "../ui/uiSlice";

// GET replies theo post
export const fetchReplies = createAsyncThunk(
    "reply/fetchReplies",
    async ({ postId, page = 1 }) => {
        const res = await replyService.getReplies(postId, page);
        return { data: res.data || res, page };
    },
);

// CREATE reply
export const createReply = createAsyncThunk(
    "reply/createReply",
    async ({ postId, content }, { rejectWithValue, dispatch }) => {
        try {
            const res = await replyService.createReply(postId, { content });
            return res.data || res;
        } catch (err) {
            if (err.response?.status === 401) {
                dispatch(openAuthDialog());
            }
            return rejectWithValue(err.response?.data || err.message);
        }
    },
);

const replySlice = createSlice({
    name: "reply",
    initialState: {
        replies: [],
        page: 1,
        isLoading: false,
        isPosting: false,
        hasMore: true,
        isOpen: false,
        targetPost: null,
    },
    reducers: {
        openReplyModal: (state, action) => {
            state.isOpen = true;
            state.targetPost = action.payload;
        },
        closeReplyModal: (state) => {
            state.isOpen = false;
            state.targetPost = null;
        },
        resetReplies: (state) => {
            state.replies = [];
            state.page = 1;
            state.hasMore = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReplies.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchReplies.fulfilled, (state, action) => {
                const { data, page } = action.payload;
                const incomingReplies = Array.isArray(data) ? data : [];

                if (page === 1) {
                    state.replies = incomingReplies;
                } else {
                    state.replies.push(...incomingReplies);
                }

                state.page = page + 1;
                state.isLoading = false;
                state.hasMore = incomingReplies.length > 0;
            })
            .addCase(fetchReplies.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(createReply.pending, (state) => {
                state.isPosting = true;
            })
            .addCase(createReply.fulfilled, (state, action) => {
                state.isPosting = false;
                if (action.payload) {
                    state.replies.unshift(action.payload);
                }
            })
            .addCase(createReply.rejected, (state) => {
                state.isPosting = false;
            });
    },
});

export const { resetReplies, openReplyModal, closeReplyModal } =
    replySlice.actions;
export default replySlice.reducer;
