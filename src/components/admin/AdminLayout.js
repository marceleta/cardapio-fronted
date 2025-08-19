'use client';

import React from 'react';
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
  Divider,
  Badge,
  IconButton,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Dashboard,
  ShoppingCart,
  Restaurant,
  Settings,
  FilterList,
  Person,
  Logout
} from '@mui/icons-material';
import { drawerWidth } from '../../utils/adminHelpers';

const AdminLayout = ({ 
  activeTab, 
  setActiveTab, 
  pendingOrders, 
  children 
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: <Dashboard />, badge: null },
    { id: 'orders', label: 'Pedidos', icon: <ShoppingCart />, badge: pendingOrders > 0 ? pendingOrders : null },
    { id: 'products', label: 'Produtos', icon: <Restaurant />, badge: null },
    { id: 'categories', label: 'Categorias', icon: <FilterList />, badge: null },
    { id: 'settings', label: 'Configurações', icon: <Settings />, badge: null }
  ];

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
          background: 'linear-gradient(45deg, #2c3e50 30%, #3498db 90%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            🍔 Admin Panel
          </Typography>
          
          <IconButton
            onClick={handleMenuClick}
            sx={{ color: 'white' }}
          >
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 32, height: 32 }}>
              <Person />
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleMenuClose}>
              <Person sx={{ mr: 1 }} />
              Perfil
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Logout sx={{ mr: 1 }} />
              Sair
            </MenuItem>
          </Menu>
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
            background: 'linear-gradient(180deg, #34495e 0%, #2c3e50 100%)',
            color: 'white',
            borderRight: 'none',
            boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ecf0f1' }}>
            🍔 Painel Administrativo
          </Typography>
          <Typography variant="body2" sx={{ color: '#bdc3c7', mt: 1 }}>
            Sistema de Gestão
          </Typography>
        </Box>
        
        <List sx={{ pt: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => setActiveTab(item.id)}
                selected={activeTab === item.id}
                sx={{
                  mx: 2,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    background: 'linear-gradient(45deg, #3498db 30%, #2980b9 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #3498db 30%, #2980b9 90%)',
                    }
                  },
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
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
                  primaryTypographyProps={{ 
                    fontWeight: activeTab === item.id ? 'bold' : 'normal',
                    fontSize: '0.95rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ flexGrow: 1 }} />
        
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#95a5a6' }}>
            © 2025 Cardápio Digital
          </Typography>
        </Box>
      </Drawer>

      {/* Main content */}
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
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
