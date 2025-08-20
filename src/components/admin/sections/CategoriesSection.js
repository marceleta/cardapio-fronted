'use client';

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  Chip,
  IconButton
} from '@mui/material';
import {
  Add,
  Edit,
  Delete
} from '@mui/icons-material';

const CategoriesSection = ({ 
  categories, 
  products,
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}) => {
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Hambúrgueres': '🍔',
      'Pizzas': '🍕',
      'Bebidas': '🥤',
      'Sobremesas': '🍰',
      'Principais': '🍽️',
      'Acompanhamentos': '🍟'
    };
    return iconMap[categoryName] || '📂';
  };

  const getProductCountByCategory = (categoryName) => {
    return products.filter(product => product.category === categoryName).length;
  };

  const getProductsByCategory = (categoryName) => {
    return products.filter(product => product.category === categoryName);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          📂 Gerenciar Categorias
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAddCategory}
          sx={{ 
            background: 'linear-gradient(45deg, #ff9800 30%, #f57c00 90%)',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 3px 10px rgba(255, 152, 0, 0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #f57c00 30%, #ef6c00 90%)',
            }
          }}
        >
          Nova Categoria
        </Button>
      </Box>

      <Grid container spacing={3}>
        {categories.map((categoryName, index) => {
          const productCount = getProductCountByCategory(categoryName);
          const categoryProducts = getProductsByCategory(categoryName);
          const hasProducts = productCount > 0;

          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                }
              }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    {getCategoryIcon(categoryName)}
                  </Typography>
                  
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {categoryName}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {productCount} produto{productCount !== 1 ? 's' : ''}
                  </Typography>

                  {hasProducts && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                      {categoryProducts.slice(0, 3).map((product, idx) => (
                        <Chip 
                          key={idx}
                          label={product.name}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                      {categoryProducts.length > 3 && (
                        <Chip 
                          label={`+${categoryProducts.length - 3} mais`}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                      )}
                    </Box>
                  )}
                </CardContent>
                
                <CardActions sx={{ p: 2, gap: 1, justifyContent: 'center' }}>
                  <IconButton
                    onClick={() => onEditCategory(categoryName)}
                    sx={{ 
                      color: '#3498db',
                      '&:hover': {
                        backgroundColor: 'rgba(52, 152, 219, 0.1)'
                      }
                    }}
                    aria-label="editar"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => onDeleteCategory(categoryName)}
                    disabled={hasProducts}
                    sx={{ 
                      color: hasProducts ? '#bdc3c7' : '#e74c3c',
                      '&:hover': {
                        backgroundColor: hasProducts ? 'transparent' : 'rgba(231, 76, 60, 0.1)'
                      }
                    }}
                    aria-label="excluir"
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {categories.length === 0 && (
        <Paper sx={{ 
          p: 4, 
          textAlign: 'center', 
          mt: 3,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            📂 Nenhuma categoria encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Adicione sua primeira categoria clicando no botão "Nova Categoria"
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default CategoriesSection;
