import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { InitialState, Product } from "../../types/productsType";

const initialState: InitialState = {
  products: [],
  cart: [],
};

const productSlice = createSlice({
  name: "productsSlice",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setCart: (state, action: PayloadAction<Product>) => {
      state.cart = [...state.cart, action.payload];
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const { setProducts, setCart, clearCart } = productSlice.actions;
export default productSlice.reducer;
