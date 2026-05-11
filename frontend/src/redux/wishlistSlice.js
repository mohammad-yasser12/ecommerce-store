import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
  },
  reducers: {
addToWishlist: (state, action) => {
  const id = String(action.payload._id);

  const exists = state.items.find(
    (item) => item._id === id
  );

  if (!exists) {
    state.items.push({
      ...action.payload,
      _id: id,
    });
  }
},

removeFromWishlist: (state, action) => {
  const id = String(action.payload);

  state.items = state.items.filter(
    (item) => item._id !== id
  );
},
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;