import React from "react";
import { useRouter } from "next/router";

export const HandleNavHome = async () => {
  const router = useRouter();

  try {
    await router.push({
      pathname: "/",
    });
  } catch (error) {
    // Handle any errors that might occur during navigation
  } finally {
  }
};

export default HandleNavHome;
