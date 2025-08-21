/**
 * TESTE BÁSICO DO SETTINGS SECTION
 * Versão simplificada para diagnóstico
 */

import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { Business as BusinessIcon } from '@mui/icons-material';

const SettingsSection = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <BusinessIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Configurações da Empresa - Teste
          </Typography>
        </Box>
        
        <Typography variant="body1" color="text.secondary">
          Versão de teste para diagnosticar problemas.
        </Typography>
      </Paper>
    </Container>
  );
};

export default SettingsSection;
