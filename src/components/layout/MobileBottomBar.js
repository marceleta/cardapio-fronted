'use client';

import { AppBar, Toolbar, Button, Box, Typography, Badge } from '@mui/material'; // Added Badge
import { Home, ShoppingCart, Person } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useCart } from '../../context/CartContext'; // Added useCart
import { useState } from 'react'; // Import useState
import AccountDialog from '../account/AccountDialog'; // Import AccountDialog
import OrdersDialog from '../account/OrdersDialog'; // Import OrdersDialog

export default function MobileBottomBar({ setCartOpen }) { // Added setCartOpen prop
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { getTotalItems } = useCart(); // Get getTotalItems from useCart
  const totalItems = getTotalItems(); // Get total items

  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false); // State for AccountDialog
  const [isOrdersDialogOpen, setIsOrdersDialogOpen] = useState(false); // State for OrdersDialog

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

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isMobile) {
    return null; // Hide on larger screens
  }

  return (
    <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0, display: { xs: 'block', sm: 'none' } }}>
      <Toolbar sx={{ justifyContent: 'space-around' }}>
        <Button color="inherit" sx={{ flexDirection: 'column', minWidth: 'auto' }} onClick={handleScrollToTop}>
          <Home sx={{ fontSize: '1.5rem' }} />
          <Typography variant="caption">Início</Typography>
        </Button>
        <Button color="inherit" sx={{ flexDirection: 'column', minWidth: 'auto' }} onClick={handleOpenOrdersDialog}> {/* Attach onClick handler */}
          <ShoppingCart sx={{ fontSize: '1.5rem' }} />
          <Typography variant="caption">Pedidos</Typography>
        </Button>
        {/* Cart Button */}
        <Button color="inherit" sx={{ flexDirection: 'column', minWidth: 'auto' }} onClick={() => setCartOpen(true)}>
          <Badge badgeContent={totalItems} color="secondary" sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem', height: 16, minWidth: 16 } }}>
            <ShoppingCart sx={{ fontSize: '1.5rem' }} />
          </Badge>
          <Typography variant="caption">Carrinho</Typography>
        </Button>
        <Button color="inherit" sx={{ flexDirection: 'column', minWidth: 'auto' }} onClick={handleOpenAccountDialog}> {/* Attach onClick handler */}
          <Person sx={{ fontSize: '1.5rem' }} />
          <Typography variant="caption">Minha conta</Typography>
        </Button>
      </Toolbar>
      <AccountDialog open={isAccountDialogOpen} onClose={handleCloseAccountDialog} /> {/* Render AccountDialog */}
      <OrdersDialog open={isOrdersDialogOpen} onClose={handleCloseOrdersDialog} /> {/* Render OrdersDialog */}
    </AppBar>
  );
}
