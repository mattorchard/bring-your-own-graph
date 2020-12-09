import { useEffect, useState } from "react";

const getWindowSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight
});

export const useWindowSize = () => {
  const [size, setSize] = useState(getWindowSize);

  useEffect(() => {
    const handler = () => setSize(getWindowSize());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return size;
};
