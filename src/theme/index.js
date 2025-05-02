import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#a1963a", // Fallback to green if CSS variable is not set
      light: "#cfce79",
      dark: "#6d6618",
    },
    secondary: {
      main: "#FF9800",
      light: "#FFB74D",
      dark: "#F57C00",
    },
    error: {
      main: "#FF5252",
    },
    background: {
      default: "#F5F5F5",
    },
  },
  typography: {
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      "@media (min-width:600px)": {
        fontSize: "4rem",
      },
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          '&[dir="rtl"]': {
            fontFamily: "Arial, sans-serif",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#388E3C",
          },
        },
        containedSecondary: {
          "&:hover": {
            backgroundColor: "#F57C00",
          },
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          direction: "ltr", // Keep button group direction consistent
        },
      },
    },
  },
});

export default theme;
