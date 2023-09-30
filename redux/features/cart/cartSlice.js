import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCartSpinner } from "./cartSpinnerApi";
import { fetchCartDropdown } from "./cartDropdownApi";

import { PURGE } from "redux-persist";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  products: [],
};

export const cartSpinnerAsync = createAsyncThunk(
  "cart/fetchCartSpinner",
  async (initialPost) => {
    const response = await fetchCartSpinner(initialPost);

    return response.data;
  }
);

export const cartDropdownAsync = createAsyncThunk(
  "cart/fetchCartDropdown",
  async (initialPost, { dispatch }) => {
    const response = await fetchCartDropdown(initialPost);

    dispatch(productUpdated(initialPost));
    return response.data;
  }
);

const cartSlice = createSlice({
  name: "cart",
  //initialState: [],
  initialState,
  reducers: {
    productAdded(state, action) {
      const productExists = state.products.find(
        (item) => item.prodId === parseInt(action.payload.prodId)
      );

      if (productExists) {
        productExists.prodQtee = action.payload.prodQtee;
      } else {
        state.products.push(action.payload);
      }
    },
    productUpdated(state, action) {
      const { prodId, prodQuantity } = action.payload;

      const existingProduct = state.products.find(
        (product) => product.prodId === parseInt(prodId)
      );

      if (existingProduct) {
        existingProduct.prodQtee = action.payload.prodQuantity;
      }
    },

    productRemoved: (state, action) => {
      const index = state.products.findIndex(
        (product) => product.prodId === parseInt(action.payload.prodId)
      );
      state.products.splice(index, 1);
    },
    //////////
    allProductRemoved: (state) => {
      return {
        ...state,
        products: [],
      };
    },
    ////////////////////
  },
  extraReducers: (builder) => {
    builder
      .addCase(cartSpinnerAsync.pending, (state, { meta }) => {
        let index = state.products
          ? state.products.map((item) => item.prodId).indexOf(meta.arg.prodId)
          : -1;
        if (index !== -1) {
          state.products[index].status = "loading";
        }
      })
      .addCase(cartSpinnerAsync.fulfilled, (state, action) => {
        let idProductAction = action.payload.prodId;
        var index = state.products
          ? state.products.map((item) => item.prodId).indexOf(idProductAction)
          : -1;
        if (index !== -1) {
          state.products[index].status = "idle";
          state.products[index].prodQtee = action.payload.prodQuantity;
        }
      })
      .addCase(cartDropdownAsync.fulfilled, (state, action) => {})
      .addCase(PURGE, (state) => {
        customEntityAdapter.removeAll(state);
      });
  },
});

export const {
  productAdded,
  productUpdated,
  incrementProductQte,
  decrementProductQte,
  productRemoved,
  allProductRemoved,
} = cartSlice.actions;

export default cartSlice.reducer;
