import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  cartItems: []
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
   addToCart: (state, action) => {
  const exists = state.cartItems.find(
    (item) => String(item._id) === String(action.payload._id)
  );

  if (exists) {
    exists.quantity += 1;
  } else {
    state.cartItems.push({
      ...action.payload,
      _id: String(action.payload._id), // ✅ FORCE STRING
      quantity: 1,
    });
  }
},

  removeFromCart: (state, action) => {
  state.cartItems = state.cartItems.filter(
    (item) => String(item._id) !== String(action.payload)
  );
},
    clearCart: (state) => {
  state.cartItems = [];
},
    decreaseQuantity: (state, action) => {
  const item = state.cartItems.find(
    (p) => p._id === action.payload
  );

  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      // if quantity is 1 → remove item
      state.cartItems = state.cartItems.filter(
        (p) => p._id !== action.payload
      );
    }
  }
},
setCart: (state, action) => {
  state.cartItems = action.payload;
  console.log("Redux cart:", state.cartItems);
},
  }
});

export const { addToCart, removeFromCart, decreaseQuantity, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;