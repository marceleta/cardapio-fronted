'use client';
import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Fade,
  Divider
} from '@mui/material';
import { 
  Restaurant as RestaurantIcon 
} from '@mui/icons-material';
import ProductCard from './ProductCard';
import ProductDetailDialog from './ProductDetailDialog';

export default function CategorySection({ category }) {
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

  if (!category?.items || category.items.length === 0) {
    return null;
  }

  return (
    <Box component="section" sx={{ mb: { xs: 4, md: 5 } }}>
      {/* Cabeçalho da categoria com design melhorado */}
      <Fade in={true} timeout={600}>
        <Box sx={{ mb: 3 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 2 
            }}
          >
            <RestaurantIcon 
              sx={{ 
                fontSize: { xs: '1.3rem', md: '1.5rem' },
                color: 'primary.main' 
              }} 
            />
            <Typography
              variant="h2"
              component="h2"
              id={category.category.replace(/\s+/g, '-').toLowerCase()}
              sx={{
                fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.8rem' },
                fontWeight: 600,
                color: 'text.primary',
                lineHeight: 1.2,
                flex: 1
              }}
            >
              {category.category}
            </Typography>
          </Box>
          
          {/* Linha decorativa */}
          <Divider 
            sx={{ 
              borderColor: 'primary.main',
              borderWidth: '2px',
              width: { xs: 60, md: 80 },
              mb: 1
            }} 
          />
          
          {/* Contador de itens */}
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.9rem'
            }}
          >
            {category.items.length} {category.items.length === 1 ? 'item' : 'itens'}
          </Typography>
        </Box>
      </Fade>

      {/* Grid responsivo de produtos com CSS Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr', // 1 coluna no mobile
            sm: 'repeat(2, 1fr)', // 2 colunas no tablet
            lg: 'repeat(3, 1fr)' // 3 colunas no desktop
          },
          gap: { xs: 2, sm: 2, md: 3 },
          // Garante que todos os cards tenham a mesma altura em cada linha
          gridAutoRows: 'minmax(auto, 1fr)'
        }}
      >
        {category.items.map((item, index) => (
          <Fade 
            key={item.id}
            in={true} 
            timeout={600}
            style={{ 
              transitionDelay: `${index * 100}ms`,
              width: '100%',
              height: '100%'
            }}
          >
            <Box sx={{ width: '100%', height: '100%' }}>
              <ProductCard 
                item={item} 
                onClick={() => handleOpenProductDetailDialog(item)}
              />
            </Box>
          </Fade>
        ))}
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
