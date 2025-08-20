/**
 * DIÁLOGO DE VISUALIZAÇÃO DE CLIENTE
 * 
 * Componente responsável por exibir detalhes completos de um cliente
 * em formato somente leitura.
 * 
 * Funcionalidades:
 * - Exibição detalhada de informações do cliente
 * - Formatação de dados para melhor visualização
 * - Layout organizado por seções
 * - Informações de estatísticas de pedidos
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Avatar,
  Divider,
  IconButton
} from '@mui/material';
import {
  Close,
  Person,
  Phone,
  LocationOn,
  CalendarToday,
  ShoppingCart,
  WhatsApp,
  Edit,
  Delete,
  Email
} from '@mui/icons-material';

/**
 * FUNÇÃO: Formatar data para exibição
 * 
 * @param {string} dateString - Data em formato ISO
 * @returns {string} Data formatada em português
 */
const formatDate = (dateString) => {
  if (!dateString) return 'Não informado';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return 'Data inválida';
  }
};

/**
 * FUNÇÃO: Formatar data e hora para exibição
 * 
 * @param {string} dateString - Data em formato ISO
 * @returns {string} Data e hora formatada
 */
const formatDateTime = (dateString) => {
  if (!dateString) return 'Não informado';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', ' às');
  } catch {
    return 'Data inválida';
  }
};

/**
 * FUNÇÃO: Formatar telefone para exibição
 * 
 * @param {string} phone - Número de telefone
 * @returns {string} Telefone formatado
 */
const formatPhone = (phone) => {
  if (!phone) return 'Não informado';
  
  // Remove caracteres não numéricos
  const cleanPhone = phone.toString().replace(/\D/g, '');
  
  // Se for um número válido de celular brasileiro (11 dígitos)
  if (cleanPhone.length === 11) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
  }
  
  // Se for um número de telefone fixo (10 dígitos)
  if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
  }
  
  // Se não conseguir formatar, retorna como está
  return phone.toString();
};

/**
 * FUNÇÃO: Obter label do status
 * 
 * @param {string} status - Status do cliente
 * @returns {string} Label traduzido
 */
const getStatusLabel = (status) => {
  const statusMap = {
    active: 'Ativo',
    inactive: 'Inativo'
  };
  return statusMap[status] || status;
};

/**
 * FUNÇÃO: Obter cor do status
 * 
 * @param {string} status - Status do cliente
 * @returns {string} Cor do chip
 */
const getStatusColor = (status) => {
  const colorMap = {
    active: 'success',
    inactive: 'default'
  };
  return colorMap[status] || 'default';
};

/**
 * COMPONENTE PRINCIPAL - ClientViewDialog
 * 
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.open - Estado de abertura do diálogo
 * @param {Object} props.client - Dados do cliente a ser exibido
 * @param {Function} props.onClose - Callback para fechar diálogo
 * @param {Function} props.onEdit - Callback para editar cliente
 * @param {Function} props.onDelete - Callback para excluir cliente
 */
