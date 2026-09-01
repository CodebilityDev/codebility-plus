'use client';

import { createTheme } from '@mui/material/styles';
import { stepConnectorClasses } from '@mui/material/StepConnector';
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"] });

const theme = createTheme({
  typography: {
    fontFamily: outfit.style.fontFamily,
  },
  components: {
    // Custom Stepper connector color
    MuiStepConnector: {
      styleOverrides: {
        alternativeLabel: {
          top: 10,
        },
        line: {
          height: 3,
          border: 0,
          borderRadius: 1,
          backgroundColor: '#ccc',
        },
        root: {
          [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
            backgroundColor: '#784af4',
          },
          [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
            backgroundColor: '#784af4',
          },
        },
      },
    },
  },
});

export default theme;
