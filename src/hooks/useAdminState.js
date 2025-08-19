import { useState } from 'react';
import { mockOrders } from '../utils/adminHelpers';
import { menuData } from '../lib/mockData';

// Hook personalizado para gerenciar o estado do admin
export const useAdminState = () => {
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

  return {
    // Tab state
    activeTab,
    setActiveTab,
    
    // Data states
    products,
    setProducts,
    categories,
    setCategories,
    orders,
    setOrders,
    
    // Filter states
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    
    // Dialog states
    openProductDialog,
    setOpenProductDialog,
    editingProduct,
    setEditingProduct,
    openOrderDialog,
    setOpenOrderDialog,
    selectedOrder,
    setSelectedOrder,
    openAddOrderDialog,
    setOpenAddOrderDialog,
    newOrder,
    setNewOrder,
    openCategoryDialog,
    setOpenCategoryDialog,
    editingCategory,
    setEditingCategory
  };
};
