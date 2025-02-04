import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Create a custom theme with breakpoints
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0, // Smallest screen (phone)
      sm: 600, // Mobile screen width
      md: 900, // Tablet screen width
      lg: 1200, // Large screens (laptop)
      xl: 1536, // Extra large screens
    },
  },
  palette: {
    primary: {
      main: "#1976d2", // Customize primary color
    },
    secondary: {
      main: "#dc004e", // Customize secondary color
    },
  },
});

// Render the app with the custom theme
ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
