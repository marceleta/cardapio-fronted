'use client';

import { useRef, useState, useEffect } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery'; // Added import
import { useTheme } from '@mui/material/styles'; // Added import
import ProductDetailDialog from './ProductDetailDialog'; // Added import

export default function HighlightsSection({ title, items }) {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const theme = useTheme(); // Added theme hook
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect mobile screens

  const [openProductDetailDialog, setOpenProductDetailDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
      const cardWidth = 220; // minWidth of Card
      const gap = 24; // 1.5rem = 24px
      const scrollAmount = cardWidth + gap;
      scrollRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
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

  return (
    <Box component="section" sx={{ marginBottom: '2rem', position: 'relative' }}>
      <Typography
        variant="h2"
        sx={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          paddingLeft: '1rem',
        }}
      >
        {title}
      </Typography>
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          paddingLeft: '1rem', // Changed padding to paddingLeft
          paddingRight: '1rem', // Added paddingRight
          scrollSnapType: 'x mandatory', // Added scroll-snap-type
          scrollbarWidth: 'none', // for Firefox
          '&::-webkit-scrollbar': {
            display: 'none', // for Chrome, Safari, and Opera
          },
        }}
      >
        {items.map((item) => (
          <Card key={item.id} sx={{ minWidth: 220, flex: '0 0 auto', scrollSnapAlign: 'start', marginRight: '1.5rem' }} onClick={() => handleOpenProductDetailDialog(item)}> {/* Added onClick */}
            <CardMedia
              component="img"
              height="280"
              image={item.imageUrl}
              alt={item.name}
            />
            <CardContent>
              <Typography variant="h5" component="div" sx={{ fontSize: '1.5rem', fontWeight: 'bold', whiteSpace: 'normal', overflow: 'visible', wordBreak: 'break-word' }}>
                {item.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem', whiteSpace: 'normal', overflow: 'visible', wordBreak: 'break-word' }}>
                {item.description}
              </Typography>
              <Typography variant="h6" sx={{ marginTop: '1rem', fontSize: '1.4rem', fontWeight: 'bold' }}>
                R$ {item.price}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
      {showLeftArrow && (
        <IconButton
          onClick={() => scroll(-1)}
          sx={{ 
            position: 'absolute', 
            left: 10, 
            top: '50%', 
            transform: 'translateY(-50%)', 
            zIndex: 2, 
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#115293'
            }
          }}
        >
          <ArrowBackIos sx={{ color: 'white' }} />
        </IconButton>
      )}
      {showRightArrow && (
        <IconButton
          onClick={() => scroll(1)}
          sx={{ 
            position: 'absolute', 
            right: 10, 
            top: '50%', 
            transform: 'translateY(-50%)', 
            zIndex: 2, 
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#115293'
            }
          }}
        >
          <ArrowForwardIos sx={{ color: 'white' }} />
        </IconButton>
      )}
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