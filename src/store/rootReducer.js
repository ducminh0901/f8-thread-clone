import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import profileReducer from "@/features/profile/profileSlice";
import uiReducer from "@/features/ui/uiSlice";
import postReducer from "@/features/post/postSlice";
import replyReducer from "@/features/reply/replySlice";
import quoteReducer from "@/features/quote/quoteSlice";
import embedReducer from "@/features/embed/embedSlice";
import searchReducer from "@/features/search/searchSlice";
import { authApi } from "@/services/auth";

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    ui: uiReducer,
    posts: postReducer,
    reply: replyReducer,
    quote: quoteReducer,
    embed: embedReducer,
    search: searchReducer,
    [authApi.reducerPath]: authApi.reducer,
});

export default rootReducer;
