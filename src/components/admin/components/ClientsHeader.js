/**
 * CABEÇALHO DE CLIENTES - CONTROLES E INFORMAÇÕES
 * 
 * Componente responsável por renderizar o cabeçalho da seção de clientes
 * com título, contador, campo de busca e botão de adicionar.
 * 
 * Funcionalidades:
 * - Exibição de título e contador de clientes
 * - Campo de busca em tempo real
 * - Botão para adicionar novo cliente
 * - Layout responsivo
 */

import React from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Add,
  Search
} from '@mui/icons-material';

/**
 * COMPONENTE PRINCIPAL - ClientsHeader
 * 
 * @param {Object} props - Propriedades do componente
 * @param {number} props.clientsCount - Quantidade total de clientes
 * @param {string} props.searchTerm - Termo atual de busca
 * @param {Function} props.onSearchChange - Callback para mudança na busca
 * @param {Function} props.onAddClient - Callback para adicionar cliente
 */
const ClientsHeader = ({ 
  clientsCount = 0, 
  searchTerm = '', 
  onSearchChange, 
  onAddClient 
}) => {
  /**
   * FUNÇÃO: Manipular mudança no campo de busca
   * 
   * @param {Object} event - Evento de mudança do input
   */
  const handleSearchChange = (event) => {
    const value = event.target.value;
    onSearchChange(value);
  };

  return (
    <>
      {/* TÍTULO PRINCIPAL */}
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 'bold', 
          color: '#2c3e50',
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        👥 Gerenciar Clientes
      </Typography>

      {/* CONTAINER DE CONTROLES */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        {/* CONTADOR DE CLIENTES */}
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#34495e',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          🧑‍💼 Clientes ({clientsCount})
        </Typography>

        {/* CONTAINER DE AÇÕES */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* CAMPO DE BUSCA */}
          <TextField
            size="small"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ 
              minWidth: 250,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#667eea',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#667eea',
                }
              }
            }}
          />

          {/* BOTÃO DE ADICIONAR CLIENTE */}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAddClient}
            sx={{ 
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 3px 10px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              },
              px: 3,
              py: 1.2,
              borderRadius: 2
            }}
          >
            Novo Cliente
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default ClientsHeader;
