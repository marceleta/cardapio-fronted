import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Divider,
  Alert
} from '@mui/material';

const NewSaleDialog = ({ open, onClose, onConfirm, products = [], tables = [] }) => {
  const [selectedTable, setSelectedTable] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [observations, setObservations] = useState('');
  const [saleType, setSaleType] = useState('dine_in'); // dine_in, takeaway, delivery

  const handleConfirm = () => {
    const saleData = {
      table: selectedTable || null,
      customer: {
        name: customerName,
        phone: customerPhone
      },
      observations,
      type: saleType,
      items: [],
      timestamp: new Date(),
      status: 'active'
    };

    onConfirm(saleData);
    handleClose();
  };

  const handleClose = () => {
    setSelectedTable('');
    setCustomerName('');
    setCustomerPhone('');
    setObservations('');
    setSaleType('dine_in');
    onClose();
  };

  const saleTypes = [
    { value: 'dine_in', label: '🍽️ Consumo no Local', description: 'Cliente consome no restaurante' },
    { value: 'takeaway', label: '🥡 Retirada', description: 'Cliente retira o pedido' },
    { value: 'delivery', label: '🚚 Delivery', description: 'Entrega no endereço do cliente' }
  ];

  const availableTables = tables.filter(table => !table.isOccupied);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          🛒 Nova Venda
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Inicie uma nova venda selecionando o tipo de atendimento e informações do cliente.
          </Alert>

          {/* Tipo de Venda */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Tipo de Atendimento</InputLabel>
            <Select
              value={saleType}
              onChange={(e) => setSaleType(e.target.value)}
              label="Tipo de Atendimento"
            >
              {saleTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  <Box>
                    <Typography variant="subtitle2">{type.label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {type.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Mesa (apenas para consumo no local) */}
          {saleType === 'dine_in' && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Mesa</InputLabel>
              <Select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                label="Mesa"
              >
                <MenuItem value="">
                  <em>Sem mesa específica</em>
                </MenuItem>
                {availableTables.map((table) => (
                  <MenuItem key={table.id} value={table.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <span>Mesa {table.number}</span>
                      <Chip 
                        label={`${table.capacity} lugares`} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {availableTables.length === 0 && (
                <Typography variant="caption" color="warning.main" sx={{ mt: 1 }}>
                  ⚠️ Todas as mesas estão ocupadas
                </Typography>
              )}
            </FormControl>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Informações do Cliente */}
          <Typography variant="subtitle1" gutterBottom color="primary">
            👤 Informações do Cliente
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nome do Cliente"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                fullWidth
                margin="normal"
                placeholder="Nome completo ou apelido"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Telefone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                fullWidth
                margin="normal"
                placeholder="(11) 99999-9999"
                type="tel"
              />
            </Grid>
          </Grid>

          <TextField
            label="Observações"
            multiline
            rows={3}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="Ex: Cliente preferencial, sem cebola, etc."
            helperText="Informações importantes sobre o pedido"
          />

          {/* Resumo da Configuração */}
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              📋 Resumo da Venda:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Tipo: {saleTypes.find(t => t.value === saleType)?.label}
              <br />
              {saleType === 'dine_in' && selectedTable && (
                <>• Mesa: {tables.find(t => t.id === selectedTable)?.number}<br /></>
              )}
              • Cliente: {customerName || 'Não informado'}
              <br />
              • Próximo passo: Adicionar produtos ao pedido
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          color="inherit"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleConfirm}
          variant="contained"
        >
          Criar Venda
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewSaleDialog;
