import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => undefined,
});

function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggle: () => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        document.documentElement.classList.toggle("dark", next === "dark");
        document.documentElement.classList.toggle("light", next === "light");
        try {
          localStorage.setItem("dpi-theme", next);
        } catch {
        }
        setTheme(next);
      },
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
