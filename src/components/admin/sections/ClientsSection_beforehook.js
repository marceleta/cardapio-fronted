/**
 * SEÇÃO DE CLIENTES - PAINEL ADMINISTRATIVO
 * 
 * Componente responsável por gerenciar a exibição e interação com clientes.
 * Inclui funcionalid  // Função para excluir cliente (abre dialog de confirmação)
  const handleDeleteClient = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setDeletingClient(client);
      setOpenDeleteDialog(true);
    }
  };

  // Função para confirmar exclusão
  const confirmDeleteClient = async (clientId) => {
    try {
      await clientsAPI.delete(clientId);
      setClients(prevClients => 
        prevClients.filter(client => client.id !== clientId)
      );
      setOpenDeleteDialog(false);
      setDeletingClient(null);
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      // Aqui você pode adicionar notificação de erro
    }
  }; CRUD de clientes e integração com API.
 * 
 * Funcionalidades:
 * - Listagem de clientes em tabela responsiva
 * - Sistema de busca em tempo real
 * - Ações de visualizar/editar/excluir clientes
 * - Interface para adicionar novos clientes
 * - API preparada para integração com backend
 */

'use client';

import React from 'react';

// Importação do componente modular
import ClientsHeader from './components/ClientsHeader';
import ClientsTable from './components/ClientsTable';
import ClientFormDialog from './dialogs/ClientFormDialog';
import ClientViewDialog from './dialogs/ClientViewDialog';
import ClientDeleteDialog from './dialogs/ClientDeleteDialog';

// Importação do hook customizado
import useClientsManager from '../../../hooks/useClientsManager';

// Importações do Material-UI - Componentes de interface
import {
  Box
} from '@mui/material';

// Importação do hook customizado
import useClientsManager from '../../../hooks/useClientsManager';

/**
 * COMPONENTE PRINCIPAL - SEÇÃO DE CLIENTES
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.clients - Lista de clientes para exibição
 * @param {Function} props.setClients - Função para atualizar lista de clientes
 * @param {string} props.searchTerm - Termo atual de busca
 * @param {Function} props.setSearchTerm - Função para atualizar termo de busca
 */
const ClientsSection = ({ 
  clients = [], 
  setClients,
  searchTerm = '', 
  setSearchTerm
}) => {
  // Estados para controle de diálogos e formulários
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openViewDialog, setOpenViewDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [editingClient, setEditingClient] = React.useState(null);
  const [viewingClient, setViewingClient] = React.useState(null);
  const [deletingClient, setDeletingClient] = React.useState(null);
  const [formData, setFormData] = React.useState({
    name: '',
    whatsapp: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    zipCode: '',
    status: 'active'
  });

  // Filtragem de clientes baseada no termo de busca
  const filteredClients = filterClients(clients, searchTerm);

  // Função para resetar formulário
  const resetForm = () => {
    setFormData({
      name: '',
      whatsapp: '',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      zipCode: '',
      status: 'active'
    });
    setEditingClient(null);
  };

  // Função para abrir diálogo de adição
  const handleAddClient = () => {
    resetForm();
    setOpenDialog(true);
  };

  // Função para abrir diálogo de edição
  const handleEditClient = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name || '',
      whatsapp: client.whatsapp || client.phone || '',
      street: client.street || '',
      number: client.number || '',
      neighborhood: client.neighborhood || '',
      city: client.city || '',
      zipCode: client.zipCode || '',
      status: client.status || 'active'
    });
    setOpenDialog(true);
  };

  // Função para visualizar cliente
  const handleViewClient = (client) => {
    setViewingClient(client);
    setOpenViewDialog(true);
  };

  // Função para salvar cliente (criar ou editar)
  const handleSaveClient = async () => {
    try {
      if (editingClient) {
        // Atualizar cliente existente
        const updatedClient = { ...editingClient, ...formData };
        await clientsAPI.update(editingClient.id, updatedClient);
        
        setClients(prevClients => 
          prevClients.map(client => 
            client.id === editingClient.id ? updatedClient : client
          )
        );
      } else {
        // Criar novo cliente
        const newClient = {
          ...formData,
          id: Date.now(), // ID temporário até integração com backend
          createdAt: new Date().toISOString(),
          orderCount: 0,
          lastOrder: null,
          // Compatibilidade com campos antigos
          phone: formData.whatsapp,
          address: `${formData.street}, ${formData.number} - ${formData.neighborhood}`
        };
        
        await clientsAPI.create(newClient);
        setClients(prevClients => [...prevClients, newClient]);
      }
      
      setOpenDialog(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      // Aqui você pode adicionar notificação de erro
    }
  };

  // Função para excluir cliente
  const handleDeleteClient = async (clientId) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await clientsAPI.delete(clientId);
        setClients(prevClients => 
          prevClients.filter(client => client.id !== clientId)
        );
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        // Aqui você pode adicionar notificação de erro
      }
    }
  };

  // Função para obter cor do status
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  // Função para obter label do status
  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  return (
    <Box>
      {/* Header modular com título, busca e ações */}
      <ClientsHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClient={handleAddClient}
        clientsCount={filteredClients.length}
        totalClients={clients.length}
      />

      {/* TABELA DE CLIENTES MODULAR */}
      <ClientsTable
        clients={filteredClients}
        onView={handleViewClient}
        onEdit={handleEditClient}
        onDelete={handleDeleteClient}
        loading={false}
      />

      {/* DIÁLOGO DE CRIAR/EDITAR CLIENTE MODULAR */}
      <ClientFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        formData={formData}
        setFormData={setFormData}
        editingClient={editingClient}
        onSave={handleSaveClient}
      />

      {/* DIÁLOGO DE VISUALIZAÇÃO DO CLIENTE MODULAR */}
      <ClientViewDialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        client={viewingClient}
        onEdit={handleEditClient}
      />

      {/* DIÁLOGO DE CONFIRMAÇÃO DE EXCLUSÃO MODULAR */}
      <ClientDeleteDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setDeletingClient(null);
        }}
        client={deletingClient}
        onConfirm={confirmDeleteClient}
        loading={false}
      />
    </Box>
  );
};

// Exportação padrão do componente
export default ClientsSection;
