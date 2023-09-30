import React, { useState } from "react";
import { useGetUserByEmailQuery } from "../../redux/features/api/apiSlice";

export async function getUserByEmail(email) {
  const {
    data: userByEmail,
    // isFetching: userFetching,
    //isLoading: userLoading,
    //  isSuccess: userSuccess,
    isError: userIsError,
    error: userError,
  } = useGetUserByEmailQuery(email);

  return userByEmail;
}
