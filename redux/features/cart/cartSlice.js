import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
<<<<<<< HEAD
import { fetchCartSpinner } from "./cartSpinnerAPI";
import { fetchCartDropdown } from "./cartDropdownAPI";
=======
//import { fetchCartSpinner } from "./cartSpinnerAPI";
//import { fetchCartDropdown } from "./cartDropdownAPI";
>>>>>>> 4465f2d017ef6aeea8e7c621b51747a7452b6bed
//
import { PURGE } from "redux-persist";
import { HYDRATE } from "next-redux-wrapper";

//import { current } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  // status: "idle",
  // error: null,
};

<<<<<<< HEAD
export const cartSpinnerAsync = createAsyncThunk(
=======
/*export const cartSpinnerAsync = createAsyncThunk(
>>>>>>> 4465f2d017ef6aeea8e7c621b51747a7452b6bed
  "cart/fetchCartSpinner",
  async (initialPost) => {
    const response = await fetchCartSpinner(initialPost);

    return response.data;
  }
<<<<<<< HEAD
);

export const cartDropdownAsync = createAsyncThunk(
=======
);*/

/*export const cartDropdownAsync = createAsyncThunk(
>>>>>>> 4465f2d017ef6aeea8e7c621b51747a7452b6bed
  "cart/fetchCartDropdown",
  async (initialPost, { dispatch }) => {
    const response = await fetchCartDropdown(initialPost);
    // The value we return becomes the `fulfilled` action payload
    // dispatch(productUpdated(initialPost));

    dispatch(productUpdated(initialPost));
    return response.data;
  }
<<<<<<< HEAD
);
=======
);*/
>>>>>>> 4465f2d017ef6aeea8e7c621b51747a7452b6bed

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
<<<<<<< HEAD
  extraReducers: (builder) => {
=======
  /*extraReducers: (builder) => {
>>>>>>> 4465f2d017ef6aeea8e7c621b51747a7452b6bed
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
      .addCase(cartDropdownAsync.fulfilled, (state, action) => {
        // state.status = "testidle";
      })
      .addCase(PURGE, (state) => {
        customEntityAdapter.removeAll(state);
      });
<<<<<<< HEAD
    /*.addCase(HYDRATE, (state, action) => {
        return {
          ...state,
          ...action.payload.cart,
        };
      });*/
  },
=======
    
  },*/
>>>>>>> 4465f2d017ef6aeea8e7c621b51747a7452b6bed
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
