'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  FormControlLabel,
  Switch
} from '@mui/material';

const ProductDialog = ({ 
  open, 
  onClose, 
  product, 
  categories = [], 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    visibleInMenu: true // Novo campo para controlar visibilidade no cardápio
  });

  // Effect para inicializar formulário quando open ou produto mudarem
  useEffect(() => {
    if (open) {
      if (product) {
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          category: product.category || '',
          imageUrl: product.imageUrl || '',
          visibleInMenu: product.visibleInMenu !== undefined ? product.visibleInMenu : true
        });
      } else {
        // Para novo produto, deixar campos vazios
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          imageUrl: '',
          visibleInMenu: true
        });
      }
    }
  }, [open, product]); // Remover categories para evitar loop infinito

  const handleSubmit = () => {
    const productData = {
      ...formData,
      price: parseFloat(formData.price) || 0
    };
    
    if (product) {
      productData.id = product.id;
    }
    
    onSave(productData);
  };

  const isValid = formData.name && formData.price !== '' && formData.category;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        {product ? '✏️ Editar Produto' : '🍽️ Adicionar Produto'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            required
          />
          
          <TextField
            label="Descrição"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            fullWidth
            multiline
            rows={3}
          />
          
          <TextField
            label="Preço"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            fullWidth
            required
            inputProps={{ step: '0.01', min: '0' }}
          />
          
          <FormControl fullWidth required>
            <InputLabel>Categoria</InputLabel>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              label="Categoria"
              required
            >
              {Array.isArray(categories) && categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            label="URL da Imagem"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            fullWidth
            placeholder="https://exemplo.com/imagem.jpg"
          />

          {/* Switch para controlar visibilidade no cardápio */}
          <Box sx={{ mt: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.visibleInMenu}
                  onChange={(e) => setFormData({ ...formData, visibleInMenu: e.target.checked })}
                  color="primary"
                />
              }
              label="Exibir no cardápio para clientes"
              sx={{ display: 'block' }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              {formData.visibleInMenu 
                ? "O produto será visível no cardápio público" 
                : "O produto ficará oculto para os clientes"
              }
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!isValid}
          sx={{ ml: 1 }}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDialog;
