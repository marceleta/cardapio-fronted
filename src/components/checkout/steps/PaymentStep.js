/**
 * ETAPA DE PAGAMENTO - CHECKOUT
 * 
 * Terceira etapa do checkout responsável por coletar informações
 * sobre a forma de pagamento e troco.
 * 
 * Funcionalidades:
 * - Seleção entre diferentes métodos de pagamento
 * - Configuração de troco para dinheiro
 * - Validação de valores
 * - Calculadora de troco
 * - Informações sobre cada método de pagamento
 * - Integração com dados do pedido
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Alert,
  Chip,
  Divider,
  InputAdornment,
  FormControlLabel,
  Switch,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Money as MoneyIcon,
  CreditCard as CreditCardIcon,
  Pix as PixIcon,
  AccountBalance as BankIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  Calculate as CalculateIcon
} from '@mui/icons-material';

// Hooks de contexto
import { useCart } from '../../../context/CartContext';
import { useCheckout } from '../../../context/CheckoutContext';

/**
 * CONFIGURAÇÕES DOS MÉTODOS DE PAGAMENTO
 * Conforme PASSO 3: Seleção da Forma de Pagamento
 */
const PAYMENT_METHODS = {
  cash: {
    id: 'cash',
    title: 'Dinheiro',
    subtitle: 'Pagamento na entrega/retirada',
    icon: <MoneyIcon />,
    color: 'success',
    requiresChange: true,
    processingTime: 'Imediato',
    description: 'Pague em dinheiro no momento da entrega ou retirada. Campo obrigatório: "Precisa de troco para quanto?"'
  },
  credit: {
    id: 'credit',
    title: 'Cartão de Crédito',
    subtitle: 'Visa, Mastercard, Elo (na entrega/retirada)',
    icon: <CreditCardIcon />,
    color: 'primary',
    requiresChange: false,
    processingTime: 'Imediato',
    description: 'Aceitamos os principais cartões de crédito'
  },
  debit: {
    id: 'debit',
    title: 'Cartão de Débito',
    subtitle: 'Débito na maquininha (na entrega/retirada)',
    icon: <CreditCardIcon />,
    color: 'secondary',
    requiresChange: false,
    processingTime: 'Imediato',
    description: 'Pagamento por aproximação ou chip'
  },
  pix: {
    id: 'pix',
    title: 'PIX',
    subtitle: 'Transferência instantânea',
    icon: <PixIcon />,
    color: 'info',
    requiresChange: false,
    processingTime: 'Até 1 minuto',
    description: 'QR Code ou chave PIX para pagamento rápido'
  }
};

/**
 * COMPONENTE PRINCIPAL DA ETAPA DE PAGAMENTO
 */
