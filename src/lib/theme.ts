'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Pretendard',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    // 기본값 14 → 16 으로 올려 전체 텍스트 스케일 업
    fontSize: 16,
    h3: { fontSize: '2.4rem', fontWeight: 700, lineHeight: 1.3 },
    h4: { fontSize: '1.9rem', fontWeight: 700 },
    h5: { fontSize: '1.5rem', fontWeight: 700 },
    h6: { fontSize: '1.2rem', fontWeight: 600 },
    body1: { fontSize: '1rem', lineHeight: 1.7 },
    body2: { fontSize: '0.95rem', lineHeight: 1.6 },
    caption: { fontSize: '0.85rem' },
    button: { fontSize: '1rem', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '10px 24px',
        },
        sizeLarge: {
          fontSize: '1.05rem',
          padding: '13px 32px',
        },
        sizeSmall: {
          fontSize: '0.9rem',
          padding: '6px 16px',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'medium',
      },
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            fontSize: '1rem',
            padding: '14px 16px',
          },
          '& .MuiInputLabel-root': {
            fontSize: '1rem',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '0.9rem',
          height: 34,
          borderRadius: 8,
        },
        sizeSmall: {
          fontSize: '0.8rem',
          height: 26,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: '1.1rem',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          minHeight: 44,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
        },
      },
    },
  },
});

export default theme;
