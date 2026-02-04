import { createSlice } from "@reduxjs/toolkit";

const accessToken = localStorage.getItem("accessToken");

const initialState = {
    accessToken: accessToken,
    isLoggedIn: !!accessToken,
    currentUser: JSON.parse(localStorage.getItem("user")) || null,
    authStatus: "idle",
    authError: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Login / Register success
        setCredentials: (state, action) => {
            const { accessToken, user } = action.payload;

            state.accessToken = accessToken;
            state.isLoggedIn = true;
            state.currentUser = user || null;
            state.authStatus = "succeeded";
            state.authError = null;

            localStorage.setItem("accessToken", accessToken);
            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
            }
        },

        // Logout (manual hoặc token expired)
        logOut: (state) => {
            state.accessToken = null;
            state.isLoggedIn = false;
            state.currentUser = null;
            state.authStatus = "idle";
            state.authError = null;

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        },

        // Khi gọi API login
        setAuthLoading: (state) => {
            state.authStatus = "loading";
            state.authError = null;
        },

        // Login fail
        setAuthError: (state, action) => {
            state.authStatus = "failed";
            state.authError = action.payload;
        },

        // Reset state UI
        resetAuthStatus: (state) => {
            state.authStatus = "idle";
            state.authError = null;
        },
    },
});

export const {
    setCredentials,
    logOut,
    setAuthLoading,
    setAuthError,
    resetAuthStatus,
} = authSlice.actions;

export default authSlice.reducer;

export const selectIsAuth = (state) => Boolean(state.auth.accessToken);
export const selectCurrentUser = (state) => state.auth.currentUser;
