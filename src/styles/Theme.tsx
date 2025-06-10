import type { ThemeOptions } from "@mui/material"

export const appTheme = {
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
  typography: {
    fontFamily: 'Inter, Helvetica Neue, sans-serif',
    h2: {
      fontWeight: 'bold',
      color: 'grey',
      fontSize: '2.5rem',
      lineHeight: 0.9,
      paddingBottom: 16,
    },
    h5: {
      fontWeight: 'bold',
      color: 'lightgrey',
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      fontSize: '1rem',
      letterSpacing: '0.5px',
      lineHeight: 1.75,
      height: 48,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      color: 'grey',
      textAlign: 'center',
      width: '100%',
      display: 'block',
    },
  },
  shape: {
    borderRadius: 9,
  },
} as ThemeOptions
