/**
 * @fileoverview Hook para Gerenciamento de Estado dos Clientes
 * @description Hook customizado que centraliza toda a lógica de estado e operações CRUD dos clientes
 * @author Sistema de Gestão de Cardápio
 * @version 2.1.0 - Seguindo padrões do CODING_STANDARDS.md com API modernizada
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { clientsAPI } from '../lib/api';
import { toast } from 'react-toastify';

/**
 * Hook customizado para gerenciamento completo dos clientes
 * Centraliza todo o estado e lógica de negócio seguindo padrões do CODING_STANDARDS.md
 * 
 * @returns {Object} Objeto com estados e funções para gerenciamento de clientes
 */
function useClientsManager() {
  
  // ================================
  // ESTADOS PRINCIPAIS
  // ================================
  
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados dos dialogs
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Estados dos clientes selecionados
  const [editingClient, setEditingClient] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  // ================================
  // EFEITOS
  // ================================
  
  /**
   * Carrega clientes na inicialização
   */
  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        const data = await clientsAPI.getAll();
        setClients(data);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        toast.error('Erro ao carregar clientes');
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  // ================================
  // COMPUTAÇÕES DERIVADAS
  // ================================
  
  /**
   * Lista filtrada de clientes baseada no termo de busca
   */
  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    
    const term = searchTerm.toLowerCase();
    return clients.filter(client => 
      client.name?.toLowerCase().includes(term) ||
      client.email?.toLowerCase().includes(term) ||
      client.phone?.includes(term)
    );
  }, [clients, searchTerm]);

  // ================================
  // FUNÇÕES UTILITÁRIAS
  // ================================
  
  /**
   * Recarrega a lista de clientes
   */
  const reloadClients = async () => {
    try {
      const data = await clientsAPI.getAll();
      setClients(data);
    } catch (error) {
      console.error('Erro ao recarregar clientes:', error);
      toast.error('Erro ao carregar clientes');
    }
  };

  // ================================
  // HANDLERS DOS DIALOGS
  // ================================
  
  /**
   * Abre dialog para criar novo cliente
   */
  const handleCreate = () => {
    setEditingClient(null);
    setIsFormDialogOpen(true);
  };

  /**
   * Abre dialog de visualização para um cliente
   */
  const handleView = (client) => {
    setSelectedClient(client);
    setIsViewDialogOpen(true);
  };

  /**
   * Abre dialog de edição para um cliente
   */
  const handleEdit = (client) => {
    setEditingClient(client);
    setIsFormDialogOpen(true);
  };

  /**
   * Prepara dialog de confirmação para exclusão
   */
  const handleDeleteClick = (client) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };

  /**
   * Fecha dialog de formulário
   */
  const handleCloseFormDialog = () => {
    setIsFormDialogOpen(false);
    setEditingClient(null);
  };

  /**
   * Fecha dialog de visualização
   */
  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false);
    setSelectedClient(null);
  };

  /**
   * Fecha dialog de exclusão
   */
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedClient(null);
  };

  // ================================
  // OPERAÇÕES CRUD
  // ================================
  
  /**
   * Submete formulário (criar novo ou atualizar existente)
   */
  const handleSubmit = async (formData) => {
    try {
      if (editingClient) {
        // Atualizar cliente existente
        const updatedClient = await clientsAPI.update(editingClient.id, formData);
        
        setClients(prevClients => 
          prevClients.map(client => 
            client.id === editingClient.id ? updatedClient : client
          )
        );
        
        toast.success('Cliente atualizado com sucesso!');
      } else {
        // Criar novo cliente
        const newClient = await clientsAPI.create(formData);
        
        setClients(prevClients => [...prevClients, newClient]);
        
        toast.success('Cliente criado com sucesso!');
      }
      
      handleCloseFormDialog();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      
      if (editingClient) {
        toast.error('Erro ao atualizar cliente');
      } else {
        toast.error('Erro ao criar cliente');
      }
    }
  };

  /**
   * Confirma e executa exclusão do cliente
   */
  const handleDelete = async (clientId) => {
    try {
      await clientsAPI.delete(clientId);
      
      setClients(prevClients => 
        prevClients.filter(client => client.id !== clientId)
      );
      
      toast.success('Cliente excluído com sucesso!');
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      toast.error('Erro ao excluir cliente');
    }
  };

  // ================================
  // INTERFACE PÚBLICA DO HOOK
  // ================================
  
  return {
    // Estados dos dados
    clients,
    filteredClients,
    loading,
    
    // Estados de busca
    searchTerm,
    setSearchTerm,
    
    // Estados dos dialogs
    isFormDialogOpen,
    isViewDialogOpen,
    isDeleteDialogOpen,
    
    // Estados dos clientes selecionados
    editingClient,
    selectedClient,
    
    // Funções utilitárias
    reloadClients,
    
    // Handlers dos dialogs
    handleCreate,
    handleView,
    handleEdit,
    handleDeleteClick,
    handleCloseFormDialog,
    handleCloseViewDialog,
    handleCloseDeleteDialog,
    
    // Operações CRUD
    handleSubmit,
    handleDelete
  };
}

export default useClientsManager;
