import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: { 
        main: '#E4D2C1', //beje marfin
        light: '#F0E3D6', 
        dark: '#C2B09D',  
        contrastText: '#000000',
      },
      secondary: {
        main: '#ac0a0b', //laranja #D69456 '#ac0a0b' #CF0E0E #f45449
        light: '#e34949', 
        dark: '#7b0708', 
        contrastText: '#ffffff',
      },
    text: {
      primary: 'rgba(205,106,0,0.87)',
      secondary: 'rgba(205,135,2,0.54)',
      disabled: 'rgba(205,135,2,0.38)',
    },
    background: {
      default: '#FFF3E0',
      paper: '#FFECB3',
    },
  },
  typography: {
    fontFamily: 'lato, sans-serif',
  },
  
}
);