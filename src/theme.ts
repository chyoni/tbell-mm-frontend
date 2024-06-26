import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const breakpoints = {
  base: "0px",
  sm: "320px",
  md: "768px",
  lg: "960px",
  xl: "1200px",
  "2xl": "1536px",
  "3xl": "1800px",
};

export const primaryColor = "#0ED3AC";
export const titleColor = "#9F7AEA";

const theme = extendTheme({ config, breakpoints });

export default theme;
