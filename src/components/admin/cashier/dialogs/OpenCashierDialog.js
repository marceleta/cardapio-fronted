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
  Alert,
  InputAdornment
} from '@mui/material';
import { NumericFormat } from 'react-number-format';

const OpenCashierDialog = ({ open, onClose, onConfirm }) => {
  const [initialAmount, setInitialAmount] = useState('');
  const [observations, setObservations] = useState('');

  const handleConfirm = () => {
    const amount = parseFloat(initialAmount.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    onConfirm({ initialAmount: amount, observations });
    handleClose();
  };

  const handleClose = () => {
    setInitialAmount('');
    setObservations('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Abrir Caixa
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Informe o valor inicial do caixa para começar o atendimento.
          </Alert>

          <NumericFormat
            customInput={TextField}
            label="Valor Inicial do Caixa"
            value={initialAmount}
            onValueChange={(values) => setInitialAmount(values.formattedValue)}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            fullWidth
            required
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">💰</InputAdornment>
            }}
            helperText="Valor que será registrado como saldo inicial"
          />

          <TextField
            label="Observações (opcional)"
            multiline
            rows={3}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="Ex: Abertura do caixa para turno da manhã"
            helperText="Informações adicionais sobre a abertura do caixa"
          />

          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              ℹ️ Informações Importantes:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • O valor inicial será registrado no histórico de movimentações
              <br />
              • Este valor servirá como base para o controle de sangria
              <br />
              • Recomenda-se manter um valor mínimo para troco
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
          disabled={!initialAmount || parseFloat(initialAmount.replace(/[^\d,]/g, '').replace(',', '.')) <= 0}
        >
          Abrir Caixa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OpenCashierDialog;
