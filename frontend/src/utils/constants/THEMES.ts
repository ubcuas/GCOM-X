import { createTheme } from '@mui/material/styles';
require('typeface-source-sans-pro');

// Module Augmentation [BEGIN]
// See details under TypeScript in https://mui.com/customization/theming/
declare module '@mui/material/styles' {
    export interface Theme {
        background: {
            default: string;
        };
    }
    export interface ThemeOptions {
        background?: {
            default?: string;
        };
    }
}
// Module Augmentation [END]


const CLOUD_THEME = createTheme({
    background: {
        default: "#f8f8f8"
    },
    palette: {
        // type: 'light',
        primary: {
            main: '#127fe0',
        },
        secondary: {
            main: '#f9c131',
        },
    },
    typography: {
        fontFamily: 'Source Sans Pro',
        fontWeightBold: 900,
        fontWeightMedium: 500,
        fontWeightRegular: 300,
    }
});

const BUMBLEBEE_THEME = createTheme({
    background: {
        default: "#131313"
    },
    palette: {
        mode: 'dark',
        primary: {
            main: '#ffef3b',
        },
        secondary: {
            main: '#31f973',
        },
    },
    typography: {
        fontFamily: 'Source Sans Pro',
        fontWeightBold: 900,
        fontWeightMedium: 500,
        fontWeightRegular: 300,
    }
});

export const THEMES = {
    'bumblebee': BUMBLEBEE_THEME,
    'cloud': CLOUD_THEME
};