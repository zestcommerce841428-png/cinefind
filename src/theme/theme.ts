import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#0d6efd" },
        secondary: { main: "#f5c518" },
        background: { default: "#f7f8fa", paper: "#ffffff" },
      },
    },
    dark: {
      palette: {
        primary: { main: "#4da3ff" },
        secondary: { main: "#f5c518" },
        background: { default: "#0b0e14", paper: "#12161f" },
      },
    },
  },
  cssVariables: { colorSchemeSelector: "class" },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "var(--font-inter), Roboto, Arial, sans-serif",
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: { root: { borderRadius: 999 } },
    },
    MuiCard: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiAppBar: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
  },
});
