/**
 * @fileoverview Header da Seção de Clientes
 * @description Componente responsável pelo cabeçalho com título, contador, busca e botão de adicionar
 * @author Sistema de Gestão de Cardápio
 * @version 1.0.0 - Modularização do ClientsSection
 */

'use client';

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
 * Componente Header da seção de clientes
 * Contém título, contador, campo de busca e botão de adicionar
 */
const ClientsHeader = ({
  searchTerm,
  onSearchChange,
  onAddClient,
  clientsCount,
  totalClients
}) => {
  return (
    <Box>
      {/* Título principal */}
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 4 }}>
        👥 Gerenciar Clientes
      </Typography>

      {/* Cabeçalho da seção com busca e botão de adicionar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          🧑‍💼 Clientes ({clientsCount})
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Buscar clientes..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
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
            onClick={onAddClient}
            sx={{ 
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 3px 10px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)',
                boxShadow: '0 5px 15px rgba(102, 126, 234, 0.4)'
              }
            }}
          >
            Adicionar Cliente
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ClientsHeader;
