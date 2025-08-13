'use client';

import { AppBar, Toolbar, Box, Typography, Autocomplete, TextField, Button, Avatar } from '@mui/material';
import { Home, ShoppingCart, Person, AdminPanelSettings } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import AccountDialog from '../account/AccountDialog';
import OrdersDialog from '../account/OrdersDialog';
import Link from 'next/link';

export default function StickyHeader({ restaurant, categories, show }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const [isOrdersDialogOpen, setIsOrdersDialogOpen] = useState(false);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  const handleOpenAccountDialog = () => {
    setIsAccountDialogOpen(true);
  };

  const handleCloseAccountDialog = () => {
    setIsAccountDialogOpen(false);
  };

  const handleOpenOrdersDialog = () => {
    setIsOrdersDialogOpen(true);
  };

  const handleCloseOrdersDialog = () => {
    setIsOrdersDialogOpen(false);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'white',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease-in-out',
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        zIndex: 1000,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', gap: '1rem', padding: '0 1rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Avatar src={restaurant.logoUrl} alt={`Logo de ${restaurant.name}`} sx={{ width: 40, height: 40 }} />
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}>
            {restaurant.name}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', flexGrow: 1, justifyContent: 'center' }}>
          <Autocomplete
            options={categories}
            renderInput={(params) => <TextField {...params} label="Categorias" size="small" />}
            sx={{ flexGrow: 1, maxWidth: '150px', display: { xs: 'block', md: 'block' } }}
            onChange={(event, value) => {
              if (value) {
                const categoryId = value.replace(/\s+/g, '-').toLowerCase();
                const element = document.getElementById(categoryId);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }}
          />
          <TextField
            placeholder="Buscar um produto..."
            variant="outlined"
            size="small"
            sx={{ flexGrow: 1, maxWidth: '180px', display: { xs: 'block', md: 'block' } }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Home />}
            sx={{
              minWidth: 'auto',
              padding: '6px 12px',
              '& .MuiButton-startIcon': { margin: 0 },
              display: { xs: 'none', sm: 'flex' }
            }}
          >
            <Typography sx={{ display: { xs: 'none', md: 'block' } }}>Início</Typography>
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ShoppingCart />}
            onClick={handleOpenOrdersDialog}
            sx={{
              minWidth: 'auto',
              padding: '6px 12px',
              '& .MuiButton-startIcon': { margin: 0 },
              display: { xs: 'none', sm: 'flex' }
            }}
          >
            <Typography sx={{ display: { xs: 'none', md: 'block' } }}>Pedidos</Typography>
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Person />}
            onClick={handleOpenAccountDialog}
            sx={{
              minWidth: 'auto',
              padding: '6px 12px',
              '& .MuiButton-startIcon': { margin: 0 },
              display: { xs: 'none', sm: 'flex' }
            }}
          >
            <Typography sx={{ display: { xs: 'none', md: 'block' } }}>Minha conta</Typography>
          </Button>
          <Link href="/admin" passHref>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AdminPanelSettings />}
              sx={{
                minWidth: 'auto',
                padding: '6px 12px',
                '& .MuiButton-startIcon': { margin: 0 },
                display: { xs: 'none', sm: 'flex' }
              }}
            >
              <Typography sx={{ display: { xs: 'none', md: 'block' } }}>Admin</Typography>
            </Button>
          </Link>
        </Box>
      </Toolbar>
      <AccountDialog open={isAccountDialogOpen} onClose={handleCloseAccountDialog} />
      <OrdersDialog open={isOrdersDialogOpen} onClose={handleCloseOrdersDialog} />
    </AppBar>
  );
}