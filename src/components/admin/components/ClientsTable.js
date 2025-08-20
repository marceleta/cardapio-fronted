/**
 * TABELA DE CLIENTES - COMPONENTE DE EXIBIÇÃO
 * 
 * Componente responsável por renderizar a tabela de clientes com
 * informações formatadas e ações disponíveis.
 * 
 * Funcionalidades:
 * - Exibição responsiva de dados de clientes
 * - Formatação de datas e valores
 * - Ações de visualizar, editar e excluir
 * - Indicadores visuais de status
 */

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Tooltip,
  Paper,
  Typography,
  Box,
  Chip,
  Skeleton
} from '@mui/material';
import {
  Person,
  Phone,
  LocationOn,
  Visibility,
  Edit,
  Delete
} from '@mui/icons-material';

/**
 * FUNÇÃO: Formatar status para exibição
 * 
 * @param {string} status - Status do cliente
 * @returns {string} Label traduzido do status
 */
const getStatusLabel = (status) => {
  const statusMap = {
    active: 'Ativo',
    inactive: 'Inativo'
  };
  return statusMap[status] || status;
};

/**
 * FUNÇÃO: Obter cor do chip de status
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
 * FUNÇÃO: Formatar telefone para exibição
 * 
 * @param {string} phone - Número de telefone
 * @returns {string} Telefone formatado
 */
const formatPhone = (phone) => {
  if (!phone) return '';
  const numbers = phone.replace(/\D/g, '');
  if (numbers.length === 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  }
  return phone;
};

/**
 * COMPONENTE PRINCIPAL - ClientsTable
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.clients - Lista de clientes para exibição
 * @param {boolean} props.loading - Estado de carregamento
 * @param {Function} props.onView - Callback para visualizar cliente
 * @param {Function} props.onEdit - Callback para editar cliente
 * @param {Function} props.onDeleteClick - Callback para excluir cliente
 */
const ClientsTable = ({ 
  clients = [], 
  loading = false,
  onView, 
  onEdit, 
  onDeleteClick 
}) => {
  /**
   * FUNÇÃO: Renderizar mensagem quando não há clientes
   */
  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Nenhum cliente encontrado
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Comece criando seu primeiro cliente!
        </Typography>
      </TableCell>
    </TableRow>
  );

  /**
   * FUNÇÃO: Renderizar skeleton durante carregamento
   */
  const renderSkeleton = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index} data-testid="client-skeleton">
        <TableCell><Skeleton variant="text" width="60%" /></TableCell>
        <TableCell><Skeleton variant="text" width="70%" /></TableCell>
        <TableCell><Skeleton variant="text" width="50%" /></TableCell>
        <TableCell><Skeleton variant="text" width="40%" /></TableCell>
        <TableCell><Skeleton variant="text" width="30%" /></TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
        </TableCell>
      </TableRow>
    ));
  };

  /**
   * FUNÇÃO: Renderizar linha de cliente
   * 
   * @param {Object} client - Dados do cliente
   */
  const renderClientRow = (client) => (
    <TableRow 
      key={client.id}
      sx={{ 
        '&:hover': { backgroundColor: '#f8f9fa' },
        transition: 'background-color 0.2s'
      }}
    >
      {/* COLUNA: Nome */}
      <TableCell>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {client.name}
        </Typography>
      </TableCell>

      {/* COLUNA: Email */}
      <TableCell>
        <Typography variant="body2">
          {client.email}
        </Typography>
      </TableCell>

      {/* COLUNA: Telefone */}
      <TableCell>
        <Typography variant="body2">
          {formatPhone(client.phone)}
        </Typography>
      </TableCell>

      {/* COLUNA: Cidade */}
      <TableCell>
        <Typography variant="body2">
          {client.city}
        </Typography>
      </TableCell>

      {/* COLUNA: Data de Cadastro */}
      <TableCell>
        <Typography variant="body2">
          {client.createdAt ? (
            new Date(client.createdAt).toString() !== 'Invalid Date' 
              ? new Date(client.createdAt).toLocaleDateString('pt-BR')
              : 'Data inválida'
          ) : 'Data inválida'}
        </Typography>
      </TableCell>

      {/* COLUNA: Ações */}
      <TableCell>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Botão de visualizar */}
          <Tooltip title="Visualizar detalhes">
            <IconButton 
              size="small" 
              onClick={() => onView(client)}
              sx={{ color: '#667eea' }}
              aria-label={`Visualizar cliente ${client.name}`}
            >
              <Visibility />
            </IconButton>
          </Tooltip>

          {/* Botão de editar */}
          <Tooltip title="Editar cliente">
            <IconButton 
              size="small" 
              onClick={() => onEdit(client)}
              sx={{ color: '#4caf50' }}
              aria-label={`Editar cliente ${client.name}`}
            >
              <Edit />
            </IconButton>
          </Tooltip>

          {/* Botão de excluir */}
          <Tooltip title="Excluir cliente">
            <IconButton 
              size="small" 
              onClick={() => onDeleteClick(client)}
              sx={{ color: '#f44336' }}
              aria-label={`Excluir cliente ${client.name}`}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      <Table>
        {/* CABEÇALHO DA TABELA */}
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Telefone</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Cidade</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Data de Cadastro</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: 200 }}>Ações</TableCell>
          </TableRow>
        </TableHead>

        {/* CORPO DA TABELA */}
        <TableBody>
          {loading ? (
            renderSkeleton()
          ) : clients.length === 0 ? (
            renderEmptyState()
          ) : (
            clients.map(renderClientRow)
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClientsTable;
