'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Slide,
  Fade,
  Button,
  Avatar,
  CardMedia
} from '@mui/material';
import {
  Close as CloseIcon,
  Restaurant as RestaurantIcon,
  LocalOffer as OfferIcon,
  Celebration as CelebrationIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

const WelcomeBanner = ({ 
  restaurant,
  bannerData = null,
  show = true,
  onClose,
  autoHide = true,
  autoHideDelay = 8000
}) => {
  const [visible, setVisible] = useState(show);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (autoHide && autoHideDelay > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDelay]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) {
      // Delay callback to allow exit animation
      setTimeout(() => onClose(), 300);
    }
  };

  const handleProductClick = () => {
    if (bannerData?.productLink) {
      // Scroll para o produto específico ou abrir dialog
      const productElement = document.querySelector(`[data-product-id="${bannerData.productLink}"]`);
      if (productElement) {
        productElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      } else {
        // Se não encontrar o produto, scroll para o cardápio
        handleExploreMenu();
      }
    } else {
      handleExploreMenu();
    }
    handleClose();
  };

  const handleExploreMenu = () => {
    // Scroll suavemente para a seção do menu
    const categorySection = document.querySelector('[data-section="categories"]');
    if (categorySection) {
      categorySection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (!mounted || !show) return null;

  // Renderizar banner com imagem se bannerData estiver disponível
  if (bannerData?.image) {
    return (
      <Slide direction="down" in={visible} timeout={500}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1300,
            p: 2,
            pt: 3
          }}
        >
          <Fade in={visible} timeout={800}>
            <Paper
              elevation={8}
              sx={{
                maxWidth: 800,
                mx: 'auto',
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
                cursor: bannerData.productLink ? 'pointer' : 'default'
              }}
              onClick={bannerData.productLink ? handleProductClick : undefined}
            >
              {/* Botão de fechar */}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                aria-label="Fechar banner"
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  color: 'white',
                  zIndex: 2,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>

              {/* Imagem do banner */}
              <CardMedia
                component="img"
                height="300"
                image={bannerData.image}
                alt={bannerData.title || 'Banner promocional'}
                sx={{
                  objectFit: 'cover',
                  width: '100%'
                }}
              />

              {/* Overlay com informações se necessário */}
              {(bannerData.title || bannerData.description || bannerData.productLink) && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    color: 'white',
                    p: 3
                  }}
                >
                  {bannerData.title && (
                    <Typography 
                      variant="h5" 
                      component="h1"
                      sx={{ 
                        fontWeight: 600,
                        mb: 1,
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                      }}
                    >
                      {bannerData.title}
                    </Typography>
                  )}
                  
                  {bannerData.description && (
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        opacity: 0.9,
                        mb: bannerData.productLink ? 2 : 0,
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                      }}
                    >
                      {bannerData.description}
                    </Typography>
                  )}

                  {bannerData.productLink && (
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick();
                      }}
                      startIcon={<ViewIcon />}
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Ver Produto
                    </Button>
                  )}
                </Box>
              )}
            </Paper>
          </Fade>
        </Box>
      </Slide>
    );
  }

  return (
    <Slide direction="down" in={visible} timeout={500}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1300,
          p: 2,
          pt: 3
        }}
      >
        <Fade in={visible} timeout={800}>
          <Paper
            elevation={8}
            sx={{
              maxWidth: 600,
              mx: 'auto',
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              color: 'white',
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }
            }}
          >
            {/* Botão de fechar */}
            <IconButton
              onClick={handleClose}
              aria-label="Fechar banner"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: 'white',
                zIndex: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <CloseIcon />
            </IconButton>

            <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
              {/* Header com ícone de celebração */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  mb: 2 
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    width: 56,
                    height: 56
                  }}
                >
                  <CelebrationIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography 
                    variant="h5" 
                    component="h1"
                    sx={{ 
                      fontWeight: 600,
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}
                  >
                    Bem-vindo ao {restaurant?.name || 'nosso restaurante'}! 🎉
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      opacity: 0.9,
                      fontWeight: 300
                    }}
                  >
                    Descubra sabores únicos e experiências gastronômicas incríveis
                  </Typography>
                </Box>
              </Box>

              {/* Ofertas especiais */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  mb: 3,
                  p: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 2,
                  backdropFilter: 'blur(5px)'
                }}
              >
                <OfferIcon sx={{ color: '#ffc107' }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  🍕 Promoção especial: 20% de desconto em pizzas hoje!
                </Typography>
              </Box>

              {/* Botões de ação */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'center'
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleExploreMenu}
                  startIcon={<RestaurantIcon />}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    flex: { xs: '1', sm: 'auto' },
                    minWidth: { xs: '100%', sm: 180 },
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Explorar Cardápio
                </Button>

                <Button
                  variant="text"
                  onClick={handleClose}
                  sx={{
                    color: 'white',
                    fontWeight: 500,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Continuar navegando
                </Button>
              </Box>
            </Box>

            {/* Decoração de fundo */}
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                pointerEvents: 'none'
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                pointerEvents: 'none'
              }}
            />
          </Paper>
        </Fade>
      </Box>
    </Slide>
  );
};

export default WelcomeBanner;
