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
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar
} from '@mui/material';

// Importações do Material-UI - Ícones
import {
  Add,
  Search,
  Edit,
  Delete,
  ViewModule,
  ViewList,
  Visibility,
  VisibilityOff
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
  // Estado para controlar o modo de visualização (cards ou lista)
  const [viewMode, setViewMode] = React.useState('list');

  // Filtragem de produtos baseada no termo de busca
  const filteredProducts = filterProducts(products, searchTerm);

  // Hook personalizado para gerenciar operações de categoria
  const categoryManager = useCategoryManager({
    categories,
    setCategories,
    products,
    setProducts
  });

  // Função para alterar o modo de visualização
  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  // Função para formatar preço em formato brasileiro
  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2).replace('.', ',');
  };

  // Renderização dos produtos em formato de cards
  const renderProductCards = () => (
    <Grid container spacing={3}>
      {filteredProducts.map((product) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
          {/* CARD DE PRODUTO INDIVIDUAL */}
          {/* Design elevado com efeitos hover e animações suaves */}
          <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            opacity: product.visibleInMenu !== false ? 1 : 0.7,
            border: product.visibleInMenu === false ? '2px dashed #ccc' : 'none',
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
              {/* Nome do produto com status de visibilidade */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', flex: 1 }}>
                  {product.name}
                </Typography>
                {/* Indicador de visibilidade no cardápio */}
                <Chip
                  icon={product.visibleInMenu !== false ? <Visibility /> : <VisibilityOff />}
                  label={product.visibleInMenu !== false ? "Visível" : "Oculto"}
                  size="small"
                  color={product.visibleInMenu !== false ? "success" : "default"}
                  variant="outlined"
                />
              </Box>
              
              {/* Descrição do produto */}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {product.description}
              </Typography>
              
              {/* Container de informações: preço e categoria */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Preço formatado em destaque */}
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#27ae60' }}>
                  R$ {formatPrice(product.price)}
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
  );

  // Renderização dos produtos em formato de lista/tabela
  const renderProductList = () => (
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>Produto</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Categoria</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Visibilidade</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Preço</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: 200 }}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow 
              key={product.id}
              sx={{ 
                '&:hover': { backgroundColor: '#f8f9fa' },
                transition: 'background-color 0.2s',
                opacity: product.visibleInMenu !== false ? 1 : 0.7,
                backgroundColor: product.visibleInMenu === false ? '#f9f9f9' : 'inherit'
              }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={product.imageUrl || '/placeholder-food.jpg'}
                    alt={product.name}
                    sx={{ width: 50, height: 50 }}
                  />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.description}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Chip 
                  label={product.category} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <Chip
                  icon={product.visibleInMenu !== false ? <Visibility /> : <VisibilityOff />}
                  label={product.visibleInMenu !== false ? "Visível no cardápio" : "Oculto do cardápio"}
                  size="small"
                  color={product.visibleInMenu !== false ? "success" : "default"}
                  variant="outlined"
                />
              </TableCell>
              <TableCell sx={{ textAlign: 'right' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#27ae60' }}>
                  R$ {formatPrice(product.price)}
                </Typography>
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    size="small"
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
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => onDeleteProduct(product.id)}
                  >
                    Excluir
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

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
          🍽️ Produtos ({filteredProducts.length})
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Seletor de modo de visualização */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="modo de visualização"
            size="small"
          >
            <ToggleButton value="cards" aria-label="visualização em cards">
              <ViewModule />
            </ToggleButton>
            <ToggleButton value="list" aria-label="visualização em lista">
              <ViewList />
            </ToggleButton>
          </ToggleButtonGroup>
          
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

      {/* RENDERIZAÇÃO CONDICIONAL DOS PRODUTOS */}
      {/* Alterna entre visualização em cards e lista baseado no estado viewMode */}
      {viewMode === 'cards' ? renderProductCards() : renderProductList()}

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
