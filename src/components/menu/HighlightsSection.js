'use client';

import { useRef, useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardMedia, 
  CardContent, 
  IconButton,
  Container,
  Fade,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  ArrowBackIos, 
  ArrowForwardIos,
  LocalOffer as OfferIcon 
} from '@mui/icons-material';
import ProductDetailDialog from './ProductDetailDialog';

export default function HighlightsSection({ title, items }) {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [openProductDetailDialog, setOpenProductDetailDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpenProductDetailDialog = (item) => {
    setSelectedProduct(item);
    setOpenProductDetailDialog(true);
  };

  const handleCloseProductDetailDialog = () => {
    setSelectedProduct(null);
    setOpenProductDetailDialog(false);
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const cardWidth = isMobile ? 280 : 320;
      const gap = 16;
      const scrollAmount = cardWidth + gap;
      scrollRef.current.scrollBy({ 
        left: direction * scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, [items]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Box component="section" sx={{ position: 'relative', overflow: 'hidden' }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Título da seção com melhor hierarquia visual */}
        <Fade in={true} timeout={600}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 3 
            }}
          >
            <OfferIcon 
              sx={{ 
                fontSize: { xs: '1.5rem', md: '2rem' },
                color: 'primary.main' 
              }} 
            />
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                fontWeight: 600,
                color: 'text.primary',
                lineHeight: 1.2
              }}
            >
              {title}
            </Typography>
          </Box>
        </Fade>
      </Container>

      {/* Container de scroll horizontal */}
      <Box sx={{ position: 'relative' }}>
        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            pl: { xs: 2, sm: 3 },
            pr: { xs: 2, sm: 3 },
            pb: 1 // Para sombra dos cards
          }}
        >
          {items.map((item, index) => (
            <Fade 
              key={item.id} 
              in={true} 
              timeout={600}
              style={{ 
                transitionDelay: `${index * 100}ms` 
              }}
            >
              <Card 
                onClick={() => handleOpenProductDetailDialog(item)}
                sx={{ 
                  minWidth: { xs: 280, sm: 320 },
                  maxWidth: { xs: 280, sm: 320 },
                  flex: '0 0 auto',
                  scrollSnapAlign: 'start',
                  mr: 2,
                  cursor: 'pointer',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  },
                  '&:active': {
                    transform: 'translateY(-2px)',
                    transition: 'all 0.1s ease'
                  }
                }}
              >
                {/* Imagem do produto com overlay de preço */}
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height={isMobile ? 240 : 280}
                    image={item.imageUrl}
                    alt={item.name}
                    sx={{
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                  
                  {/* Badge de preço */}
                  <Paper
                    elevation={3}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText'
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontSize: { xs: '1.1rem', sm: '1.2rem' },
                        fontWeight: 600,
                        lineHeight: 1
                      }}
                    >
                      R$ {item.price}
                    </Typography>
                  </Paper>
                </Box>

                {/* Conteúdo do card */}
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography 
                    variant="h5" 
                    component="h3"
                    sx={{ 
                      fontSize: { xs: '1.2rem', sm: '1.3rem' },
                      fontWeight: 600,
                      mb: 1,
                      color: 'text.primary',
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {item.name}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          ))}
        </Box>

        {/* Setas de navegação - apenas em desktop */}
        {!isMobile && showLeftArrow && (
          <Fade in={showLeftArrow} timeout={300}>
            <IconButton
              onClick={() => scroll(-1)}
              aria-label="Anterior"
              sx={{ 
                position: 'absolute', 
                left: { sm: 8, md: 16 }, 
                top: '50%', 
                transform: 'translateY(-50%)', 
                zIndex: 2, 
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                width: 48,
                height: 48,
                boxShadow: 4,
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  transform: 'translateY(-50%) scale(1.1)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowBackIos sx={{ fontSize: '1.2rem' }} />
            </IconButton>
          </Fade>
        )}
        
        {!isMobile && showRightArrow && (
          <Fade in={showRightArrow} timeout={300}>
            <IconButton
              onClick={() => scroll(1)}
              aria-label="Próximo"
              sx={{ 
                position: 'absolute', 
                right: { sm: 8, md: 16 }, 
                top: '50%', 
                transform: 'translateY(-50%)', 
                zIndex: 2, 
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                width: 48,
                height: 48,
                boxShadow: 4,
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  transform: 'translateY(-50%) scale(1.1)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowForwardIos sx={{ fontSize: '1.2rem' }} />
            </IconButton>
          </Fade>
        )}
      </Box>

      {/* Dialog de detalhes do produto */}
      {selectedProduct && (
        <ProductDetailDialog
          item={selectedProduct}
          open={openProductDetailDialog}
          onClose={handleCloseProductDetailDialog}
        />
      )}
    </Box>
  );
}