/**
 * SEÇÃO DE PRODUTOS - PAINEL ADMINISTRATIVO
 * 
 * Componente responsável por gerenciar a exibição e interação com produtos.
 * Inclui funcionalidades de busca, CRUD de produtos e gerenciamento de categorias.
 * 
 * Funcionalidades:
 * - Listagem de produtos em grid responsivo
 * - Sistema de busca em tempo real
 * - Integração com gerenciamento de categorias
 * - Ações de editar/excluir produtos
 * - Interface para adicionar novos produtos
 */

'use client';

import React from 'react';

// Importações do Material-UI - Componentes de interface
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Chip,
  Divider
} from '@mui/material';

// Importações do Material-UI - Ícones
import {
  Add,
  Search,
  Edit,
  Delete
} from '@mui/icons-material';

// Importações de utilitários e componentes locais
import { filterProducts } from '../../../utils/adminHelpers';
import CategoryManager from '../components/CategoryManager';
import CategoryDialog from '../dialogs/CategoryDialog';
import { useCategoryManager } from '../../../hooks/useCategoryManager';

/**
 * COMPONENTE PRINCIPAL - SEÇÃO DE PRODUTOS
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.products - Lista de produtos para exibição
 * @param {Function} props.setProducts - Função para atualizar lista de produtos
 * @param {Array} props.categories - Lista de categorias disponíveis
 * @param {Function} props.setCategories - Função para atualizar categorias
 * @param {string} props.searchTerm - Termo atual de busca
 * @param {Function} props.setSearchTerm - Função para atualizar termo de busca
 * @param {Function} props.onAddProduct - Callback para adicionar novo produto
 * @param {Function} props.onEditProduct - Callback para editar produto existente
 * @param {Function} props.onDeleteProduct - Callback para excluir produto
 */
const ProductsSection = ({ 
  products, 
  setProducts,
  categories,
  setCategories,
  searchTerm, 
  setSearchTerm,
  onAddProduct,
  onEditProduct,
  onDeleteProduct
}) => {
  // Filtragem de produtos baseada no termo de busca
  const filteredProducts = filterProducts(products, searchTerm);

  // Hook personalizado para gerenciar operações de categoria
  const categoryManager = useCategoryManager({
    categories,
    setCategories,
    products,
    setProducts
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 4 }}>
        🍔 Gerenciar Produtos
      </Typography>

      {/* SEÇÃO DE GERENCIAMENTO DE CATEGORIAS */}
      {/* Componente modular para criar, editar e excluir categorias */}
      <CategoryManager
        categories={categories}
        products={products}
        onAddCategory={categoryManager.handleAddCategory}
        onEditCategory={categoryManager.handleEditCategory}
        onDeleteCategory={categoryManager.handleDeleteCategory}
      />

      <Divider sx={{ my: 4 }} />

      {/* Seção de Produtos com busca e botão de adicionar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          �️ Produtos ({filteredProducts.length})
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Buscar produtos..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200 }}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAddProduct}
            sx={{ 
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 3px 10px rgba(102, 126, 234, 0.3)'
            }}
          >
            Novo Produto
          </Button>
        </Box>
      </Box>

      {/* GRID RESPONSIVO DE PRODUTOS */}
      {/* Layout adaptativo: 1 coluna (mobile), 2 colunas (tablet), 3 colunas (desktop) */}
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            {/* CARD DE PRODUTO INDIVIDUAL */}
            {/* Design elevado com efeitos hover e animações suaves */}
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
              {/* Imagem do produto com fallback */}
              <CardMedia
                component="img"
                height="200"
                image={product.imageUrl || '/placeholder-food.jpg'}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              
              {/* Conteúdo principal do card */}
              <CardContent sx={{ flexGrow: 1 }}>
                {/* Nome do produto */}
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {product.name}
                </Typography>
                
                {/* Descrição do produto */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {product.description}
                </Typography>
                
                {/* Container de informações: preço e categoria */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {/* Preço formatado em destaque */}
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#27ae60' }}>
                    R$ {parseFloat(product.price).toFixed(2)}
                  </Typography>
                  
                  {/* Badge da categoria */}
                  <Chip 
                    label={product.category} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
              </CardContent>
              
              {/* AÇÕES DO CARD */}
              {/* Botões de editar e excluir em layout horizontal */}
              <CardActions sx={{ p: 2, gap: 1 }}>
                {/* Botão de edição */}
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => onEditProduct(product)}
                  sx={{ 
                    color: '#3498db',
                    borderColor: '#3498db',
                    '&:hover': {
                      backgroundColor: '#3498db',
                      color: 'white'
                    }
                  }}
                >
                  Editar
                </Button>
                
                {/* Botão de exclusão */}
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => onDeleteProduct(product.id)}
                >
                  Excluir
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ESTADO VAZIO - NENHUM PRODUTO ENCONTRADO */}
      {/* Exibido quando não há produtos ou quando a busca não retorna resultados */}
      {filteredProducts.length === 0 && (
        <Paper sx={{ 
          p: 4, 
          textAlign: 'center', 
          mt: 3,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          {/* Título do estado vazio */}
          <Typography variant="h6" color="text.secondary" gutterBottom>
            🔍 Nenhum produto encontrado
          </Typography>
          
          {/* Mensagem contextual baseada no estado da busca */}
          <Typography variant="body2" color="text.secondary">
            {searchTerm 
              ? 'Tente ajustar os filtros de busca' 
              : 'Adicione seu primeiro produto clicando no botão "Novo Produto"'
            }
          </Typography>
        </Paper>
      )}

      {/* DIÁLOGO MODAL PARA GERENCIAMENTO DE CATEGORIAS */}
      {/* Componente modular reutilizável para criar/editar categorias */}
      <CategoryDialog
        open={categoryManager.openCategoryDialog}
        onClose={categoryManager.handleCloseCategoryDialog}
        category={categoryManager.editingCategory}
        onSave={categoryManager.handleSaveCategory}
      />
    </Box>
  );
};

// Exportação padrão do componente para uso em outros módulos
export default ProductsSection;
