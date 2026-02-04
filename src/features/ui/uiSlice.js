import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // Theme
    theme: localStorage.getItem("theme") || "light",

    //  Auth Dialog
    authDialog: {
        open: false,
        type: "default",
    },
};

export const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setTheme: (state, action) => {
            const theme = action.payload;
            state.theme = theme;

            const root = window.document.documentElement;
            root.classList.remove("light", "dark");

            if (theme === "system") {
                const systemTheme = window.matchMedia(
                    "(prefers-color-scheme: dark)",
                ).matches
                    ? "dark"
                    : "light";
                root.classList.add(systemTheme);
                localStorage.removeItem("theme");
            } else {
                root.classList.add(theme);
                localStorage.setItem("theme", theme);
            }
        },

        openAuthDialog: (state, action) => {
            state.authDialog.open = true;
            state.authDialog.type = action.payload.type || "default";
        },

        closeAuthDialog: (state) => {
            state.authDialog.open = false;
        },
    },
});

export const { setTheme, openAuthDialog, closeAuthDialog } = uiSlice.actions;

export default uiSlice.reducer;