const ClientViewDialog = ({ open, client, onClose, onEdit, onDelete }) => {
  if (!client) return null;

  // Handler para tecla ESC
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }
      }}
    >
      {/* CABEÇALHO DO DIÁLOGO */}
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #e9ecef'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          👁️ Detalhes do Cliente
        </Typography>
        
        {/* Botão de fechar */}
        <IconButton 
          onClick={onClose} 
          size="small"
        >
          <Close />
        </IconButton>
      </DialogTitle>

      {/* CONTEÚDO DO DIÁLOGO */}
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* SEÇÃO: Informações Principais */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 3,
              p: 3,
              backgroundColor: '#f8f9fa',
              borderRadius: 2,
              mb: 2
            }}>
              {/* Avatar do cliente */}
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: '#667eea',
                fontSize: '2rem'
              }}>
                <Person sx={{ fontSize: '2.5rem' }} />
              </Avatar>

              {/* Informações básicas */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {client.name || 'Cliente sem nome'}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                  <Chip 
                    label={getStatusLabel(client.status)} 
                    color={getStatusColor(client.status)}
                    variant="outlined"
                  />
                  
                  <Typography variant="body2" color="text.secondary">
                    Cliente desde {formatDate(client.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* SEÇÃO: Contato */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box role="group" aria-labelledby="contact-section">
              <Typography id="contact-section" variant="h6" sx={{ mb: 2, color: '#2c3e50', fontWeight: 'bold' }}>
                📱 Contato
              </Typography>
              
              <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                {/* Email */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Email sx={{ color: '#1976d2' }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      Email:
                    </Typography>
                    <Typography variant="body2">
                      {client.email || 'Não informado'}
                    </Typography>
                  </Box>
                </Box>

                {/* WhatsApp */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <WhatsApp sx={{ color: '#25d366' }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      WhatsApp:
                    </Typography>
                    <Typography variant="body2">
                      {formatPhone(client.whatsapp || client.phone)}
                    </Typography>
                  </Box>
                </Box>

                {/* Telefone adicional (se diferente do WhatsApp) */}
                {client.phone && client.phone !== client.whatsapp && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Phone sx={{ color: '#666' }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        Telefone:
                      </Typography>
                      <Typography variant="body2">
                        {formatPhone(client.phone)}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>

          {/* SEÇÃO: Endereço */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box role="group" aria-labelledby="address-section">
              <Typography id="address-section" variant="h6" sx={{ mb: 2, color: '#2c3e50', fontWeight: 'bold' }}>
                📍 Endereço
              </Typography>
              
              <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <LocationOn sx={{ color: '#dc3545', mt: 0.5 }} />
                  <Box>
                    {/* Endereço principal */}
                    {client.street && client.number ? (
                      <>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {client.street}, {client.number}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {client.neighborhood || 'Não informado'} - {client.city || 'Não informado'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          CEP: {client.zipCode || 'Não informado'}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography variant="body2">
                          {client.address || 'Não informado'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Bairro: {client.neighborhood || 'Não informado'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Cidade: {client.city || 'Não informado'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          CEP: {client.zipCode || 'Não informado'}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* SEÇÃO: Estatísticas */}
          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 2 }} />
            <Box role="group" aria-labelledby="stats-section">
              <Typography id="stats-section" variant="h6" sx={{ mb: 2, color: '#2c3e50', fontWeight: 'bold' }}>
                📊 Estatísticas de Pedidos
              </Typography>
              
              <Grid container spacing={2}>
                {/* Total de pedidos */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: '#e3f2fd', 
                    borderRadius: 2,
                    textAlign: 'center'
                  }}>
                    <ShoppingCart sx={{ color: '#1976d2', fontSize: '2rem', mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                      {client.orderCount || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de pedidos
                    </Typography>
                  </Box>
                </Grid>

                {/* Último pedido */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: '#f3e5f5', 
                    borderRadius: 2,
                    textAlign: 'center'
                  }}>
                    <CalendarToday sx={{ color: '#7b1fa2', fontSize: '2rem', mb: 1 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#7b1fa2' }}>
                      {client.lastOrder ? formatDateTime(client.lastOrder) : 'Nunca'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Último pedido
                    </Typography>
                  </Box>
                </Grid>

                {/* Valor total */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: '#e8f5e8', 
                    borderRadius: 2,
                    textAlign: 'center'
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                      R$ {(client.totalValue || 0).toLocaleString('pt-BR', { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2 
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Valor total em pedidos
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      {/* AÇÕES DO DIÁLOGO */}
      <DialogActions sx={{ 
        p: 3, 
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e9ecef',
        justifyContent: 'space-between'
      }}>
        {/* Botões de ação */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {onEdit && (
            <Button 
              onClick={() => onEdit(client)}
              variant="contained"
              color="primary"
              sx={{ px: 3 }}
              aria-label="Editar cliente"
              startIcon={<Edit />}
            >
              Editar
            </Button>
          )}
          {onDelete && (
            <Button 
              onClick={() => onDelete(client)}
              variant="contained"
              color="error"
              sx={{ px: 3 }}
              aria-label="Excluir cliente"
              startIcon={<Delete />}
            >
              Excluir
            </Button>
          )}
        </Box>
        
        {/* Botão fechar */}
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ px: 3 }}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClientViewDialog;
