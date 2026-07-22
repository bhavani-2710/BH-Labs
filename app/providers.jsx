"use client";
import { ThemeProvider } from "@/context/ThemeContext";
import { DataProvider } from "@/context/DataProvider";

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <DataProvider>{children}</DataProvider>
    </ThemeProvider>
  );
}
