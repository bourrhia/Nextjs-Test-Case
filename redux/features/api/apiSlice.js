import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { HYDRATE } from "next-redux-wrapper";

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: "api",
  // All of our requests will have URLs starting with '/api'
  //baseQuery: fetchBaseQuery({ baseUrl: process.env.VERCEL_URL }),
  baseQuery: fetchBaseQuery({
    baseUrl: "https://nextjs-test-case.vercel.app",
  }),
  tagTypes: ["User", "Orders"],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    // Add
    getUserAdr: builder.query({
      // note: an optional `queryFn` may be used in place of `query`
      query: (userId) => ({ url: `/api/cartUserAdr/${userId}` }),

      providesTags: ["User"],
    }),
    editUserAdrLiv: builder.mutation({
      query: (adresseLiv) => ({
        url: "/api/cartUserAdr/adrLivCrud",
        method: "PATCH",
        body: adresseLiv,
      }),
      invalidatesTags: ["User"],
    }),

    editUserAdrFact: builder.mutation({
      query: (adresseFact) => ({
        url: "/api/cartUserAdr/adrFactCrud",
        method: "PATCH",
        body: adresseFact,
      }),
      invalidatesTags: ["User"],
    }),

    getOrderById: builder.query({
      query: (orderPkey) => ({ url: `/api/orders/${orderPkey}` }),
      providesTags: ["Orders"],
    }),

    addOrders: builder.mutation({
      query: (orders) => ({
        url: "/api/orders/ordersCrud",
        method: "POST",
        body: orders,
      }),
      invalidatesTags: ["Orders"],
    }),
    updUser: builder.mutation({
      query: (userInfo) => ({
        url: "/api/auth/updateUser",
        method: "POST",
        body: userInfo,
      }),
    }),
    getUserByEmail: builder.query({
      query: (email) => ({
        url: `/api/auth/userByEmail/${email}`,
        method: "GET",
      }),
    }),
    addUserSignUp: builder.mutation({
      query: (userSignUp) => ({
        url: "/api/auth/signup",
        method: "POST",
        body: userSignUp,
      }),
    }),
    editVerifEmail: builder.mutation({
      query: ({ emailToken }) => ({
        url: `/api/auth/verify/${emailToken}`,
        method: "POST",
      }),
    }),
    resendEmailVerif: builder.mutation({
      query: (email) => ({
        url: "/api/auth/resend-verification",
        method: "POST",
        body: email,
      }),
    }),
    generateResetCode: builder.mutation({
      query: ({ email }) => ({
        url: `/api/auth/generate-reset-code/${email}`,
        method: "POST",
      }),
    }),
    resetPswd: builder.mutation({
      query: (emailresetCode) => ({
        url: "/api/auth/reset-password",
        method: "POST",
        body: emailresetCode,
      }),
      invalidatesTags: ["User"],
    }),
    verifyResetCode: builder.mutation({
      query: (resetCodeData) => ({
        url: "/api/auth/verifyResetCode",
        method: "POST",
        body: resetCodeData,
      }),
    }),
    getUserEmail: builder.mutation({
      query: ({ email }) => ({
        url: `/api/auth/userByEmail/${email}`,
        method: "POST",
      }),
    }),
    addPortTel: builder.mutation({
      query: (portTelData) => ({
        url: "/api/auth/addPhoneNumber",
        method: "POST",

        body: portTelData,
      }),
    }),
    getAllProducts: builder.query({
      query: () => ({ url: "/api/fuzzySearch/getProducts" }),
      method: "GET",
    }),
    getProductsBySearch: builder.query({
      query: (searchTerm) => ({
        url: `/api/fuzzySearch/search?query=${searchTerm}`,
      }),
      method: "GET",
    }),
    addUserId: builder.mutation({
      query: () => ({
        url: "/api/generateUserId",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useEditUserAdrLivMutation,
  useEditUserAdrFactMutation,
  useGetUserAdrQuery,
  useAddOrdersMutation,
  useGetOrderByIdQuery,
  useUpdUserMutation,
  useGetUserByEmailQuery,
  useAddUserSignUpMutation,
  useEditVerifEmailMutation,
  useResendEmailVerifMutation,
  useGenerateResetCodeMutation,
  useResetPswdMutation,
  useVerifyResetCodeMutation,
  useGetUserEmailMutation,
  useAddPortTelMutation,
  useGetAllProductsQuery,
  useGetProductsBySearchQuery,
  useAddUserIdMutation,
} = apiSlice;
