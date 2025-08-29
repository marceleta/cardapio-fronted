'use client';
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
    // Hierarquia tipográfica melhorada seguindo UI Standards
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      '@media (max-width:600px)': {
        fontSize: '2rem'
      }
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.2,
      '@media (max-width:600px)': {
        fontSize: '1.75rem'
      }
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.2
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.2
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.2
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.2
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    },
    // Aumentar fonte das variantes Typography usadas em listagens
    subtitle1: {
      fontSize: '1.3rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '1.2rem',
      fontWeight: 500,
    },
  },
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
      contrastText: '#ffffff'
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20'
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100'
    },
    error: {
      main: '#d32f2f',
      light: '#f44336',
      dark: '#c62828'
    },
    info: {
      main: '#0288d1',
      light: '#2196f3',
      dark: '#01579b'
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff'
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)'
    }
  },
  // Sistema de espaçamento baseado em 8px
  spacing: 8,
  shape: {
    borderRadius: 12
  },
  shadows: [
    'none',
    '0 2px 8px rgba(0,0,0,0.1)',
    '0 4px 16px rgba(0,0,0,0.1)',
    '0 6px 20px rgba(0,0,0,0.12)',
    '0 8px 24px rgba(0,0,0,0.15)',
    '0 12px 28px rgba(0,0,0,0.15)',
    '0 16px 32px rgba(0,0,0,0.15)',
    '0 20px 40px rgba(0,0,0,0.15)',
    '0 24px 48px rgba(0,0,0,0.15)',
    ...Array(16).fill('0 24px 48px rgba(0,0,0,0.15)')
  ],
  components: {
    // Configurações de botões com estados visuais claros
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '1rem',
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }
        },
        contained: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
          }
        }
      },
    },
    // Configurações de Paper com design consistente
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.08)'
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
        },
        elevation3: {
          boxShadow: '0 6px 20px rgba(0,0,0,0.12)'
        }
      },
    },
    // Cards com microinterações
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }
      }
    },
    // TextField com design consistente
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            fontSize: '1rem',
          },
          '& .MuiInputLabel-root': {
            fontSize: '1rem',
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(25, 118, 210, 0.5)'
            }
          }
        },
      },
    },
    // IconButton com estados visuais
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.1)'
          }
        }
      }
    },
    // Chip com design melhorado
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          fontWeight: 500,
          borderRadius: 8
        },
        filled: {
          '&.MuiChip-colorSuccess': {
            backgroundColor: '#2e7d32',
            color: '#ffffff'
          },
          '&.MuiChip-colorError': {
            backgroundColor: '#d32f2f',
            color: '#ffffff'
          }
        }
      },
    },
    // Container com responsividade melhorada
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 16,
          paddingRight: 16,
          '@media (min-width: 600px)': {
            paddingLeft: 24,
            paddingRight: 24
          }
        }
      }
    },
    // Skeleton com design consistente
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: 8
        },
        rectangular: {
          borderRadius: 12
        },
        circular: {
          borderRadius: '50%'
        }
      }
    },
    // Alert com design melhorado
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontSize: '1rem'
        }
      }
    },
    // Avatar com sombra sutil
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }
      }
    },
    // Aumentar fonte de todos os campos Select
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
        },
      },
    },
    // Aumentar fonte de todos os MenuItems
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
        },
      },
    },
    // Aumentar fonte de todos os FormControl labels
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            fontSize: '1rem',
          },
          '& .MuiSelect-select': {
            fontSize: '1rem',
          },
        },
      },
    },
    // Aumentar fonte de todas as tabelas e listagens
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
        },
        head: {
          fontSize: '1rem',
          fontWeight: 600,
        },
      },
    },
    // Aumentar fonte dos cabeçalhos de tabela
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontSize: '1rem',
            fontWeight: 600,
          },
        },
      },
    },
    // Aumentar fonte do corpo da tabela
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontSize: '1rem',
          },
        },
      },
    },
    // Aumentar fonte de listas
    MuiList: {
      styleOverrides: {
        root: {
          '& .MuiListItem-root': {
            fontSize: '1rem',
          },
          '& .MuiListItemText-primary': {
            fontSize: '1rem',
          },
          '& .MuiListItemText-secondary': {
            fontSize: '0.875rem',
          },
        },
      },
    },
    // Aumentar fonte de ListItem
    MuiListItem: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
        },
      },
    },
    // Aumentar fonte de ListItemText
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '1rem',
        },
        secondary: {
          fontSize: '0.875rem',
        },
      },
    },
    // Melhorar CardContent para listagens
    MuiCardContent: {
      styleOverrides: {
        root: {
          '&:last-child': {
            paddingBottom: 16
          }
        },
      },
    },
    // Configuração específica para Typography em listagens
    MuiTypography: {
      styleOverrides: {
        root: {
          // Aplicar fontes maiores quando dentro de tabelas ou cards
          '.MuiTableCell-root &': {
            '&.MuiTypography-subtitle1': {
              fontSize: '1rem',
              fontWeight: 'bold',
            },
            '&.MuiTypography-body2': {
              fontSize: '0.875rem',
            },
            '&.MuiTypography-body1': {
              fontSize: '1rem',
            },
          },
          '.MuiCardContent-root &': {
            '&.MuiTypography-subtitle1': {
              fontSize: '1rem',
              fontWeight: 'bold',
            },
            '&.MuiTypography-body2': {
              fontSize: '0.875rem',
            },
            '&.MuiTypography-body1': {
              fontSize: '1rem',
            },
          },
        },
      },
    },
  },
});

export default theme;
