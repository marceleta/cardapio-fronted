/**
 * FORMAS DE PAGAMENTO DA EMPRESA - COMPONENTE MODULAR
 * 
 * Componente responsável pelo cadastro e gerenciamento das formas
 * de pagamento aceitas pela empresa.
 * 
 * Funcionalidades:
 * - Cadastro de formas de pagamento
 * - Ativação/desativação de métodos
 * - Configuração de taxas (se aplicável)
 * 
 * @author Sistema Admin
 * @since 22/08/2025
 */

// ========== IMPORTAÇÕES ==========
import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Switch,
  TextField,
  InputAdornment,
  Box,
  Chip,
  Button,
  Divider
} from '@mui/material';
import {
  Payment as PaymentIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  AttachMoney as CashIcon,
  QrCode as PixIcon,
  Add as AddIcon
} from '@mui/icons-material';

// ========== CONSTANTES ==========
/**
 * Mapeamento de ícones disponíveis
 */
const ICON_MAP = {
  cash: CashIcon,
  credit_card: CreditCardIcon,
  debit_card: CreditCardIcon,
  pix: PixIcon,
  bank_transfer: BankIcon,
  payment: PaymentIcon
};

/**
 * Formas de pagamento padrão
 */
const DEFAULT_PAYMENT_METHODS = [
  {
    id: 'cash',
    name: 'Dinheiro',
    iconName: 'cash',
    enabled: true,
    requiresChange: true,
    color: '#4caf50'
  },
  {
    id: 'credit_card',
    name: 'Cartão de Crédito',
    iconName: 'credit_card',
    enabled: true,
    requiresChange: false,
    color: '#2196f3'
  },
  {
    id: 'debit_card',
    name: 'Cartão de Débito',
    iconName: 'debit_card',
    enabled: true,
    requiresChange: false,
    color: '#ff9800'
  },
  {
    id: 'pix',
    name: 'PIX',
    iconName: 'pix',
    enabled: true,
    requiresChange: false,
    color: '#9c27b0'
  },
  {
    id: 'bank_transfer',
    name: 'Transferência Bancária',
    iconName: 'bank_transfer',
    enabled: false,
    requiresChange: false,
    color: '#607d8b'
  }
];

// ========== COMPONENTE PRINCIPAL ==========
/**
 * COMPONENTE: CompanyPaymentMethods
 * Formulário para configuração de formas de pagamento
 */
const CompanyPaymentMethods = ({ companyData, updateField }) => {
  
  // ========== ESTADO LOCAL ==========
  const [paymentMethods, setPaymentMethods] = useState(
    companyData?.paymentMethods || DEFAULT_PAYMENT_METHODS
  );
  const [newMethodName, setNewMethodName] = useState('');

  // ========== FUNÇÕES ==========
  
  /**
   * Atualiza o estado de uma forma de pagamento
   */
  const handlePaymentMethodToggle = (methodId) => {
    const updatedMethods = paymentMethods.map(method =>
      method.id === methodId
        ? { ...method, enabled: !method.enabled }
        : method
    );
    setPaymentMethods(updatedMethods);
    updateField('paymentMethods', updatedMethods);
  };

  /**
   * Adiciona nova forma de pagamento personalizada
   */
  const handleAddCustomMethod = () => {
    if (newMethodName.trim()) {
      const newMethod = {
        id: `custom_${Date.now()}`,
        name: newMethodName.trim(),
        iconName: 'payment',
        enabled: true,
        requiresChange: false,
        color: '#795548',
        isCustom: true
      };
      const updatedMethods = [...paymentMethods, newMethod];
      setPaymentMethods(updatedMethods);
      updateField('paymentMethods', updatedMethods);
      setNewMethodName('');
    }
  };

  /**
   * Remove forma de pagamento personalizada
   */
  const handleRemoveCustomMethod = (methodId) => {
    const updatedMethods = paymentMethods.filter(method => method.id !== methodId);
    setPaymentMethods(updatedMethods);
    updateField('paymentMethods', updatedMethods);
  };

  // ========== RENDER ==========
  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <PaymentIcon />
          Formas de Pagamento
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Configure as formas de pagamento aceitas pela sua empresa
        </Typography>

        {/* Lista de formas de pagamento */}
        <Grid container spacing={2}>
          {paymentMethods.map((method) => {
            const IconComponent = ICON_MAP[method.iconName] || PaymentIcon;
            return (
              <Grid item xs={12} sm={6} md={4} key={method.id}>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: method.enabled ? method.color : '#e0e0e0',
                    borderRadius: 2,
                    backgroundColor: method.enabled ? `${method.color}10` : '#f5f5f5',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <IconComponent 
                      sx={{ 
                        color: method.enabled ? method.color : '#999',
                        fontSize: 24 
                      }} 
                    />
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: method.enabled ? 'inherit' : '#999'
                      }}
                    >
                      {method.name}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={method.enabled}
                          onChange={() => handlePaymentMethodToggle(method.id)}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: method.color,
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: method.color,
                            },
                          }}
                        />
                      }
                      label={method.enabled ? 'Ativo' : 'Inativo'}
                      sx={{ margin: 0 }}
                    />

                    {method.isCustom && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleRemoveCustomMethod(method.id)}
                        sx={{ minWidth: 'auto', p: 0.5 }}
                      >
                        ✕
                      </Button>
                    )}
                  </Box>

                  {method.requiresChange && method.enabled && (
                    <Chip
                      label="Precisa de troco"
                      size="small"
                      sx={{ 
                        mt: 1,
                        backgroundColor: '#fff3cd',
                        color: '#856404'
                      }}
                    />
                  )}
                </Box>
              </Grid>
            );
          })}
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Adicionar forma de pagamento personalizada */}
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
          Adicionar Forma de Pagamento Personalizada
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Nome da forma de pagamento"
              value={newMethodName}
              onChange={(e) => setNewMethodName(e.target.value)}
              variant="outlined"
              placeholder="Ex: Vale Alimentação, Cheque, etc."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PaymentIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddCustomMethod}
              disabled={!newMethodName.trim()}
              sx={{ py: 1.5 }}
            >
              Adicionar
            </Button>
          </Grid>
        </Grid>

        {/* Resumo dos métodos ativos */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
            Métodos Ativos: {paymentMethods.filter(m => m.enabled).length}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {paymentMethods
              .filter(method => method.enabled)
              .map(method => (
                <Chip
                  key={method.id}
                  label={method.name}
                  size="small"
                  sx={{
                    backgroundColor: method.color,
                    color: 'white',
                    '& .MuiChip-deleteIcon': {
                      color: 'white'
                    }
                  }}
                />
              ))
            }
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CompanyPaymentMethods;
