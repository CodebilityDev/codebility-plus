"use client";

import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import theme from "@/constants/dashboard/theme";

export function MuiStyleRoot({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
