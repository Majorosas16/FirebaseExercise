import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { InitialState, Product, ProductWithDocId } from "../../types/productsType";

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
    deleteCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(
        (item) => (item as ProductWithDocId).docId !== action.payload
      );
    },
  },
});

export const { setProducts, setCart, clearCart, deleteCart } =
  productSlice.actions;
export default productSlice.reducer;
