import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  CreditCard as CardIcon,
  AttachMoney as CashIcon,
  QrCode as PixIcon,
  ConfirmationNumber as VoucherIcon
} from '@mui/icons-material';
import { NumericFormat } from 'react-number-format';

const PaymentDialog = ({ open, onClose, onConfirm, sale, total = 0 }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [receivedAmount, setReceivedAmount] = useState('');
  const [cardType, setCardType] = useState('');
  const [installments, setInstallments] = useState(1);
  const [pixKey, setPixKey] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [observations, setObservations] = useState('');

  const paymentMethods = [
    { value: 'cash', label: 'Dinheiro', icon: <CashIcon />, color: 'success' },
    { value: 'card', label: 'Cartão', icon: <CardIcon />, color: 'primary' },
    { value: 'pix', label: 'PIX', icon: <PixIcon />, color: 'secondary' },
    { value: 'voucher', label: 'Vale', icon: <VoucherIcon />, color: 'warning' }
  ];

  const cardTypes = ['Débito', 'Crédito'];
  const installmentOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value || 0);
  };

  const getChange = () => {
    if (paymentMethod !== 'cash') return 0;
    const received = parseFloat(receivedAmount.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    return Math.max(0, received - total);
  };

  const handleConfirm = () => {
    const received = parseFloat(receivedAmount.replace(/[^\d,]/g, '').replace(',', '.')) || total;
    
    const paymentData = {
      method: paymentMethod,
      amount: total,
      receivedAmount: received,
      change: getChange(),
      cardType: paymentMethod === 'card' ? cardType : null,
      installments: paymentMethod === 'card' && cardType === 'Crédito' ? installments : 1,
      pixKey: paymentMethod === 'pix' ? pixKey : null,
      voucherCode: paymentMethod === 'voucher' ? voucherCode : null,
      observations,
      timestamp: new Date()
    };

    onConfirm(paymentData);
    handleClose();
  };

  const handleClose = () => {
    setPaymentMethod('cash');
    setReceivedAmount('');
    setCardType('');
    setInstallments(1);
    setPixKey('');
    setVoucherCode('');
    setObservations('');
    onClose();
  };

  const isValid = () => {
    if (paymentMethod === 'cash') {
      const received = parseFloat(receivedAmount.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
      return received >= total;
    }
    if (paymentMethod === 'card') {
      return cardType !== '';
    }
    if (paymentMethod === 'voucher') {
      return voucherCode.trim() !== '';
    }
    return true;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          💳 Finalizar Pagamento
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {/* Resumo da Venda */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1, color: 'primary.contrastText' }}>
            <Typography variant="h6" gutterBottom>
              🧾 Resumo do Pedido
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2">Mesa:</Typography>
                <Typography variant="subtitle1">
                  {sale?.table ? `Mesa ${sale.table}` : 'Balcão'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Cliente:</Typography>
                <Typography variant="subtitle1">
                  {sale?.customer?.name || 'Não informado'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1, bgcolor: 'primary.contrastText', opacity: 0.3 }} />
                <Typography variant="h5" align="center">
                  <strong>Total: {formatCurrency(total)}</strong>
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Método de Pagamento */}
          <Typography variant="subtitle1" gutterBottom color="primary">
            Método de Pagamento
          </Typography>
          
          <ToggleButtonGroup
            value={paymentMethod}
            exclusive
            onChange={(e, newMethod) => newMethod && setPaymentMethod(newMethod)}
            fullWidth
            sx={{ mb: 2 }}
          >
            {paymentMethods.map((method) => (
              <ToggleButton
                key={method.value}
                value={method.value}
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 1,
                  minHeight: 80
                }}
              >
                {method.icon}
                <Typography variant="caption">{method.label}</Typography>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          {/* Campos específicos por método de pagamento */}
          {paymentMethod === 'cash' && (
            <Box sx={{ mb: 2 }}>
              <NumericFormat
                customInput={TextField}
                label="Valor Recebido"
                value={receivedAmount}
                onValueChange={(values) => setReceivedAmount(values.formattedValue)}
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                fullWidth
                required
                margin="normal"
                helperText={`Total: ${formatCurrency(total)}`}
                error={receivedAmount && parseFloat(receivedAmount.replace(/[^\d,]/g, '').replace(',', '.')) < total}
              />
              
              {receivedAmount && getChange() > 0 && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  <strong>Troco: {formatCurrency(getChange())}</strong>
                </Alert>
              )}
            </Box>
          )}

          {paymentMethod === 'card' && (
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Tipo do Cartão</InputLabel>
                <Select
                  value={cardType}
                  onChange={(e) => setCardType(e.target.value)}
                  label="Tipo do Cartão"
                >
                  {cardTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {cardType === 'Crédito' && (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Parcelas</InputLabel>
                  <Select
                    value={installments}
                    onChange={(e) => setInstallments(e.target.value)}
                    label="Parcelas"
                  >
                    {installmentOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}x de {formatCurrency(total / option)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          )}

          {paymentMethod === 'pix' && (
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Chave PIX (opcional)"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                fullWidth
                margin="normal"
                placeholder="CPF, e-mail, telefone ou chave aleatória"
                helperText="Chave PIX utilizada pelo cliente"
              />
              <Alert severity="info" sx={{ mt: 1 }}>
                PIX confirmado no valor de {formatCurrency(total)}
              </Alert>
            </Box>
          )}

          {paymentMethod === 'voucher' && (
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Código do Vale"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                fullWidth
                required
                margin="normal"
                placeholder="Digite o código do vale"
                helperText="Código do vale-refeição ou vale-alimentação"
              />
            </Box>
          )}

          <TextField
            label="Observações"
            multiline
            rows={2}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="Ex: Cliente solicitou nota fiscal"
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
          disabled={!isValid()}
          size="large"
        >
          Finalizar Pagamento
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
