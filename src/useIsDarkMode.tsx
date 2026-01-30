import { useEffect, useState } from "react";

export function useIsDarkMode(): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
] {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    return false;
  });

  useEffect(() => {
    function handleChangeColorScheme(event: MediaQueryListEvent) {
      setIsDarkMode(event.matches);
    }
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    mediaQuery.addEventListener("change", handleChangeColorScheme);

    return () => {
      mediaQuery.removeEventListener("change", handleChangeColorScheme);
    };
  }, []);

  return [isDarkMode, setIsDarkMode];
}
