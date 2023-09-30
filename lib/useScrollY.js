import { useState, useEffect } from "react";

export function useScrollY() {
  const [scrollY, setScrollY] = useState(null);

  useEffect(() => {
    // function to run on scroll
    const updateScrollY = () => {
      setScrollY(window.pageYOffset);
    };
    window.addEventListener("scroll", updateScrollY); // add event listener
    return () => {
      window.removeEventListener("scroll", updateScrollY); // clean up
    };
  }, [scrollY]);

  return scrollY;
}
export default useScrollY;
