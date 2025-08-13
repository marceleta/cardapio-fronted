'use client';

import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  TextField,
  useMediaQuery,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Close as CloseIcon, Add, Remove } from '@mui/icons-material';
import { useCart } from '../../context/CartContext';

export default function ProductDetailDialog({ item, open, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [observations, setObservations] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState({});
  const { addToCart } = useCart();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleAddOnToggle = (addOnName, addOnPrice) => {
    setSelectedAddOns((prev) => {
      const newSelectedAddOns = { ...prev };
      if (newSelectedAddOns[addOnName]) {
        delete newSelectedAddOns[addOnName];
      } else {
        newSelectedAddOns[addOnName] = addOnPrice;
      }
      return newSelectedAddOns;
    });
  };

  const totalPrice = useMemo(() => {
    const basePrice = parseFloat(item.price.replace(',', '.'));
    const addOnsPrice = Object.values(selectedAddOns).reduce((sum, price) => sum + parseFloat(price.replace(',', '.')), 0);
    return (basePrice + addOnsPrice) * quantity;
  }, [item.price, selectedAddOns, quantity]);


  const handleAddToCart = (e) => {
    if (e) e.stopPropagation();
    const finalAddOns = Object.keys(selectedAddOns).map(name => ({ name, price: selectedAddOns[name] }));
    addToCart({ ...item, quantity, observations, addOns: finalAddOns, totalPrice });
    onClose();
  };

  const handleClose = (e) => {
    if (e) e.stopPropagation();
    onClose();
  };

  const handleQuantityChange = (amount) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
  };

  return (
    <Dialog open={open} onClose={handleClose} fullScreen={isMobile} maxWidth="sm" fullWidth>
      <DialogTitle>
        {item.name}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <img src={item.imageUrl} alt={item.name} style={{ width: '100%', maxHeight: 250, objectFit: 'cover', borderRadius: '8px' }} />
          <Typography variant="h5" component="h2" fontWeight="bold" mt={2}>{item.name}</Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mt={1}>{item.description}</Typography>
          <Typography variant="h6" color="primary" mt={2}>R$ {item.price}</Typography>
        </Box>

        {item.addOns && item.addOns.map((group) => (
          <Box key={group.title} sx={{ mt: 2 }}>
            <Typography variant="h6" component="h3" fontWeight="bold">{group.title}</Typography>
            <FormGroup>
              {group.options.map((addOn) => (
                <FormControlLabel
                  key={addOn.name}
                  control={<Checkbox checked={!!selectedAddOns[addOn.name]} onChange={() => handleAddOnToggle(addOn.name, addOn.price)} />}
                  label={`${addOn.name} (+ R$ ${addOn.price})`}
                />
              ))}
            </FormGroup>
          </Box>
        ))}

        <TextField
          label="Observações (ex: sem cebola, molho extra)"
          multiline
          rows={3}
          fullWidth
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          sx={{ mt: 4 }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', p: 2, flexDirection: 'row', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => handleQuantityChange(-1)} disabled={quantity === 1}>
            <Remove />
          </IconButton>
          <Typography variant="h6" mx={1}>{quantity}</Typography>
          <IconButton onClick={() => handleQuantityChange(1)}>
            <Add />
          </IconButton>
        </Box>
        <Button variant="contained" color="primary" onClick={handleAddToCart}>
          Adicionar (R$ {totalPrice.toFixed(2).replace('.', ',')})
        </Button>
      </DialogActions>
    </Dialog>
  );
}