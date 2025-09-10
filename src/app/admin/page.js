/**
 * PÁGINA PRINCIPAL DO PAINEL ADMINISTRATIVO
 * 
 * Interface principal para gerenciamento do sistema de cardápio.
 * Inclui proteção de rota para garantir acesso apenas a usuários
 * autenticados com privilégios administrativos.
 * 
 * Funcionalidades:
 * - Dashboard com estatísticas gerais
 * - Gerenciamento de produtos e categorias
 * - Controle de pedidos e clientes
 * - Configurações do sistema
 * - Proteção de acesso via autenticação
 */

'use client';

import React from 'react';
import { useState } from 'react';
import { menuData, mockClients } from '../../lib/mockData';

// Importar componentes de autenticação
import { AdminRoute } from '../../components/auth/ProtectedRoute';

// Importar componentes
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Dashboard, 
  OrdersSection, 
  ProductsSection, 
  CategoriesSection,
  CouponsSection,
  BannerManager,
  SettingsSection,
  CashierSection
} from '../../components/admin/sections';
import ClientsSection from '../../components/admin/sections/ClientsSection';
import HighlightsManager from '../../components/admin/sections/HighlightsManager';
import { ProductDialog } from '../../components/admin/dialogs';

// Importar hooks personalizados
import { useAdminState } from '../../hooks/useAdminState';
import { useProductHandlers } from '../../hooks/useProductHandlers';
import { useOrderHandlers } from '../../hooks/useOrderHandlers';
import { useCategoryHandlers } from '../../hooks/useCategoryHandlers';

// Importar utilitários
import { calculateDashboardStats } from '../../utils/adminHelpers';

/**
 * COMPONENTE PRINCIPAL DA ÁREA ADMINISTRATIVA
 */
function AdminPageContent() {
  // Estado principal usando hook personalizado
  const adminState = useAdminState();
  
  // Estado específico para clientes
  const [clients, setClients] = useState(mockClients);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  
  // Extrair dados do estado
  const {
    activeTab,
    setActiveTab,
    products,
    setProducts,
    categories,
    setCategories,
    orders,
    setOrders,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
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
  } = adminState;

  // Handlers usando hooks personalizados
  const productHandlers = useProductHandlers({
    products,
    setProducts,
    setOpenProductDialog,
    setEditingProduct
  });

  const orderHandlers = useOrderHandlers({
    orders,
    setOrders,
    setOpenOrderDialog,
    setSelectedOrder,
    setOpenAddOrderDialog,
    newOrder,
    setNewOrder
  });

  const categoryHandlers = useCategoryHandlers({
    categories,
    setCategories,
    products,
    setOpenCategoryDialog,
    setEditingCategory
  });

  // Calcular estatísticas do dashboard
  const { pendingOrders } = calculateDashboardStats(orders);

  /**
   * RENDERIZADOR DE CONTEÚDO BASEADO NA ABA ATIVA
   * 
   * Retorna o componente apropriado baseado na navegação
   * selecionada pelo usuário.
   */
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            orders={orders}
            onViewOrder={orderHandlers.handleViewOrder}
          />
        );
      
      case 'orders':
        return (
          <OrdersSection
            orders={orders}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            onAddOrder={orderHandlers.handleAddOrder}
            onViewOrder={orderHandlers.handleViewOrder}
            onStatusChange={orderHandlers.handleStatusChange}
          />
        );
      
      case 'products':
        return (
          <ProductsSection
            products={products}
            setProducts={setProducts}
            categories={categories}
            setCategories={setCategories}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAddProduct={productHandlers.handleAddProduct}
            onEditProduct={productHandlers.handleEditProduct}
            onDeleteProduct={productHandlers.handleDeleteProduct}
          />
        );
      
      case 'clients':
        return (
          <ClientsSection
            clients={clients}
            setClients={setClients}
            searchTerm={clientSearchTerm}
            setSearchTerm={setClientSearchTerm}
          />
        );
      
      case 'categories':
        return (
          <CategoriesSection
            categories={categories}
            products={products}
            onAddCategory={categoryHandlers.handleAddCategory}
            onEditCategory={categoryHandlers.handleEditCategory}
            onDeleteCategory={categoryHandlers.handleDeleteCategory}
          />
        );
      
      case 'coupons':
        return <CouponsSection />;
      
      case 'banners':
        return <BannerManager />;
      
      case 'highlights':
        return <HighlightsManager />;
      
      case 'cashier':
        return <CashierSection />;
      
      case 'settings':
        return <SettingsSection />;
      
      default:
        return (
          <Dashboard 
            orders={orders}
            onViewOrder={orderHandlers.handleViewOrder}
          />
        );
    }
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      pendingOrders={pendingOrders}
    >
      {/* CONTEÚDO PRINCIPAL DA ÁREA ADMINISTRATIVA */}
      {renderContent()}
      
      {/* DIÁLOGOS E MODAIS */}
      <ProductDialog
        open={openProductDialog}
        onClose={() => setOpenProductDialog(false)}
        product={editingProduct}
        categories={categories}
        onSave={productHandlers.handleSaveProduct}
      />
      
      {/* TODO: Implementar outros diálogos conforme necessário */}
    </AdminLayout>
  );
}

/**
 * COMPONENTE EXPORTADO COM PROTEÇÃO DE ROTA
 * 
 * Envolve o conteúdo administrativo com verificação de
 * autenticação e privilégios necessários.
 */
export default function AdminPage() {
  return (
    <AdminRoute>
      <AdminPageContent />
    </AdminRoute>
  );
}
