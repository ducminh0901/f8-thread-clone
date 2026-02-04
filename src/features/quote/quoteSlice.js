import { createSlice } from "@reduxjs/toolkit";

const quoteSlice = createSlice({
    name: "quote",
    initialState: {
        isOpen: false,
        targetPost: null,
    },
    reducers: {
        openQuoteModal: (state, action) => {
            state.isOpen = true;
            state.targetPost = action.payload;
        },
        closeQuoteModal: (state) => {
            state.isOpen = false;
            state.targetPost = null;
        },
    },
});

export const { openQuoteModal, closeQuoteModal } = quoteSlice.actions;
export default quoteSlice.reducer;
