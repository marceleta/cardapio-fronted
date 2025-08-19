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
  IconButton,
  Chip,
  Paper
} from '@mui/material';
import {
  Add,
  Edit,
  Delete
} from '@mui/icons-material';

const CategoryManager = ({ 
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
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          📂 Categorias
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={onAddCategory}
          size="small"
          sx={{ 
            borderColor: '#ff9800',
            color: '#ff9800',
            '&:hover': {
              borderColor: '#f57c00',
              backgroundColor: 'rgba(255, 152, 0, 0.04)'
            }
          }}
        >
          Nova Categoria
        </Button>
      </Box>

      {categories.length === 0 ? (
        <Paper sx={{ 
          p: 3, 
          textAlign: 'center',
          borderRadius: 2,
          backgroundColor: '#f8f9fa'
        }}>
          <Typography variant="body2" color="text.secondary">
            📂 Nenhuma categoria criada ainda
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Clique em "Nova Categoria" para começar
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {categories.map((categoryName, index) => {
            const productCount = getProductCountByCategory(categoryName);
            const categoryProducts = getProductsByCategory(categoryName);
            const hasProducts = productCount > 0;

            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ 
                  height: '100%',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  '&:hover': { 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.2s ease'
                }}>
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ mr: 1 }}>
                        {getCategoryIcon(categoryName)}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                        {categoryName}
                      </Typography>
                      <Chip 
                        label={productCount}
                        size="small"
                        color={hasProducts ? "primary" : "default"}
                        variant="outlined"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {productCount} produto{productCount !== 1 ? 's' : ''}
                    </Typography>

                    {hasProducts && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {categoryProducts.slice(0, 2).map((product, idx) => (
                          <Chip 
                            key={idx}
                            label={product.name}
                            size="small"
                            variant="filled"
                            color="secondary"
                            sx={{ fontSize: '0.7rem', height: '20px' }}
                          />
                        ))}
                        {categoryProducts.length > 2 && (
                          <Chip 
                            label={`+${categoryProducts.length - 2}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: '20px' }}
                          />
                        )}
                      </Box>
                    )}
                  </CardContent>
                  
                  <CardActions sx={{ pt: 0, px: 2, pb: 2, justifyContent: 'flex-end' }}>
                    <IconButton
                      size="small"
                      onClick={() => onEditCategory(categoryName)}
                      sx={{ 
                        color: '#3498db',
                        '&:hover': { backgroundColor: 'rgba(52, 152, 219, 0.1)' }
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onDeleteCategory(categoryName)}
                      disabled={hasProducts}
                      sx={{ 
                        color: hasProducts ? '#bdc3c7' : '#e74c3c',
                        '&:hover': { backgroundColor: hasProducts ? 'transparent' : 'rgba(231, 76, 60, 0.1)' }
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default CategoryManager;
