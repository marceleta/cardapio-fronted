'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography
} from '@mui/material';

const CategoryDialog = ({ 
  open, 
  onClose, 
  category, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: ''
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        icon: category.icon || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        icon: '📂'
      });
    }
  }, [category, open]);

  const handleSubmit = () => {
    const categoryData = {
      ...formData,
      originalName: category?.name // Para identificar categoria sendo editada
    };
    
    onSave(categoryData);
    onClose();
  };

  const isValid = formData.name.trim() !== '';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {category ? '✏️ Editar Categoria' : '📂 Adicionar Categoria'}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Nome da Categoria"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            required
            placeholder="Ex: Hambúrgueres, Pizzas, Bebidas..."
          />
          
          <TextField
            label="Descrição"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            fullWidth
            multiline
            rows={2}
            placeholder="Breve descrição da categoria..."
          />
          
          <TextField
            label="Ícone"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            fullWidth
            placeholder="Ex: 🍔, 🍕, 🥤..."
            helperText="Adicione um emoji para representar a categoria"
          />
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

export default CategoryDialog;
