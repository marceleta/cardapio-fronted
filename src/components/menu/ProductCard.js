'use client';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material'; // Removed Button
import { useTheme } from '@mui/material/styles'; // Added import
import { useState } from 'react'; // Added useState
import ProductDetailDialog from './ProductDetailDialog'; // Added import

export default function ProductCard({ item }) {
  const theme = useTheme(); // Added theme hook
  const [openProductDetailDialog, setOpenProductDetailDialog] = useState(false);

  const handleOpenProductDetailDialog = () => setOpenProductDetailDialog(true);
  const handleCloseProductDetailDialog = () => {
    console.log('handleCloseProductDetailDialog called');
    setOpenProductDetailDialog(false);
  };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', my: 2 }} onClick={handleOpenProductDetailDialog}> {/* Added onClick */}
      <Box sx={{
        position: 'relative',
        width: '100%',
        height: 200, // Default height for smaller screens
        [theme.breakpoints.up('md')]: { // Apply for medium and up screens
          paddingTop: '80%', // 1080 / 1350 = 0.8 = 80% aspect ratio
          height: 'auto', // Reset height when padding-top is applied
        },
      }}>
        <CardMedia
          component="img"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '8px 8px 0 0',
          }}
          image={item.imageUrl}
          alt={item.name}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}> {/* Added flex column */}
        <Typography component="h3" variant="h6" sx={{ fontWeight: 'bold' }}>
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ my: 1, flexGrow: 1 }}> {/* Added flexGrow */}
          {item.description}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ marginTop: 'auto' }}>
          R$ {item.price}
        </Typography>
      </CardContent>
      <ProductDetailDialog item={item} open={openProductDetailDialog} onClose={handleCloseProductDetailDialog} />
    </Card>
  );
}

