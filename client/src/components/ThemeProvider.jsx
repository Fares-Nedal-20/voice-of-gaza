import React from "react";
import { useSelector } from "react-redux";

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:text-slate-200 dark:bg-[rgb(20, 20, 20)] min-h-screen">
        {children}
      </div>
    </div>
  );
}
