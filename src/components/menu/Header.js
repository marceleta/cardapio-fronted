'use client';

import { forwardRef, useState } from 'react';
import { 
  Avatar, 
  Box, 
  Typography, 
  Chip, 
  Link, 
  Paper,
  Container,
  Fade,
  Grow
} from '@mui/material';
import { 
  Info as InfoIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon
} from '@mui/icons-material';
import RestaurantInfoDialog from './RestaurantInfoDialog';

// Header com forwardRef e seguindo padrões de UI
const Header = forwardRef(function Header({ restaurant, menuData }, ref) {
  const categories = menuData.map((category) => category.category);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);

  const handleOpenInfoDialog = () => setOpenInfoDialog(true);
  const handleCloseInfoDialog = () => setOpenInfoDialog(false);

  return (
    <Box
      component="header"
      ref={ref}
      sx={{
        width: '100%',
        position: 'relative',
        mb: { xs: 3, md: 4 },
        pt: { xs: 8, sm: 9 } // Padding top para evitar sobreposição do StickyHeader
      }}
    >
      {/* Imagem de capa com overlay gradiente */}
      <Box
        sx={{
          width: '100%',
          height: { xs: 180, sm: 220, md: 280 },
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: 'primary.main',
          backgroundImage: restaurant.coverUrl 
            ? `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url(${restaurant.coverUrl})`
            : 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          position: 'relative',
          borderRadius: { xs: 0, sm: '0 0 16px 16px' },
          overflow: 'hidden'
        }}
      >
        {/* Decorative overlay para melhor contraste */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)'
          }}
        />
      </Box>

      {/* Container principal com informações do restaurante */}
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Avatar do restaurante com animação */}
        <Grow in={true} timeout={800}>
          <Box
            sx={{
              mt: { xs: -6, sm: -7, md: -8 },
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              justifyContent: 'center',
              mb: 2
            }}
          >
            <Avatar
              src={restaurant.logoUrl}
              alt={`Logo de ${restaurant.name}`}
              sx={{
                width: { xs: 90, sm: 110, md: 130 },
                height: { xs: 90, sm: 110, md: 130 },
                borderRadius: '50%',
                border: '4px solid white',
                backgroundColor: 'white',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.2)'
                }
              }}
            />
          </Box>
        </Grow>

        {/* Informações principais com layout centrado */}
        <Fade in={true} timeout={1000} style={{ transitionDelay: '200ms' }}>
          <Box sx={{ textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
            {/* Nome do restaurante */}
            <Typography 
              variant="h1" 
              component="h1"
              sx={{ 
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                fontWeight: 600,
                mb: 1,
                color: 'text.primary',
                lineHeight: 1.2
              }}
            >
              {restaurant.name}
            </Typography>

            {/* Descrição */}
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.1rem' },
                color: 'text.secondary',
                mb: 2,
                lineHeight: 1.5,
                maxWidth: 500,
                mx: 'auto'
              }}
            >
              {restaurant.description}
            </Typography>

            {/* Status de funcionamento com design melhorado */}
            <Box sx={{ mb: 3 }}>
              <Chip
                icon={<ScheduleIcon sx={{ fontSize: '1rem' }} />}
                label={restaurant.isOpen ? '🟢 Aberto agora' : '🔴 Fechado'}
                color={restaurant.isOpen ? 'success' : 'error'}
                variant={restaurant.isOpen ? 'filled' : 'outlined'}
                sx={{ 
                  fontSize: '1rem',
                  fontWeight: 500,
                  px: 1,
                  height: 36,
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
            </Box>

            {/* Card com informações de contato */}
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {/* Endereço */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: 1,
                  mb: 2
                }}
              >
                <LocationIcon color="primary" sx={{ fontSize: '1.2rem' }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: '1rem'
                  }}
                >
                  {restaurant.address.street}, {restaurant.address.neighborhood}
                </Typography>
              </Box>

              {/* Link para mais informações */}
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Link 
                  component="button"
                  variant="body2" 
                  onClick={handleOpenInfoDialog}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    fontSize: '1rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'primary.main',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    p: 1,
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  <InfoIcon sx={{ fontSize: '1.1rem' }} />
                  Mais informações
                </Link>
              </Box>
            </Paper>
          </Box>
        </Fade>
      </Container>

      {/* Dialog de informações do restaurante */}
      <RestaurantInfoDialog 
        open={openInfoDialog} 
        onClose={handleCloseInfoDialog} 
      />
    </Box>
  );
});

export default Header; // Export the wrapped component

