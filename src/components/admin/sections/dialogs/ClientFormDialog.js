/**
 * @fileoverview Dialog de Formulário de Cliente
 * @description Componente responsável pelo formulário de criação e edição de clientes
 * @author Sistema de Gestão de Cardápio
 * @version 1.0.0 - Modularização do ClientsSection
 */

'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

/**
 * Componente do dialog de formulário para criar/editar clientes
 */
const ClientFormDialog = ({
  open,
  onClose,
  formData,
  setFormData,
  editingClient,
  onSave
}) => {

  /**
   * Handler para salvar cliente
   */
  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  /**
   * Atualiza campo do formulário
   */
  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
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
              value={formData.name || ''}
              onChange={(e) => updateField('name', e.target.value)}
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
              value={formData.whatsapp || ''}
              onChange={(e) => updateField('whatsapp', e.target.value)}
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
                value={formData.status || 'active'}
                label="Status"
                onChange={(e) => updateField('status', e.target.value)}
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
                <MenuItem value="active">Ativo</MenuItem>
                <MenuItem value="inactive">Inativo</MenuItem>
                <MenuItem value="pending">Pendente</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Endereço - Rua */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Rua/Avenida"
              fullWidth
              value={formData.street || ''}
              onChange={(e) => updateField('street', e.target.value)}
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

          {/* Endereço - Número */}
          <Grid size={{ xs: 12, sm: 2 }}>
            <TextField
              label="Número"
              fullWidth
              value={formData.number || ''}
              onChange={(e) => updateField('number', e.target.value)}
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

          {/* Endereço - Bairro */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Bairro"
              fullWidth
              value={formData.neighborhood || ''}
              onChange={(e) => updateField('neighborhood', e.target.value)}
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
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Cidade"
              fullWidth
              value={formData.city || ''}
              onChange={(e) => updateField('city', e.target.value)}
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

          {/* Referência */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Ponto de Referência"
              fullWidth
              value={formData.reference || ''}
              onChange={(e) => updateField('reference', e.target.value)}
              placeholder="Ex: Próximo ao mercado, em frente à escola..."
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
          onClick={onClose}
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
          onClick={handleSave} 
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
  );
};

export default ClientFormDialog;
