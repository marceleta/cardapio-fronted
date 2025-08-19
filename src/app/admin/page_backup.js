'use client';

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Badge,
  CardMedia,
  CardActions
} from '@mui/material';
import {
  Dashboard,
  ShoppingCart,
  Restaurant,
  Settings,
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  MoreVert,
  TrendingUp,
  PendingActions,
  CheckCircle,
  Cancel,
  FilterList,
  Person,
  Logout,
  Assignment,
  AttachMoney
} from '@mui/icons-material';
import { menuData } from '../../lib/mockData';

const drawerWidth = 280;

// Mock data para pedidos
const mockOrders = [
  {
    id: 1,
    customerName: 'João Silva',
    phone: '(11) 99999-9999',
    items: [
      { name: 'Big Burger', quantity: 2, price: 25.00 },
      { name: 'Batata Frita', quantity: 1, price: 12.00 }
    ],
    total: 62.00,
    status: 'pending',
    createdAt: '2025-08-18 14:30',
    observations: 'Sem cebola no burger'
  },
  {
    id: 2,
    customerName: 'Maria Santos',
    phone: '(11) 88888-8888',
    items: [
      { name: 'Cheese Burger', quantity: 1, price: 22.00 },
      { name: 'Refrigerante', quantity: 2, price: 8.00 }
    ],
    total: 38.00,
    status: 'preparing',
    createdAt: '2025-08-18 14:15',
    observations: ''
  },
  {
    id: 3,
    customerName: 'Pedro Costa',
    phone: '(11) 77777-7777',
    items: [
      { name: 'Combo Duplo', quantity: 1, price: 35.00 }
    ],
    total: 35.00,
    status: 'completed',
    createdAt: '2025-08-18 13:45',
    observations: 'Entregar no portão'
  }
];

