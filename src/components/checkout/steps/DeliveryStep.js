/**
 * ETAPA DE ENTREGA - CHECKOUT
 * 
 * Segunda etapa do checkout responsável por coletar informações
 * sobre o tipo de entrega e endereço do cliente.
 * 
 * Funcionalidades:
 * - Seleção entre delivery e retirada no local
 * - Formulário de endereço para delivery
 * - Validação de CEP e auto-preenchimento
 * - Cálculo de taxa de entrega
 * - Exibição de endereços salvos
 * - Estimativa de tempo de entrega/preparo
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  TextField,
  Alert,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Collapse,
  Paper
} from '@mui/material';
import {
  LocalShipping as DeliveryIcon,
  Store as StoreIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  MonetizationOn as MoneyIcon,
  Add as AddIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { IMaskInput } from 'react-imask';

// Hooks de contexto
import { useAuth } from '../../../context/AuthContext';
import { useCheckout } from '../../../context/CheckoutContext';

/**
 * COMPONENTE DE MÁSCARA PARA CEP
 */
const CEPMaskInput = React.forwardRef(function CEPMaskInput(props, ref) {
  const { onChange, ...other } = props;
  
  return (
    <IMaskInput
      {...other}
      mask="00000-000"
      definitions={{ '0': /[0-9]/ }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

/**
 * CONFIGURAÇÕES DE ENTREGA
 */
const DELIVERY_CONFIG = {
  delivery: {
    title: 'Entrega em Domicílio',
    subtitle: 'Receba em casa com segurança',
    icon: <DeliveryIcon />,
    estimatedTime: '45-60 minutos',
    baseFee: 5.00 // Taxa base de entrega
  },
  takeaway: {
    title: 'Retirar no Local',
    subtitle: 'Retire seu pedido no restaurante',
    icon: <StoreIcon />,
    estimatedTime: '30-40 minutos',
    baseFee: 0
  }
};

/**
 * COMPONENTE PRINCIPAL DA ETAPA DE ENTREGA
 */
const DeliveryStep = () => {
  // Estados locais
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Estados do formulário de endereço
  const [addressForm, setAddressForm] = useState({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    reference: ''
  });

  // Hooks de contexto
  const { user } = useAuth();
  const { 
    nextStep, 
    setDeliveryInfo, 
    deliveryData, 
    DELIVERY_TYPES 
  } = useCheckout();

  /**
   * EFEITO PARA CARREGAR DADOS SALVOS
   */
  useEffect(() => {
    // Carrega endereços salvos do usuário
    if (user?.addresses) {
      setSavedAddresses(user.addresses);
    }

    // Restaura seleção anterior se existir
    if (deliveryData.type) {
      setSelectedType(deliveryData.type);
      
      if (deliveryData.address) {
        setSelectedAddress(deliveryData.address);
      }
    }
  }, [user, deliveryData]);

  /**
   * MANIPULA MUDANÇAS NO FORMULÁRIO DE ENDEREÇO
   */
  const handleAddressChange = (field) => (event) => {
    setAddressForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError(null);
  };

  /**
   * BUSCA ENDEREÇO POR CEP
   */
  const handleCEPSearch = async (cep) => {
    const cleanCEP = cep.replace(/\D/g, '');
    
    if (cleanCEP.length === 8) {
      setLoading(true);
      
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setAddressForm(prev => ({
            ...prev,
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || ''
          }));
        } else {
          setError('CEP não encontrado');
        }
      } catch (err) {
        console.error('Erro ao buscar CEP:', err);
        setError('Erro ao buscar CEP. Verifique sua conexão.');
      } finally {
        setLoading(false);
      }
    }
  };

  /**
   * VALIDA FORMULÁRIO DE ENDEREÇO
   */
  const validateAddressForm = () => {
    const required = ['cep', 'street', 'number', 'neighborhood', 'city', 'state'];
    
    for (const field of required) {
      if (!addressForm[field].trim()) {
        return `Campo ${field === 'cep' ? 'CEP' : field} é obrigatório`;
      }
    }

    const cleanCEP = addressForm.cep.replace(/\D/g, '');
    if (cleanCEP.length !== 8) {
      return 'CEP deve ter 8 dígitos';
    }

    return null;
  };

  /**
   * CALCULA TAXA DE ENTREGA
   */
  const calculateDeliveryFee = (address) => {
    // Lógica simplificada de cálculo de taxa
    // Em um sistema real, seria baseado em distância ou zona de entrega
    return DELIVERY_CONFIG.delivery.baseFee;
  };

  /**
   * SELECIONA TIPO DE ENTREGA
   * PASSO 2: Escolha do Tipo de Entrega
   */
  const handleSelectDeliveryType = (type) => {
    setSelectedType(type);
    setError(null);

    if (type === DELIVERY_TYPES.TAKEAWAY) {
      // Opção B: Retirar no Local (Takeaway)
      setDeliveryInfo({
        type: DELIVERY_TYPES.TAKEAWAY,
        address: null,
        deliveryFee: 0,
        estimatedTime: DELIVERY_CONFIG.takeaway.estimatedTime
      });
    } else {
      // Opção A: Delivery (Entrega em domicílio)
      // Verifica se o cliente possui um endereço salvo
      if (savedAddresses.length > 0) {
        // Se sim, exibe o endereço salvo e pergunta: "Entregar neste endereço?"
        setSelectedAddress(savedAddresses[0]);
        handleSelectSavedAddress(savedAddresses[0]);
      } else {
        // Se não, abre diretamente um formulário para preenchimento
        setShowAddressForm(true);
      }
    }
  };

  /**
   * SELECIONA ENDEREÇO SALVO
   */
  const handleSelectSavedAddress = (address) => {
    setSelectedAddress(address);
    setDeliveryInfo({
      type: DELIVERY_TYPES.DELIVERY,
      address: address,
      deliveryFee: calculateDeliveryFee(address),
      estimatedTime: DELIVERY_CONFIG.delivery.estimatedTime
    });
  };

  /**
   * SALVA NOVO ENDEREÇO
   */
  const handleSaveAddress = () => {
    const validation = validateAddressForm();
    if (validation) {
      setError(validation);
      return;
    }

    const newAddress = { ...addressForm };
    const deliveryFee = calculateDeliveryFee(newAddress);

    setDeliveryInfo({
      type: DELIVERY_TYPES.DELIVERY,
      address: newAddress,
      deliveryFee: deliveryFee,
      estimatedTime: DELIVERY_CONFIG.delivery.estimatedTime
    });

    setSelectedAddress(newAddress);
    setShowAddressForm(false);
  };

  /**
   * PROSSEGUE PARA PRÓXIMA ETAPA
   */
  const handleContinue = () => {
    if (!selectedType) {
      setError('Selecione um tipo de entrega');
      return;
    }

    if (selectedType === DELIVERY_TYPES.DELIVERY && !selectedAddress) {
      setError('Defina um endereço para entrega');
      return;
    }

    nextStep();
  };

  /**
   * RENDERIZA OPÇÕES DE TIPO DE ENTREGA
   */
  const renderDeliveryTypeOptions = () => (
    <Grid container spacing={3}>
      {Object.entries(DELIVERY_CONFIG).map(([key, config]) => (
        <Grid item xs={12} md={6} key={key}>
          <Card
            sx={{
              cursor: 'pointer',
              border: selectedType === key ? 2 : 1,
              borderColor: selectedType === key ? 'primary.main' : 'grey.300',
              '&:hover': {
                borderColor: 'primary.main',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out'
              }
            }}
            onClick={() => handleSelectDeliveryType(key)}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              {/* ÍCONE */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 2
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '50%',
                    backgroundColor: selectedType === key ? 'primary.main' : 'grey.100',
                    color: selectedType === key ? 'white' : 'primary.main'
                  }}
                >
                  {config.icon}
                </Box>
              </Box>

              {/* TÍTULO E SUBTÍTULO */}
              <Typography variant="h6" gutterBottom>
                {config.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {config.subtitle}
              </Typography>

              {/* INFORMAÇÕES */}
              <Box sx={{ mt: 2 }}>
                <Chip
                  icon={<TimeIcon />}
                  label={config.estimatedTime}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip
                  icon={<MoneyIcon />}
                  label={config.baseFee > 0 ? `R$ ${config.baseFee.toFixed(2)}` : 'Grátis'}
                  size="small"
                  color={config.baseFee > 0 ? 'default' : 'success'}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  /**
   * RENDERIZA ENDEREÇOS SALVOS
   */
  const renderSavedAddresses = () => {
    if (savedAddresses.length === 0) return null;

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Endereços Salvos
        </Typography>
        
        <Grid container spacing={2}>
          {savedAddresses.map((address, index) => (
            <Grid item xs={12} key={index}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border: selectedAddress === address ? 2 : 1,
                  borderColor: selectedAddress === address ? 'primary.main' : 'grey.300'
                }}
                onClick={() => handleSelectSavedAddress(address)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LocationIcon color="primary" />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1">
                        {address.street}, {address.number}
                        {address.complement && `, ${address.complement}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {address.neighborhood}, {address.city} - {address.state}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        CEP: {address.cep}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Button
          startIcon={<AddIcon />}
          onClick={() => setShowAddressForm(true)}
          sx={{ mt: 2 }}
        >
          Adicionar Novo Endereço
        </Button>
      </Box>
    );
  };

  /**
   * RENDERIZA FORMULÁRIO DE ENDEREÇO
   */
  const renderAddressForm = () => (
    <Collapse in={showAddressForm}>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ flex: 1 }}>
            Novo Endereço
          </Typography>
          <IconButton onClick={() => setShowAddressForm(false)}>
            <ExpandLessIcon />
          </IconButton>
        </Box>

        <Grid container spacing={3}>
          {/* CEP */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              required
              label="CEP"
              value={addressForm.cep}
              onChange={handleAddressChange('cep')}
              onBlur={(e) => handleCEPSearch(e.target.value)}
              InputProps={{
                inputComponent: CEPMaskInput
              }}
              placeholder="00000-000"
            />
          </Grid>

          {/* RUA */}
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              required
              label="Rua/Avenida"
              value={addressForm.street}
              onChange={handleAddressChange('street')}
              placeholder="Nome da rua"
            />
          </Grid>

          {/* NÚMERO */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              required
              label="Número"
              value={addressForm.number}
              onChange={handleAddressChange('number')}
              placeholder="123"
            />
          </Grid>

          {/* COMPLEMENTO */}
          <Grid item xs={12} md={9}>
            <TextField
              fullWidth
              label="Complemento"
              value={addressForm.complement}
              onChange={handleAddressChange('complement')}
              placeholder="Apartamento, bloco, etc."
            />
          </Grid>

          {/* BAIRRO */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Bairro"
              value={addressForm.neighborhood}
              onChange={handleAddressChange('neighborhood')}
              placeholder="Nome do bairro"
            />
          </Grid>

          {/* CIDADE */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              required
              label="Cidade"
              value={addressForm.city}
              onChange={handleAddressChange('city')}
              placeholder="Nome da cidade"
            />
          </Grid>

          {/* ESTADO */}
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              required
              label="Estado"
              value={addressForm.state}
              onChange={handleAddressChange('state')}
              placeholder="UF"
            />
          </Grid>

          {/* PONTO DE REFERÊNCIA */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Ponto de Referência"
              value={addressForm.reference}
              onChange={handleAddressChange('reference')}
              placeholder="Próximo ao mercado, em frente à praça, etc."
            />
          </Grid>

          {/* BOTÃO SALVAR */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleSaveAddress}
              disabled={loading}
              startIcon={<LocationIcon />}
            >
              {loading ? 'Salvando...' : 'Salvar Endereço'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Collapse>
  );

  /**
   * RENDERIZA INFORMAÇÕES DO RESTAURANTE
   */
  const renderRestaurantInfo = () => {
    if (selectedType !== DELIVERY_TYPES.TAKEAWAY) return null;

    return (
      <Paper sx={{ p: 3, mt: 3, backgroundColor: 'success.50' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <StoreIcon color="success" />
          <Typography variant="h6">
            Endereço do Restaurante
          </Typography>
        </Box>
        
        <Typography variant="body1" gutterBottom>
          Rua das Delícias, 123 - Centro
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          São Paulo - SP, CEP: 01234-567
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimeIcon color="success" />
          <Typography variant="body2">
            Tempo de preparo: {DELIVERY_CONFIG.takeaway.estimatedTime}
          </Typography>
        </Box>
      </Paper>
    );
  };

  return (
    <Box>
      {/* CABEÇALHO */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Como você quer receber?
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Escolha entre entrega em domicílio ou retirada no local
        </Typography>
      </Box>

      {/* ALERT DE ERRO */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* OPÇÕES DE TIPO DE ENTREGA */}
      {renderDeliveryTypeOptions()}

      {/* ENDEREÇOS SALVOS (apenas para delivery) */}
      {selectedType === DELIVERY_TYPES.DELIVERY && renderSavedAddresses()}

      {/* FORMULÁRIO DE ENDEREÇO */}
      {selectedType === DELIVERY_TYPES.DELIVERY && renderAddressForm()}

      {/* INFORMAÇÕES DO RESTAURANTE (apenas para takeaway) */}
      {renderRestaurantInfo()}

      {/* BOTÃO CONTINUAR */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleContinue}
          disabled={!selectedType || (selectedType === DELIVERY_TYPES.DELIVERY && !selectedAddress)}
          sx={{ minWidth: 200 }}
        >
          Continuar
        </Button>
      </Box>
    </Box>
  );
};

export default DeliveryStep;
