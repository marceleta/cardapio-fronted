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
  Alert,
  InputAdornment
} from '@mui/material';
import { NumericFormat } from 'react-number-format';

const CashMovementDialog = ({ open, onClose, onConfirm, type = 'withdrawal' }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const isWithdrawal = type === 'withdrawal';
  const title = isWithdrawal ? 'Sangria do Caixa' : 'Suprimento do Caixa';
  const icon = isWithdrawal ? '💸' : '💰';

  const withdrawalCategories = [
    'Troco para outros caixas',
    'Depósito bancário',
    'Pagamento de fornecedor',
    'Despesas operacionais',
    'Outros'
  ];

  const supplyCategories = [
    'Troco inicial',
    'Reforço de troco',
    'Recebimento de vendas',
    'Devolução de sangria',
    'Outros'
  ];

  const categories = isWithdrawal ? withdrawalCategories : supplyCategories;

  const handleConfirm = () => {
    const movementAmount = parseFloat(amount.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    onConfirm({
      type,
      amount: movementAmount,
      description,
      category,
      timestamp: new Date()
    });
    handleClose();
  };

  const handleClose = () => {
    setAmount('');
    setDescription('');
    setCategory('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          {icon} {title}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Alert 
            severity={isWithdrawal ? "warning" : "info"} 
            sx={{ mb: 3 }}
          >
            {isWithdrawal ? 
              'A sangria reduzirá o saldo disponível no caixa.' :
              'O suprimento aumentará o saldo disponível no caixa.'
            }
          </Alert>

          <NumericFormat
            customInput={TextField}
            label={`Valor ${isWithdrawal ? 'da Sangria' : 'do Suprimento'}`}
            value={amount}
            onValueChange={(values) => setAmount(values.formattedValue)}
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
              startAdornment: <InputAdornment position="start">{icon}</InputAdornment>
            }}
            helperText={`Valor que será ${isWithdrawal ? 'retirado do' : 'adicionado ao'} caixa`}
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Categoria</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Categoria"
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Descrição"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            required
            margin="normal"
            placeholder={`Ex: ${isWithdrawal ? 'Sangria para depósito bancário' : 'Suprimento para reforço de troco'}`}
            helperText="Descreva o motivo da movimentação"
          />

          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              ℹ️ Lembrete:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isWithdrawal ? 
                'Todas as sangrias são registradas no histórico para controle financeiro.' :
                'Todos os suprimentos são registrados no histórico para auditoria.'
              }
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
          color={isWithdrawal ? "warning" : "primary"}
          disabled={!amount || !category || !description}
        >
          {isWithdrawal ? 'Realizar Sangria' : 'Adicionar Suprimento'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CashMovementDialog;