const getStatusLabel = (status) => {
  const statusMap = {
    pending: { label: 'Pendente', color: 'warning' },
    preparing: { label: 'Preparando', color: 'info' },
    completed: { label: 'Concluído', color: 'success' },
    cancelled: { label: 'Cancelado', color: 'error' }
  };
  return statusMap[status] || { label: 'Desconhecido', color: 'default' };
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState(menuData.flatMap(category => category.items));
  const [categories, setCategories] = useState(menuData.map(category => category.category));
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Dialog states
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openAddOrderDialog, setOpenAddOrderDialog] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    phone: '',
    items: [],
    observations: ''
  });
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Menu states
  const [anchorEl, setAnchorEl] = useState(null);

  // Dashboard calculations
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const totalRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.total, 0);

  // Product handlers
  const handleAddProduct = () => {
    setEditingProduct({
      id: null,
      name: '',
      description: '',
      price: '',
      imageUrl: '',
      category: categories[0] || ''
    });
    setOpenProductDialog(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setOpenProductDialog(true);
  };

  const handleDeleteProduct = (productId) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleSaveProduct = (product) => {
    if (product.id === null) {
      setProducts([...products, { ...product, id: Date.now() }]);
    } else {
      setProducts(products.map(p => (p.id === product.id ? product : p)));
    }
    setOpenProductDialog(false);
    setEditingProduct(null);
  };

  // Order handlers
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenOrderDialog(true);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleAddOrder = () => {
    setNewOrder({
      customerName: '',
      phone: '',
      items: [],
      observations: ''
    });
    setOpenAddOrderDialog(true);
  };

  const handleAddItemToOrder = () => {
    const newItem = { name: '', quantity: 1, price: 0 };
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, newItem]
    });
  };

  const handleUpdateOrderItem = (index, field, value) => {
    const updatedItems = newOrder.items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setNewOrder({ ...newOrder, items: updatedItems });
  };

  const handleRemoveOrderItem = (index) => {
    const updatedItems = newOrder.items.filter((_, i) => i !== index);
    setNewOrder({ ...newOrder, items: updatedItems });
  };

  const handleSaveOrder = () => {
    if (!newOrder.customerName || !newOrder.phone || newOrder.items.length === 0) {
      alert('Preencha todos os campos obrigatórios e adicione pelo menos um item.');
      return;
    }

    const total = newOrder.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const orderToAdd = {
      id: Math.max(...orders.map(o => o.id), 0) + 1,
      ...newOrder,
      total,
      status: 'pending',
      createdAt: new Date().toLocaleString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setOrders([orderToAdd, ...orders]);
    setOpenAddOrderDialog(false);
    setNewOrder({
      customerName: '',
      phone: '',
      items: [],
      observations: ''
    });
  };

  // Category handlers
  const handleAddCategory = () => {
    setEditingCategory({
      id: null,
      name: '',
      description: '',
      icon: ''
    });
    setOpenCategoryDialog(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setOpenCategoryDialog(true);
  };

  const handleDeleteCategory = (categoryName) => {
    if (confirm('Tem certeza que deseja excluir esta categoria? Os produtos desta categoria não serão removidos.')) {
      setCategories(categories.filter(c => c !== categoryName));
    }
  };

  const handleSaveCategory = (category) => {
    if (category.id === null) {
      // Nova categoria
      setCategories([...categories, category.name]);
    } else {
      // Editar categoria existente
      const oldName = editingCategory.name;
      const newName = category.name;
      
      // Atualizar lista de categorias
      setCategories(categories.map(c => c === oldName ? newName : c));
      
      // Atualizar categoria dos produtos
      setProducts(products.map(p => 
        p.category === oldName ? { ...p, category: newName } : p
      ));
    }
    setOpenCategoryDialog(false);
    setEditingCategory(null);
  };

  // Filtered data
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toString().includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Menu items
  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: <Dashboard />, badge: null },
    { id: 'orders', label: 'Pedidos', icon: <ShoppingCart />, badge: pendingOrders > 0 ? pendingOrders : null },
    { id: 'products', label: 'Produtos', icon: <Restaurant />, badge: null },
    { id: 'categories', label: 'Categorias', icon: <FilterList />, badge: null },
    { id: 'settings', label: 'Configurações', icon: <Settings />, badge: null }
  ];

  // Dashboard Component
  const DashboardContent = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          📊 Painel de Controle
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Bem-vindo ao painel administrativo
        </Typography>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            height: '120px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <CardContent sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {totalOrders}
                  </Typography>
                  <Typography variant="body2">
                    Total de Pedidos
                  </Typography>
                </Box>
                <Assignment sx={{ fontSize: 50, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            height: '120px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <CardContent sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {pendingOrders}
                  </Typography>
                  <Typography variant="body2">
                    Pedidos Pendentes
                  </Typography>
                </Box>
                <PendingActions sx={{ fontSize: 50, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            height: '120px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <CardContent sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {completedOrders}
                  </Typography>
                  <Typography variant="body2">
                    Pedidos Concluídos
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 50, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            height: '120px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <CardContent sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    R$ {totalRevenue.toFixed(0)}
                  </Typography>
                  <Typography variant="body2">
                    Receita Total
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 50, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          📋 Pedidos Recentes
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Horário</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.slice(0, 5).map((order) => {
                const status = getStatusLabel(order.status);
                return (
                  <TableRow key={order.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#27ae60' }}>
                      R$ {order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={status.label} 
                        color={status.color} 
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>{order.createdAt}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewOrder(order)}
                        sx={{ color: '#3498db' }}
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );

  // Orders Component
  const OrdersContent = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          🛒 Gerenciar Pedidos
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Buscar pedidos..."
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
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="pending">Pendente</MenuItem>
              <MenuItem value="preparing">Preparando</MenuItem>
              <MenuItem value="completed">Concluído</MenuItem>
              <MenuItem value="cancelled">Cancelado</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddOrder}
            sx={{ 
              background: 'linear-gradient(45deg, #27ae60 30%, #2ecc71 90%)',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 3px 10px rgba(39, 174, 96, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #229954 30%, #27ae60 90%)',
              }
            }}
          >
            Novo Pedido
          </Button>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Telefone</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Horário</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => {
                const status = getStatusLabel(order.status);
                return (
                  <TableRow key={order.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>#{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.phone}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#27ae60' }}>
                      R$ {order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={status.label} 
                        color={status.color} 
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>{order.createdAt}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewOrder(order)}
                          sx={{ 
                            backgroundColor: '#3498db', 
                            color: 'white',
                            '&:hover': { backgroundColor: '#2980b9' }
                          }}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => setAnchorEl(e.currentTarget)}
                          sx={{ 
                            backgroundColor: '#95a5a6', 
                            color: 'white',
                            '&:hover': { backgroundColor: '#7f8c8d' }
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                      >
                        <MenuItem onClick={() => {
                          handleStatusChange(order.id, 'preparing');
                          setAnchorEl(null);
                        }}>
                          ⏳ Marcar como Preparando
                        </MenuItem>
                        <MenuItem onClick={() => {
                          handleStatusChange(order.id, 'completed');
                          setAnchorEl(null);
                        }}>
                          ✅ Marcar como Concluído
                        </MenuItem>
                        <MenuItem onClick={() => {
                          handleStatusChange(order.id, 'cancelled');
                          setAnchorEl(null);
                        }}>
                          ❌ Cancelar Pedido
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );

  // Products Component
  const ProductsContent = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          🍔 Gerenciar Produtos
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
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
            onClick={handleAddProduct}
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

      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
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
              <CardMedia
                component="img"
                height="200"
                image={product.imageUrl || '/placeholder-food.jpg'}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {product.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#27ae60' }}>
                    R$ {parseFloat(product.price).toFixed(2)}
                  </Typography>
                  <Chip 
                    label={product.category} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, gap: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => handleEditProduct(product)}
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
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Excluir
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredProducts.length === 0 && (
        <Paper sx={{ 
          p: 4, 
          textAlign: 'center', 
          mt: 3,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            🔍 Nenhum produto encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm 
              ? 'Tente ajustar os filtros de busca' 
              : 'Adicione seu primeiro produto clicando no botão "Novo Produto"'
            }
          </Typography>
        </Paper>
      )}
    </Box>
  );

  // Categories Component
  const CategoriesContent = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          📂 Gerenciar Categorias
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddCategory}
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
          const categoryProducts = products.filter(p => p.category === categoryName);
          const categoryObject = {
            id: index,
            name: categoryName,
            description: `Categoria com ${categoryProducts.length} produtos`,
            icon: '🍽️'
          };
          
          return (
            <Grid item xs={12} sm={6} md={4} key={categoryName}>
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
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Box sx={{ 
                    fontSize: '3rem', 
                    mb: 2,
                    background: 'linear-gradient(45deg, #ff9800 30%, #f57c00 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block'
                  }}>
                    🍽️
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {categoryName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {categoryProducts.length} produto(s) nesta categoria
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                    {categoryProducts.slice(0, 3).map((product, idx) => (
                      <Chip 
                        key={idx}
                        label={product.name} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    ))}
                    {categoryProducts.length > 3 && (
                      <Chip 
                        label={`+${categoryProducts.length - 3} mais`} 
                        size="small" 
                        color="primary"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    )}
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, gap: 1, justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => handleEditCategory(categoryObject)}
                    sx={{ 
                      color: '#ff9800',
                      borderColor: '#ff9800',
                      '&:hover': {
                        backgroundColor: '#ff9800',
                        color: 'white'
                      }
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDeleteCategory(categoryName)}
                    disabled={categoryProducts.length > 0}
                    sx={{
                      '&.Mui-disabled': {
                        opacity: 0.5,
                        cursor: 'not-allowed'
                      }
                    }}
                  >
                    Excluir
                  </Button>
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

  // Settings Component
  const SettingsContent = () => (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
        ⚙️ Configurações
      </Typography>
      <Paper sx={{ 
        p: 4, 
        textAlign: 'center',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#7f8c8d' }}>
          🚧 Em desenvolvimento...
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Esta seção estará disponível em breve com opções de configuração do restaurante.
        </Typography>
      </Paper>
    </Box>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'orders':
        return <OrdersContent />;
      case 'products':
        return <ProductsContent />;
      case 'categories':
        return <CategoriesContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            🍔 Painel Administrativo
          </Typography>
          <Typography variant="body2" sx={{ mr: 2, opacity: 0.9 }}>
            Administrador
          </Typography>
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Person />
          </IconButton>
          <IconButton color="inherit">
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #2c3e50 0%, #34495e 100%)',
            color: 'white',
            borderRight: 'none'
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            🍔 Admin Panel
          </Typography>
        </Toolbar>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <List sx={{ mt: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 1, mx: 1 }}>
              <ListItemButton
                selected={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.05)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontWeight: activeTab === item.id ? 'bold' : 'normal'
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f8f9fa',
          p: 3,
          minHeight: '100vh'
        }}
      >
        <Toolbar />
        {renderContent()}
      </Box>

      {/* Product Dialog */}
      <Dialog 
        open={openProductDialog} 
        onClose={() => setOpenProductDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {editingProduct?.id === null ? '➕ Adicionar Produto' : '✏️ Editar Produto'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            fullWidth
            variant="outlined"
            value={editingProduct?.name || ''}
            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Descrição"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={editingProduct?.description || ''}
            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Preço"
            fullWidth
            variant="outlined"
            type="number"
            value={editingProduct?.price || ''}
            onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>Categoria</InputLabel>
            <Select
              value={editingProduct?.category || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
              label="Categoria"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="URL da Imagem"
            fullWidth
            variant="outlined"
            value={editingProduct?.imageUrl || ''}
            onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenProductDialog(false)} sx={{ color: '#7f8c8d' }}>
            Cancelar
          </Button>
          <Button 
            onClick={() => handleSaveProduct(editingProduct)}
            variant="contained"
            sx={{ 
              background: 'linear-gradient(45deg, #27ae60 30%, #2ecc71 90%)',
              fontWeight: 'bold'
            }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog
        open={openOrderDialog}
        onClose={() => setOpenOrderDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #3498db 30%, #2980b9 90%)',
          color: 'white',
          fontWeight: 'bold'
        }}>
          📋 Detalhes do Pedido #{selectedOrder?.id}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedOrder && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    👤 Cliente: {selectedOrder.customerName}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    📞 Telefone: {selectedOrder.phone}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" gutterBottom>
                    🕐 Horário: {selectedOrder.createdAt}
                  </Typography>
                  {selectedOrder.observations && (
                    <Typography variant="body1" gutterBottom>
                      📝 Observações: {selectedOrder.observations}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                🍔 Itens do Pedido:
              </Typography>
              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Quantidade</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Preço Unit.</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>R$ {item.price.toFixed(2)}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          R$ {(item.quantity * item.price).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ 
                backgroundColor: '#f8f9fa', 
                p: 2, 
                borderRadius: 1, 
                textAlign: 'right' 
              }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#27ae60' }}>
                  💰 Total: R$ {selectedOrder.total.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setOpenOrderDialog(false)}
            variant="contained"
            sx={{ 
              background: 'linear-gradient(45deg, #3498db 30%, #2980b9 90%)',
              fontWeight: 'bold'
            }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Order Dialog */}
      <Dialog
        open={openAddOrderDialog}
        onClose={() => setOpenAddOrderDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #27ae60 30%, #2ecc71 90%)',
          color: 'white',
          fontWeight: 'bold'
        }}>
          ➕ Novo Pedido
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome do Cliente"
                required
                value={newOrder.customerName}
                onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefone"
                required
                value={newOrder.phone}
                onChange={(e) => setNewOrder({ ...newOrder, phone: e.target.value })}
                placeholder="(11) 99999-9999"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações"
                multiline
                rows={2}
                value={newOrder.observations}
                onChange={(e) => setNewOrder({ ...newOrder, observations: e.target.value })}
                placeholder="Instruções especiais para o pedido..."
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  🍔 Itens do Pedido
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleAddItemToOrder}
                  size="small"
                  sx={{ 
                    color: '#27ae60',
                    borderColor: '#27ae60',
                    '&:hover': {
                      backgroundColor: '#27ae60',
                      color: 'white'
                    }
                  }}
                >
                  Adicionar Item
                </Button>
              </Box>
              
              {newOrder.items.map((item, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2, backgroundColor: '#f8f9fa' }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Produto</InputLabel>
                        <Select
                          value={item.name}
                          onChange={(e) => {
                            const selectedProduct = products.find(p => p.name === e.target.value);
                            handleUpdateOrderItem(index, 'name', e.target.value);
                            if (selectedProduct) {
                              handleUpdateOrderItem(index, 'price', parseFloat(selectedProduct.price));
                            }
                          }}
                          label="Produto"
                        >
                          {products.map((product) => (
                            <MenuItem key={product.id} value={product.name}>
                              {product.name} - R$ {parseFloat(product.price).toFixed(2)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <TextField
                        fullWidth
                        label="Qtd"
                        type="number"
                        size="small"
                        inputProps={{ min: 1 }}
                        value={item.quantity}
                        onChange={(e) => handleUpdateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      />
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <TextField
                        fullWidth
                        label="Preço"
                        type="number"
                        size="small"
                        inputProps={{ step: 0.01, min: 0 }}
                        value={item.price}
                        onChange={(e) => handleUpdateOrderItem(index, 'price', parseFloat(e.target.value) || 0)}
                      />
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#27ae60' }}>
                        R$ {(item.quantity * item.price).toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveOrderItem(index)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}

              {newOrder.items.length === 0 && (
                <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#f8f9fa' }}>
                  <Typography variant="body2" color="text.secondary">
                    📝 Nenhum item adicionado. Clique em "Adicionar Item" para começar.
                  </Typography>
                </Paper>
              )}

              {newOrder.items.length > 0 && (
                <Box sx={{ 
                  backgroundColor: '#e8f5e8', 
                  p: 2, 
                  borderRadius: 1, 
                  textAlign: 'right',
                  mt: 2
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#27ae60' }}>
                    💰 Total: R$ {newOrder.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setOpenAddOrderDialog(false)}
            sx={{ color: '#7f8c8d' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveOrder}
            variant="contained"
            sx={{ 
              background: 'linear-gradient(45deg, #27ae60 30%, #2ecc71 90%)',
              fontWeight: 'bold'
            }}
          >
            Criar Pedido
          </Button>
        </DialogActions>
      </Dialog>

      {/* Category Dialog */}
      <Dialog
        open={openCategoryDialog}
        onClose={() => setOpenCategoryDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #ff9800 30%, #f57c00 90%)',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {editingCategory?.id === null ? '📂 Adicionar Categoria' : '✏️ Editar Categoria'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Nome da Categoria"
            fullWidth
            variant="outlined"
            required
            value={editingCategory?.name || ''}
            onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
            sx={{ mb: 2 }}
            helperText="Ex: Hambúrgueres, Bebidas, Sobremesas"
          />
          <TextField
            margin="dense"
            label="Descrição"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            value={editingCategory?.description || ''}
            onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
            sx={{ mb: 2 }}
            helperText="Descrição opcional da categoria"
          />
          <TextField
            margin="dense"
            label="Ícone (Emoji)"
            fullWidth
            variant="outlined"
            value={editingCategory?.icon || ''}
            onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
            placeholder="🍔"
            helperText="Escolha um emoji para representar a categoria"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setOpenCategoryDialog(false)}
            sx={{ color: '#7f8c8d' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={() => handleSaveCategory(editingCategory)}
            variant="contained"
            disabled={!editingCategory?.name}
            sx={{ 
              background: 'linear-gradient(45deg, #ff9800 30%, #f57c00 90%)',
              fontWeight: 'bold'
            }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
