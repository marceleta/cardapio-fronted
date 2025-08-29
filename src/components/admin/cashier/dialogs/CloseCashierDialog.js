import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { NumericFormat } from 'react-number-format';

const CloseCashierDialog = ({ open, onClose, onConfirm, cashierData }) => {
  const [observations, setObservations] = useState('');
  const [finalAmount, setFinalAmount] = useState('');

  const handleConfirm = () => {
    const countedAmount = parseFloat(finalAmount.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    onConfirm({ 
      finalAmount: countedAmount, 
      observations,
      difference: countedAmount - (cashierData?.currentBalance || 0)
    });
    handleClose();
  };

  const handleClose = () => {
    setObservations('');
    setFinalAmount('');
    onClose();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value || 0);
  };

  const difference = finalAmount ? 
    parseFloat(finalAmount.replace(/[^\d,]/g, '').replace(',', '.')) - (cashierData?.currentBalance || 0) : 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Fechar Caixa
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <strong>Atenção:</strong> Ao fechar o caixa, todas as vendas em andamento serão finalizadas 
            e não será possível realizar novas operações até a próxima abertura.
          </Alert>

          {/* Resumo do Caixa */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom color="primary">
              📊 Resumo do Movimento
            </Typography>
            
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <MoneyIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Saldo Inicial"
                  secondary={formatCurrency(cashierData?.initialAmount)}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <TrendingUpIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Total de Vendas"
                  secondary={formatCurrency(cashierData?.totalSales)}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <TrendingDownIcon color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="Total de Sangrias"
                  secondary={formatCurrency(cashierData?.totalWithdrawals)}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <TrendingUpIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Suprimentos"
                  secondary={formatCurrency(cashierData?.totalSupplies)}
                />
              </ListItem>
              
              <Divider sx={{ my: 1 }} />
              
              <ListItem>
                <ListItemIcon>
                  <ReceiptIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={<Typography variant="subtitle1" fontWeight="bold">Saldo Esperado</Typography>}
                  secondary={<Typography variant="h6" color="primary">{formatCurrency(cashierData?.currentBalance)}</Typography>}
                />
              </ListItem>
            </List>
          </Box>

          {/* Conferência do Caixa */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              💰 Conferência do Caixa
            </Typography>
            
            <NumericFormat
              customInput={TextField}
              label="Valor Contado no Caixa"
              value={finalAmount}
              onValueChange={(values) => setFinalAmount(values.formattedValue)}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              fullWidth
              required
              margin="normal"
              helperText="Digite o valor real que foi contado no caixa"
            />

            {finalAmount && (
              <Box sx={{ mt: 2, p: 2, borderRadius: 1, 
                bgcolor: difference === 0 ? 'success.light' : difference > 0 ? 'warning.light' : 'error.light',
                color: difference === 0 ? 'success.dark' : difference > 0 ? 'warning.dark' : 'error.dark'
              }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {difference === 0 ? '✅ Caixa Conferido' : 
                   difference > 0 ? '⚠️ Sobra no Caixa' : '❌ Falta no Caixa'}
                </Typography>
                <Typography variant="body2">
                  Diferença: {formatCurrency(Math.abs(difference))}
                  {difference !== 0 && (
                    <span> ({difference > 0 ? 'a mais' : 'a menos'})</span>
                  )}
                </Typography>
              </Box>
            )}
          </Box>

          <TextField
            label="Observações sobre o fechamento"
            multiline
            rows={3}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="Ex: Tudo conferido, sem pendências"
            helperText="Informações adicionais sobre o fechamento do caixa"
          />
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
          color="error"
          disabled={!finalAmount}
        >
          Fechar Caixa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CloseCashierDialog;
