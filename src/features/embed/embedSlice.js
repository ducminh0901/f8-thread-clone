import { createSlice } from "@reduxjs/toolkit";

const embedSlice = createSlice({
    name: "embed",
    initialState: {
        isOpen: false,
        targetPost: null,
    },
    reducers: {
        openEmbedModal: (state, action) => {
            state.isOpen = true;
            state.targetPost = action.payload;
        },
        closeEmbedModal: (state) => {
            state.isOpen = false;
            state.targetPost = null;
        },
    },
});

export const { openEmbedModal, closeEmbedModal } = embedSlice.actions;
export default embedSlice.reducer;
