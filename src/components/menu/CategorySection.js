'use client';
import { useState } from 'react'; // Added import
import ProductCard from './ProductCard';
import { Box, Typography } from '@mui/material';
import ProductDetailDialog from './ProductDetailDialog'; // Added import

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

  return (
    <Box component="section" sx={{ marginBottom: '1rem' }}>
      <Typography
        variant="h2"
        id={category.category.replace(/\s+/g, '-').toLowerCase()} // Add ID here
        sx={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          borderLeft: '4px solid',
          borderColor: 'primary.main',
          paddingLeft: '0.5rem',
        }}
      >
        {category.category}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
        }}
      >
        {category.items.map((item) => (
          <ProductCard key={item.id} item={item} onClick={() => handleOpenProductDetailDialog(item)} />
        ))}
      </Box>
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