const PaymentStep = () => {
  // Estados locais
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [needsChange, setNeedsChange] = useState(false);
  const [changeAmount, setChangeAmount] = useState('');
  const [error, setError] = useState(null);
  const [changeCalculated, setChangeCalculated] = useState(0);

  // Hooks de contexto
  const { cartTotal } = useCart();
  const { 
    nextStep, 
    setPaymentInfo, 
    paymentData, 
    deliveryData,
    PAYMENT_TYPES 
  } = useCheckout();

  // Valor total incluindo taxa de entrega
  const totalWithDelivery = cartTotal + (deliveryData.deliveryFee || 0);

  /**
   * EFEITO PARA RESTAURAR DADOS SALVOS
   */
  useEffect(() => {
    if (paymentData.method) {
      setSelectedMethod(paymentData.method);
      
      if (paymentData.needsChange) {
        setNeedsChange(true);
        setChangeAmount(paymentData.changeFor?.toString() || '');
      }
    }
  }, [paymentData]);

  /**
   * EFEITO PARA CALCULAR TROCO
   */
  useEffect(() => {
    if (needsChange && changeAmount) {
      const changeValue = parseFloat(changeAmount.replace(',', '.'));
      const calculated = changeValue - totalWithDelivery;
      setChangeCalculated(calculated > 0 ? calculated : 0);
    } else {
      setChangeCalculated(0);
    }
  }, [needsChange, changeAmount, totalWithDelivery]);

  /**
   * FORMATA VALOR MONETÁRIO
   */
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  /**
   * MANIPULA MUDANÇA NO VALOR DO TROCO
   */
  const handleChangeAmountChange = (event) => {
    let value = event.target.value;
    
    // Remove caracteres não numéricos exceto vírgula e ponto
    value = value.replace(/[^\d.,]/g, '');
    
    // Substitui vírgula por ponto
    value = value.replace(',', '.');
    
    // Permite apenas um ponto decimal
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limita a 2 casas decimais
    if (parts[1] && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    setChangeAmount(value);
    setError(null);
  };

  /**
   * SELECIONA MÉTODO DE PAGAMENTO
   */
  const handleSelectPaymentMethod = (methodId) => {
    setSelectedMethod(methodId);
    setError(null);
    
    const method = PAYMENT_METHODS[methodId];
    
    // Reset configurações de troco se não for dinheiro
    if (!method.requiresChange) {
      setNeedsChange(false);
      setChangeAmount('');
    }
  };

  /**
   * VALIDA DADOS DE PAGAMENTO
   */
  const validatePayment = () => {
    if (!selectedMethod) {
      return 'Selecione um método de pagamento';
    }

    const method = PAYMENT_METHODS[selectedMethod];
    
    if (method.requiresChange && needsChange) {
      if (!changeAmount) {
        return 'Informe o valor para o troco';
      }
      
      const changeValue = parseFloat(changeAmount.replace(',', '.'));
      
      if (isNaN(changeValue) || changeValue <= 0) {
        return 'Valor para troco deve ser maior que zero';
      }
      
      if (changeValue < totalWithDelivery) {
        return 'Valor para troco deve ser maior que o total do pedido';
      }
    }

    return null;
  };

  /**
   * PROSSEGUE PARA PRÓXIMA ETAPA
   * PASSO 3: Seleção da Forma de Pagamento
   */
  const handleContinue = () => {
    const validation = validatePayment();
    if (validation) {
      setError(validation);
      return;
    }

    const paymentInfo = {
      method: selectedMethod,
      methodName: PAYMENT_METHODS[selectedMethod].title,
      needsChange: needsChange,
      changeFor: needsChange && changeAmount ? parseFloat(changeAmount.replace(',', '.')) : null
    };

    setPaymentInfo(paymentInfo);
    
    // Prossegue para PASSO 4: Resumo Final e Confirmação
    nextStep();
  };  /**
   * RENDERIZA MÉTODOS DE PAGAMENTO
   */
  const renderPaymentMethods = () => (
    <Grid container spacing={2}>
      {Object.values(PAYMENT_METHODS).map((method) => (
        <Grid item xs={12} sm={6} key={method.id}>
          <Card
            sx={{
              cursor: 'pointer',
              border: selectedMethod === method.id ? 2 : 1,
              borderColor: selectedMethod === method.id ? `${method.color}.main` : 'grey.300',
              '&:hover': {
                borderColor: `${method.color}.main`,
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out'
              }
            }}
            onClick={() => handleSelectPaymentMethod(method.id)}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* ÍCONE */}
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: '50%',
                    backgroundColor: selectedMethod === method.id 
                      ? `${method.color}.main` 
                      : `${method.color}.50`,
                    color: selectedMethod === method.id 
                      ? 'white' 
                      : `${method.color}.main`
                  }}
                >
                  {method.icon}
                </Box>

                {/* CONTEÚDO */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {method.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {method.subtitle}
                  </Typography>
                  
                  <Chip
                    size="small"
                    label={method.processingTime}
                    color={method.color}
                    variant="outlined"
                  />
                </Box>

                {/* INDICADOR DE SELEÇÃO */}
                {selectedMethod === method.id && (
                  <CheckIcon color={method.color} />
                )}
              </Box>

              {/* DESCRIÇÃO */}
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ mt: 1, display: 'block' }}
              >
                {method.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  /**
   * RENDERIZA CONFIGURAÇÃO DE TROCO
   */
  const renderChangeConfiguration = () => {
    const method = PAYMENT_METHODS[selectedMethod];
    
    if (!method?.requiresChange) return null;

    return (
      <Paper sx={{ p: 3, mt: 3, backgroundColor: 'warning.50' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <CalculateIcon color="warning" />
          <Typography variant="h6">
            Configuração de Troco
          </Typography>
        </Box>

        {/* SWITCH PARA NECESSIDADE DE TROCO */}
        <FormControlLabel
          control={
            <Switch
              checked={needsChange}
              onChange={(e) => setNeedsChange(e.target.checked)}
              color="warning"
            />
          }
          label="Preciso de troco"
          sx={{ mb: 2 }}
        />

        {/* CAMPO DE VALOR PARA TROCO */}
        {needsChange && (
          <Box>
            <TextField
              fullWidth
              label="Valor que você tem para pagar"
              value={changeAmount}
              onChange={handleChangeAmountChange}
              placeholder="0,00"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    R$
                  </InputAdornment>
                )
              }}
              sx={{ mb: 2 }}
            />

            {/* CÁLCULO DO TROCO */}
            {changeAmount && (
              <Paper sx={{ p: 2, backgroundColor: 'success.50' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Cálculo do troco:
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    Valor que você tem:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatCurrency(parseFloat(changeAmount.replace(',', '.')) || 0)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    Total do pedido:
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(totalWithDelivery)}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 1 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" fontWeight="bold" color="success.main">
                    Seu troco será:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="success.main">
                    {formatCurrency(changeCalculated)}
                  </Typography>
                </Box>
              </Paper>
            )}
          </Box>
        )}
      </Paper>
    );
  };

  /**
   * RENDERIZA RESUMO DO PAGAMENTO
   */
  const renderPaymentSummary = () => {
    if (!selectedMethod) return null;

    const method = PAYMENT_METHODS[selectedMethod];

    return (
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Resumo do Pagamento
        </Typography>

        <List dense>
          <ListItem>
            <ListItemIcon>
              <InfoIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Método de Pagamento"
              secondary={method.title}
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <MoneyIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Subtotal"
              secondary={formatCurrency(cartTotal)}
            />
          </ListItem>

          {deliveryData.deliveryFee > 0 && (
            <ListItem>
              <ListItemIcon>
                <MoneyIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Taxa de Entrega"
                secondary={formatCurrency(deliveryData.deliveryFee)}
              />
            </ListItem>
          )}

          <Divider sx={{ my: 1 }} />

          <ListItem>
            <ListItemIcon>
              <CheckIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="h6" color="success.main">
                  Total a Pagar
                </Typography>
              }
              secondary={
                <Typography variant="h5" color="success.main" fontWeight="bold">
                  {formatCurrency(totalWithDelivery)}
                </Typography>
              }
            />
          </ListItem>

          {needsChange && changeCalculated > 0 && (
            <ListItem>
              <ListItemIcon>
                <CalculateIcon color="warning" />
              </ListItemIcon>
              <ListItemText
                primary="Troco"
                secondary={formatCurrency(changeCalculated)}
              />
            </ListItem>
          )}
        </List>
      </Paper>
    );
  };

  return (
    <Box>
      {/* CABEÇALHO */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Como você vai pagar?
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Escolha a forma de pagamento mais conveniente
        </Typography>
        <Typography variant="h6" color="primary.main" sx={{ mt: 1 }}>
          Total: {formatCurrency(totalWithDelivery)}
        </Typography>
      </Box>

      {/* ALERT DE ERRO */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* MÉTODOS DE PAGAMENTO */}
      {renderPaymentMethods()}

      {/* CONFIGURAÇÃO DE TROCO */}
      {renderChangeConfiguration()}

      {/* RESUMO DO PAGAMENTO */}
      {renderPaymentSummary()}

      {/* BOTÃO CONTINUAR */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleContinue}
          disabled={!selectedMethod}
          sx={{ minWidth: 200 }}
        >
          Continuar
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentStep;
