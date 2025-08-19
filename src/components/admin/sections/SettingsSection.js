'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper
} from '@mui/material';

const SettingsSection = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
        ⚙️ Configurações
      </Typography>
      <Paper sx={{ 
        p: 4, 
        textAlign: 'center',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#7f8c8d' }}>
          🚧 Em desenvolvimento...
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Esta seção estará disponível em breve com opções de configuração do restaurante.
        </Typography>
      </Paper>
    </Box>
  );
};

export default SettingsSection;
