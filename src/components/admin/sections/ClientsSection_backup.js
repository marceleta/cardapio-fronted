/**
 * SEÇÃO DE CLIENTES - PAINEL ADMINISTRATIVO
 * 
 * Componente responsável por gerenciar a exibição e interação com clientes.
 * Inclui funcionalidades de busca, CRUD de clientes e integração com API.
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

// Importações do Material-UI - Componentes de interface
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

// Importações do Material-UI - Ícones
import {
  Add,
  Search,
  Edit,
  Delete,
  Visibility,
  Person,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';

// Importações de utilitários e API
import { filterClients } from '../../../utils/adminHelpers';
import { clientsAPI } from '../../../lib/api';

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
  const [editingClient, setEditingClient] = React.useState(null);
  const [viewingClient, setViewingClient] = React.useState(null);
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
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 4 }}>
        👥 Gerenciar Clientes
      </Typography>

      {/* Cabeçalho da seção com busca e botão de adicionar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          🧑‍💼 Clientes ({filteredClients.length})
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Buscar clientes..."
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
            sx={{ minWidth: 250 }}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddClient}
            sx={{ 
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 3px 10px rgba(102, 126, 234, 0.3)'
            }}
          >
            Novo Cliente
          </Button>
        </Box>
      </Box>

      {/* TABELA DE CLIENTES */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Contato</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Localização</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Pedidos</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: 200 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow 
                key={client.id}
                sx={{ 
                  '&:hover': { backgroundColor: '#f8f9fa' },
                  transition: 'background-color 0.2s'
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#667eea' }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {client.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cliente desde {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone fontSize="small" color="action" />
                      <Typography variant="body2">{client.whatsapp || client.phone}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Box>
                      <Typography variant="body2">
                        {client.street ? `${client.street}, ${client.number}` : client.address}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {client.neighborhood && `${client.neighborhood} - `}{client.city}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={getStatusLabel(client.status)} 
                    size="small" 
                    color={getStatusColor(client.status)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#27ae60' }}>
                    {client.orderCount || 0}
                  </Typography>
                  {client.lastOrder && (
                    <Typography variant="caption" color="text.secondary">
                      Último: {new Date(client.lastOrder).toLocaleDateString('pt-BR')}
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Tooltip title="Visualizar">
                      <IconButton
                        size="small"
                        onClick={() => handleViewClient(client)}
                        sx={{ 
                          color: '#3498db',
                          '&:hover': { backgroundColor: 'rgba(52, 152, 219, 0.1)' }
                        }}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => handleEditClient(client)}
                        sx={{ 
                          color: '#f39c12',
                          '&:hover': { backgroundColor: 'rgba(243, 156, 18, 0.1)' }
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClient(client.id)}
                        sx={{ 
                          color: '#e74c3c',
                          '&:hover': { backgroundColor: 'rgba(231, 76, 60, 0.1)' }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ESTADO VAZIO - NENHUM CLIENTE ENCONTRADO */}
      {filteredClients.length === 0 && (
        <Paper sx={{ 
          p: 4, 
          textAlign: 'center', 
          mt: 3,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            🔍 Nenhum cliente encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm 
              ? 'Tente ajustar os filtros de busca' 
              : 'Adicione seu primeiro cliente clicando no botão "Novo Cliente"'
            }
          </Typography>
        </Paper>
      )}

      {/* DIÁLOGO DE CRIAR/EDITAR CLIENTE */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          py: 3,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }
        }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              {editingClient ? '✏️ Editar Cliente' : '➕ Novo Cliente'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {editingClient 
                ? 'Atualize as informações do cliente'
                : 'Preencha os dados para cadastrar um novo cliente'
              }
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 4, backgroundColor: '#fafafa', mt: 0 }}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Nome do Cliente */}
            <Grid size={12}>              
              <TextField
                label="Nome Completo"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                    },
                  },
                }}
              />
            </Grid>
            
            {/* WhatsApp */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="WhatsApp"
                fullWidth
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                required
                placeholder="(11) 99999-9999"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                    },
                  },
                }}
              />
            </Grid>
            
            {/* Status */}
            <Grid size={{ xs: 12, sm: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                    },
                  }}
                >
                  <MenuItem value="active">✅ Ativo</MenuItem>
                  <MenuItem value="inactive">❌ Inativo</MenuItem>
                  <MenuItem value="pending">⏳ Pendente</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* CEP */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="CEP"
                required
                fullWidth
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                placeholder="00000-000"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                    },
                  },
                }}
              />
            </Grid>

            {/* Endereço */}
            <Grid size={12}>
            </Grid>
            
            {/* Rua */}
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                label="Rua/Avenida"
                fullWidth
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                placeholder="Rua das Flores"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                    },
                  },
                }}
              />
            </Grid>
            
            {/* Número */}
            <Grid size={{ xs: 12, sm: 2 }}>
              <TextField
                label="Número"
                fullWidth
                required
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                placeholder="123"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                    },
                  },
                }}
              />
            </Grid>
            
            {/* Bairro */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Bairro"
                fullWidth
                required
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                placeholder="Centro"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                    },
                  },
                }}
              />
            </Grid>
            
            {/* Cidade */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Cidade"
                fullWidth
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="São Paulo"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 3, 
          backgroundColor: 'white',
          borderTop: '1px solid #e0e0e0',
          gap: 2
        }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              px: 3,
              py: 1,
              borderColor: '#ddd',
              color: '#666',
              '&:hover': {
                borderColor: '#bbb',
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveClient} 
            variant="contained"
            disabled={!formData.name || !formData.whatsapp}
            sx={{ 
              borderRadius: 2,
              px: 4,
              py: 1,
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
              },
              '&:disabled': {
                background: '#ddd',
                color: '#999'
              }
            }}
          >
            {editingClient ? '💾 Atualizar' : '➕ Criar Cliente'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIÁLOGO DE VISUALIZAÇÃO DO CLIENTE */}
      <Dialog 
        open={openViewDialog} 
        onClose={() => setOpenViewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          👁️ Detalhes do Cliente
        </DialogTitle>
        <DialogContent>
          {viewingClient && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid size={12} sx={{ textAlign: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#667eea', width: 60, height: 60, mx: 'auto', mb: 1 }}>
                    <Person fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {viewingClient.name}
                  </Typography>
                  <Chip 
                    label={getStatusLabel(viewingClient.status)} 
                    size="small" 
                    color={getStatusColor(viewingClient.status)}
                    variant="outlined"
                  />
                </Grid>
                <Grid size={12}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    📞 Informações de Contato
                  </Typography>
                  <Typography variant="body2"><strong>WhatsApp:</strong> {viewingClient.whatsapp || viewingClient.phone}</Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    📍 Endereço Completo
                  </Typography>
                  <Typography variant="body2">
                    <strong>Rua:</strong> {viewingClient.street || 'Não informado'}
                    {viewingClient.number && `, ${viewingClient.number}`}
                  </Typography>
                  <Typography variant="body2"><strong>Bairro:</strong> {viewingClient.neighborhood || 'Não informado'}</Typography>
                  <Typography variant="body2"><strong>Cidade:</strong> {viewingClient.city || 'Não informada'}</Typography>
                  <Typography variant="body2"><strong>CEP:</strong> {viewingClient.zipCode || 'Não informado'}</Typography>
                  {viewingClient.address && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      <em>Endereço original: {viewingClient.address}</em>
                    </Typography>
                  )}
                </Grid>
                <Grid size={12}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    📊 Estatísticas
                  </Typography>
                  <Typography variant="body2"><strong>Total de pedidos:</strong> {viewingClient.orderCount || 0}</Typography>
                  <Typography variant="body2"><strong>Cliente desde:</strong> {new Date(viewingClient.createdAt).toLocaleDateString('pt-BR')}</Typography>
                  {viewingClient.lastOrder && (
                    <Typography variant="body2"><strong>Último pedido:</strong> {new Date(viewingClient.lastOrder).toLocaleDateString('pt-BR')}</Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>
            Fechar
          </Button>
          <Button 
            onClick={() => {
              setOpenViewDialog(false);
              handleEditClient(viewingClient);
            }} 
            variant="contained"
            startIcon={<Edit />}
          >
            Editar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Exportação padrão do componente
export default ClientsSection;
