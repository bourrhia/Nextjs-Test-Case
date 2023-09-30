import React from "react";
import { useRouter } from "next/router";

export const handleNavHome = async () => {
  const router = useRouter();
  // setIsNavHome(true);

  try {
    await router.push({
      pathname: "/",
    });
  } catch (error) {
    // Handle any errors that might occur during navigation
  } finally {
    // setIsNavHome(false);
  }
};

export default handleNavHome;
