/**
 * DIÁLOGO DE FORMULÁRIO DE CLIENTE
 * 
 * Componente responsável por renderizar o formulário de criação/edição
 * de clientes em um diálogo modal.
 * 
 * Funcionalidades:
 * - Formulário para dados básicos do cliente
 * - Validação de campos obrigatórios
 * - Modo criação e edição
 * - Layout responsivo
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import {
  Close,
  Save,
  Cancel
} from '@mui/icons-material';

/**
 * COMPONENTE PRINCIPAL - ClientFormDialog
 * 
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.open - Estado de abertura do diálogo
 * @param {Object} props.formData - Dados do formulário
 * @param {Object} props.editingClient - Cliente sendo editado (null para novo)
 * @param {boolean} props.loading - Estado de carregamento
 * @param {string} props.error - Mensagem de erro
 * @param {Function} props.onClose - Callback para fechar diálogo
 * @param {Function} props.onSave - Callback para salvar cliente
 * @param {Function} props.onFormChange - Callback para mudanças no formulário
 */
const ClientFormDialog = ({ 
  open, 
  formData, 
  editingClient, 
  loading, 
  error,
  onClose, 
  onSave, 
  onFormChange 
}) => {
  /**
   * FUNÇÃO: Manipular mudança em campos do formulário
   * 
   * @param {string} field - Nome do campo
   * @param {any} value - Novo valor
   */
  const handleFieldChange = (field) => (event) => {
    const value = event.target.value;
    onFormChange(field, value);
  };

  /**
   * FUNÇÃO: Validar se formulário pode ser salvo
   * 
   * @returns {boolean} True se pode salvar
   */
  const canSave = () => {
    return formData.name.trim() && formData.whatsapp.trim() && !loading;
  };

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
          {editingClient ? '✏️ Editar Cliente' : '👤 Adicionar Novo Cliente'}
        </Typography>
        
        {/* Botão de fechar */}
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      {/* CONTEÚDO DO DIÁLOGO */}
      <DialogContent sx={{ p: 3 }}>
        {/* Mensagem de erro */}
        {error && (
          <Box sx={{ 
            mb: 2, 
            p: 2, 
            backgroundColor: '#ffebee', 
            borderRadius: 2,
            border: '1px solid #ffcdd2'
          }}>
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          </Box>
        )}

        <Grid container spacing={3}>
          {/* SEÇÃO: Informações Básicas */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#2c3e50', fontWeight: 'bold' }}>
              📋 Informações Básicas
            </Typography>
          </Grid>

          {/* Nome completo */}
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              label="Nome Completo"
              value={formData.name}
              onChange={handleFieldChange('name')}
              required
              variant="outlined"
              placeholder="Digite o nome completo do cliente"
              disabled={loading}
            />
          </Grid>

          {/* Status */}
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth disabled={loading}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={handleFieldChange('status')}
                label="Status"
              >
                <MenuItem value="active">Ativo</MenuItem>
                <MenuItem value="inactive">Inativo</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* SEÇÃO: Contato */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#2c3e50', fontWeight: 'bold' }}>
              📱 Contato
            </Typography>
          </Grid>

          {/* WhatsApp */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="WhatsApp"
              value={formData.whatsapp}
              onChange={handleFieldChange('whatsapp')}
              required
              variant="outlined"
              placeholder="(11) 99999-9999"
              disabled={loading}
              helperText="Número principal para contato via WhatsApp"
            />
          </Grid>

          {/* SEÇÃO: Endereço */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#2c3e50', fontWeight: 'bold' }}>
              📍 Endereço
            </Typography>
          </Grid>

          {/* Rua */}
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              label="Rua/Avenida"
              value={formData.street}
              onChange={handleFieldChange('street')}
              variant="outlined"
              placeholder="Nome da rua ou avenida"
              disabled={loading}
            />
          </Grid>

          {/* Número */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Número"
              value={formData.number}
              onChange={handleFieldChange('number')}
              variant="outlined"
              placeholder="123"
              disabled={loading}
            />
          </Grid>

          {/* Bairro */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Bairro"
              value={formData.neighborhood}
              onChange={handleFieldChange('neighborhood')}
              variant="outlined"
              placeholder="Nome do bairro"
              disabled={loading}
            />
          </Grid>

          {/* Cidade */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Cidade"
              value={formData.city}
              onChange={handleFieldChange('city')}
              variant="outlined"
              placeholder="Nome da cidade"
              disabled={loading}
            />
          </Grid>

          {/* CEP */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="CEP"
              value={formData.zipCode}
              onChange={handleFieldChange('zipCode')}
              variant="outlined"
              placeholder="00000-000"
              disabled={loading}
            />
          </Grid>
        </Grid>
      </DialogContent>

      {/* AÇÕES DO DIÁLOGO */}
      <DialogActions sx={{ 
        p: 3, 
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e9ecef',
        gap: 1
      }}>
        {/* Botão cancelar */}
        <Button 
          onClick={onClose}
          startIcon={<Cancel />}
          disabled={loading}
          sx={{ color: '#6c757d' }}
        >
          Cancelar
        </Button>

        {/* Botão salvar */}
        <Button 
          onClick={onSave}
          variant="contained"
          startIcon={<Save />}
          disabled={!canSave()}
          sx={{
            background: 'linear-gradient(45deg, #28a745 30%, #20c997 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #218838 30%, #1da085 90%)',
            }
          }}
        >
          {loading ? 'Salvando...' : (editingClient ? 'Atualizar' : 'Criar Cliente')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClientFormDialog;
