import { useEffect, useState } from "react";

function getViewport() {
  if (typeof window === "undefined") {
    return {
      width: 0,
      isMobile: false,
      isTablet: false,
      isDesktop: false,
    };
  }

  const width = window.innerWidth;
  return {
    width,
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
  };
}

export function useViewport() {
  const [viewport, setViewport] = useState(getViewport());

  useEffect(() => {
    function handleResize() {
      setViewport(getViewport());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return viewport;
}

