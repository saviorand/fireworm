"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps): JSX.Element {
  // @ts-ignore
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
