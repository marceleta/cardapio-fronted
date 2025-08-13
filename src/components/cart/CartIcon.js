'use client';

import { Fab, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../../context/CartContext';

export default function CartIcon({ onClick }) {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <Fab
      color="primary"
      aria-label="cart"
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1200,
      }}
      onClick={onClick}
    >
      <Badge badgeContent={totalItems} color="secondary">
        <ShoppingCartIcon />
      </Badge>
    </Fab>
  );
}
