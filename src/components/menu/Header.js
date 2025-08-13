'use client';

import { forwardRef, useState } from 'react'; // Added import
import { Avatar, Box, Typography, Chip, Link, Autocomplete, TextField} from '@mui/material';
import { Info } from '@mui/icons-material';
import RestaurantInfoDialog from './RestaurantInfoDialog'; // Added import

// Wrapped with forwardRef and accepted ref as second argument
const Header = forwardRef(function Header({ restaurant, menuData }, ref) {
  const categories = menuData.map((category) => category.category);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);

  const handleOpenInfoDialog = () => setOpenInfoDialog(true);
  const handleCloseInfoDialog = () => setOpenInfoDialog(false);

  return (
    <Box
      component="header"
      ref={ref} // Passed the ref to the outermost DOM element
      sx={{
        width: '100%',
        textAlign: 'center',
        marginBottom: '2rem',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '200px',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: 'primary.main',
          backgroundImage: `url(${restaurant.coverUrl})`,
        }}
      />
      <Box
        sx={{
          marginTop: '-50px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Avatar
          src={restaurant.logoUrl}
          alt={`Logo de ${restaurant.name}`}
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            border: '4px solid white',
            backgroundColor: 'white',
            margin: 'auto',
          }}
        />
      </Box>
      <Box
        sx={{
          marginTop: '0.5rem',
          padding: '0 1rem',
        }}
      >
        <Typography variant="h1" sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
          {restaurant.name}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1rem', color: 'text.secondary' }}>
          {restaurant.description}
        </Typography>
        <Chip
          label={restaurant.isOpen ? 'Aberto' : 'Fechado'}
          color={restaurant.isOpen ? 'success' : 'error'}
          sx={{ marginTop: '1rem' }}
        />
        <Box sx={{ marginTop: '1rem' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {restaurant.address.street}, {restaurant.address.neighborhood}
          </Typography>
          <Link href="#" variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.5rem' }} onClick={handleOpenInfoDialog}>
            <Info sx={{ marginRight: '0.5rem' }} />
            Mais informações
          </Link>
        </Box>
        
      </Box>
      <RestaurantInfoDialog open={openInfoDialog} onClose={handleCloseInfoDialog} />
    </Box>
  );
}); // Export the wrapped component

export default Header; // Export the wrapped component

