'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Paper, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { menuData } from '../../lib/mockData'; // Assuming mockData is accessible

export default function AdminPage() {
  const [products, setProducts] = useState(menuData.flatMap(category => category.items));
  const [categories, setCategories] = useState(menuData.map(category => category.category));
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

  // Product Management Handlers
  const handleAddProduct = () => {
    setEditingProduct({ id: null, name: '', description: '', price: '', imageUrl: '' });
    setOpenProductDialog(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setOpenProductDialog(true);
  };

  const handleDeleteProduct = (productId) => {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleSaveProduct = (product) => {
    if (product.id === null) {
      // Add new product (mock ID)
      setProducts([...products, { ...product, id: Date.now() }]);
    } else {
      // Update existing product
      setProducts(products.map(p => (p.id === product.id ? product : p)));
    }
    setOpenProductDialog(false);
    setEditingProduct(null);
  };

  // Category Management Handlers
  const handleAddCategory = () => {
    setEditingCategory({ name: '' });
    setOpenCategoryDialog(true);
  };

  const handleEditCategory = (categoryName) => {
    setEditingCategory({ name: categoryName });
    setOpenCategoryDialog(true);
  };

  const handleDeleteCategory = (categoryName) => {
    if (confirm('Tem certeza que deseja deletar esta categoria? Isso não removerá os produtos associados.')) {
      setCategories(categories.filter(c => c !== categoryName));
    }
  };

  const handleSaveCategory = (category) => {
    if (editingCategory.name === '') {
      // Add new category
      setCategories([...categories, category.name]);
    } else {
      // Update existing category
      setCategories(categories.map(c => (c === editingCategory.name ? category.name : c)));
    }
    setOpenCategoryDialog(false);
    setEditingCategory(null);
  };

  return (
    <Box sx={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>Painel de Administração</Typography>

      {/* Product Management */}
      <Paper elevation={3} sx={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <Typography variant="h5">Produtos</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddProduct}>Adicionar Produto</Button>
        </Box>
        <List>
          {products.map((product) => (
            <ListItem
              key={product.id}
              secondaryAction={
                <Box>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEditProduct(product)}>
                    <Edit />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteProduct(product.id)}>
                    <Delete />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText primary={product.name} secondary={`R$ ${product.price}`} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Category Management */}
      <Paper elevation={3} sx={{ padding: '1.5rem' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <Typography variant="h5">Categorias</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddCategory}>Adicionar Categoria</Button>
        </Box>
        <List>
          {categories.map((categoryName) => (
            <ListItem
              key={categoryName}
              secondaryAction={
                <Box>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEditCategory(categoryName)}>
                    <Edit />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCategory(categoryName)}>
                    <Delete />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText primary={categoryName} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Product Dialog */}
      <Dialog open={openProductDialog} onClose={() => setOpenProductDialog(false)}>
        <DialogTitle>{editingProduct?.id === null ? 'Adicionar Produto' : 'Editar Produto'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            fullWidth
            value={editingProduct?.name || ''}
            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Descrição"
            fullWidth
            value={editingProduct?.description || ''}
            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Preço"
            fullWidth
            value={editingProduct?.price || ''}
            onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
          />
          <TextField
            margin="dense"
            label="URL da Imagem"
            fullWidth
            value={editingProduct?.imageUrl || ''}
            onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProductDialog(false)}>Cancelar</Button>
          <Button onClick={() => handleSaveProduct(editingProduct)}>Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={openCategoryDialog} onClose={() => setOpenCategoryDialog(false)}>
        <DialogTitle>{editingCategory?.name === '' ? 'Adicionar Categoria' : 'Editar Categoria'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome da Categoria"
            fullWidth
            value={editingCategory?.name || ''}
            onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategoryDialog(false)}>Cancelar</Button>
          <Button onClick={() => handleSaveCategory(editingCategory)}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
