/**
 * ETAPA DE SUCESSO - CHECKOUT
 * 
 * Quinta e última etapa do checkout que confirma o envio
 * bem-sucedido do pedido para o WhatsApp.
 * 
 * Funcionalidades:
 * - Confirma o envio do pedido
 * - Exibe número do pedido gerado
 * - Mostra informações de acompanhamento
 * - Oferece opções para novo pedido
 * - Exibe tempo estimado de entrega/preparo
 * - Links para suporte e acompanhamento
 * - Animações de sucesso
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Paper,
  Chip,
  Alert,
  IconButton,
  Fade,
  Grow
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  WhatsApp as WhatsAppIcon,
  AccessTime as TimeIcon,
  Receipt as ReceiptIcon,
  Home as HomeIcon,
  ShoppingCart as CartIcon,
  Phone as PhoneIcon,
  LocalShipping as DeliveryIcon,
  Store as StoreIcon,
  Star as StarIcon
} from '@mui/icons-material';

// Hooks de contexto
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { useCheckout } from '../../../context/CheckoutContext';

/**
 * CONFIGURAÇÕES DO RESTAURANTE
 */
const RESTAURANT_CONFIG = {
  name: 'Restaurante Delícias',
  phone: '(11) 99999-9999',
  whatsapp: '5511999999999',
  address: 'Rua das Delícias, 123 - Centro, São Paulo - SP',
  workingHours: 'Segunda à Domingo: 18h às 23h'
};

/**
 * COMPONENTE PRINCIPAL DA ETAPA DE SUCESSO
 */
const SuccessStep = () => {
  // Estados locais
  const [orderNumber, setOrderNumber] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);

  // Hooks de contexto
  const { user } = useAuth();
  const { deliveryData, resetCheckout, DELIVERY_TYPES } = useCheckout();

  /**
   * EFEITO PARA GERAR NÚMERO DO PEDIDO E ANIMAÇÃO
   */
  useEffect(() => {
    // Gera número do pedido baseado no timestamp
    const timestamp = Date.now();
    const orderNum = `PD${timestamp.toString().slice(-6)}`;
    setOrderNumber(orderNum);

    // Ativa animação após um pequeno delay
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  /**
   * FORMATA TEMPO ESTIMADO
   */
  const getEstimatedTime = () => {
    const baseTime = deliveryData.estimatedTime || '45-60 minutos';
    const now = new Date();
    const [min, max] = baseTime.split('-').map(t => parseInt(t.trim()));
    
    const estimatedDelivery = new Date(now.getTime() + (max * 60000));
    
    return {
      range: baseTime,
      estimatedTime: estimatedDelivery.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const timeInfo = getEstimatedTime();

  /**
   * ABRE WHATSAPP DO RESTAURANTE
   */
  const handleOpenWhatsApp = () => {
    const message = encodeURIComponent(
      `Olá! Gostaria de acompanhar meu pedido ${orderNumber}. Obrigado!`
    );
    const whatsappUrl = `https://wa.me/${RESTAURANT_CONFIG.whatsapp}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  /**
   * LIGA PARA O RESTAURANTE
   */
  const handleCallRestaurant = () => {
    window.open(`tel:${RESTAURANT_CONFIG.phone.replace(/\D/g, '')}`, '_self');
  };

  /**
   * VOLTA PARA O MENU
   */
  const handleBackToMenu = () => {
    resetCheckout();
    // Navega para a página inicial (implementar navegação conforme roteamento usado)
    window.location.href = '/';
  };

  /**
   * NOVO PEDIDO
   */
  const handleNewOrder = () => {
    resetCheckout();
    // Navega para o carrinho limpo (implementar navegação conforme roteamento usado)
    window.location.href = '/';
  };

  /**
   * RENDERIZA ÍCONE DE SUCESSO ANIMADO
   */
  const renderSuccessIcon = () => (
    <Fade in={showAnimation} timeout={1000}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box
          sx={{
            display: 'inline-flex',
            p: 3,
            borderRadius: '50%',
            backgroundColor: 'success.main',
            color: 'white',
            fontSize: '4rem',
            animation: showAnimation ? 'pulse 2s infinite' : 'none',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(1)',
                boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.7)'
              },
              '70%': {
                transform: 'scale(1.05)',
                boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)'
              },
              '100%': {
                transform: 'scale(1)',
                boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)'
              }
            }
          }}
        >
          <CheckCircleIcon fontSize="inherit" />
        </Box>
      </Box>
    </Fade>
  );

  /**
   * RENDERIZA INFORMAÇÕES DO PEDIDO
   */
  const renderOrderInfo = () => (
    <Grow in={showAnimation} timeout={1500}>
      <Paper sx={{ p: 3, mb: 3, backgroundColor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" color="success.main" fontWeight="bold" gutterBottom>
            Pedido Enviado!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Seu pedido foi enviado com sucesso para o WhatsApp
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ textAlign: 'center' }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <ReceiptIcon color="success" fontSize="large" />
              <Typography variant="body2" color="text.secondary">
                Número do Pedido
              </Typography>
              <Chip 
                label={orderNumber} 
                color="success" 
                variant="outlined" 
                size="large"
                sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <TimeIcon color="success" fontSize="large" />
              <Typography variant="body2" color="text.secondary">
                {deliveryData.type === DELIVERY_TYPES.DELIVERY ? 'Previsão de Entrega' : 'Previsão de Preparo'}
              </Typography>
              <Typography variant="h6" color="success.main" fontWeight="bold">
                {timeInfo.range}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aproximadamente às {timeInfo.estimatedTime}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Grow>
  );

  /**
   * RENDERIZA PRÓXIMOS PASSOS
   */
  const renderNextSteps = () => (
    <Grow in={showAnimation} timeout={2000}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WhatsAppIcon color="success" />
            Próximos Passos
          </Typography>
          
          <Box sx={{ mt: 2 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Quase lá!</strong> Seu pedido foi montado. Não se esqueça de clicar em 'Enviar' no seu WhatsApp para que o restaurante receba.
          </Typography>
        </Alert>            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'primary.50' }}>
                  <Typography variant="h6" color="primary.main" gutterBottom>
                    1º Passo
                  </Typography>
                  <Typography variant="body2">
                    Confirmação do pedido via WhatsApp
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'secondary.50' }}>
                  <Typography variant="h6" color="secondary.main" gutterBottom>
                    2º Passo
                  </Typography>
                  <Typography variant="body2">
                    {deliveryData.type === DELIVERY_TYPES.DELIVERY ? 
                      'Preparo e entrega em seu endereço' : 
                      'Preparo para retirada no local'
                    }
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );

  /**
   * RENDERIZA INFORMAÇÕES DE ENTREGA
   */
  const renderDeliveryInfo = () => (
    <Grow in={showAnimation} timeout={2500}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {deliveryData.type === DELIVERY_TYPES.DELIVERY ? (
              <DeliveryIcon color="primary" />
            ) : (
              <StoreIcon color="primary" />
            )}
            {deliveryData.type === DELIVERY_TYPES.DELIVERY ? 'Informações de Entrega' : 'Informações de Retirada'}
          </Typography>

          {deliveryData.type === DELIVERY_TYPES.DELIVERY ? (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>Endereço:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {deliveryData.address.street}, {deliveryData.address.number}
                {deliveryData.address.complement && `, ${deliveryData.address.complement}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {deliveryData.address.neighborhood}, {deliveryData.address.city} - {deliveryData.address.state}
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>Endereço do Restaurante:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {RESTAURANT_CONFIG.address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Horário: {RESTAURANT_CONFIG.workingHours}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grow>
  );

  /**
   * RENDERIZA AÇÕES RÁPIDAS
   */
  const renderQuickActions = () => (
    <Grow in={showAnimation} timeout={3000}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Precisa de Ajuda?
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<WhatsAppIcon />}
                onClick={handleOpenWhatsApp}
                sx={{
                  color: '#25D366',
                  borderColor: '#25D366',
                  '&:hover': {
                    backgroundColor: '#25D366',
                    color: 'white'
                  }
                }}
              >
                Falar no WhatsApp
              </Button>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<PhoneIcon />}
                onClick={handleCallRestaurant}
              >
                Ligar para o Restaurante
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grow>
  );

  /**
   * RENDERIZA BOTÕES DE NAVEGAÇÃO
   */
  const renderNavigationButtons = () => (
    <Grow in={showAnimation} timeout={3500}>
      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
          onClick={handleBackToMenu}
          sx={{ minWidth: 180 }}
        >
          Voltar ao Menu
        </Button>

        <Button
          variant="outlined"
          size="large"
          startIcon={<CartIcon />}
          onClick={handleNewOrder}
          sx={{ minWidth: 180 }}
        >
          Fazer Novo Pedido
        </Button>
      </Box>
    </Grow>
  );

  /**
   * RENDERIZA AVALIAÇÃO (PLACEHOLDER)
   */
  const renderRatingPrompt = () => (
    <Grow in={showAnimation} timeout={4000}>
      <Alert 
        severity="info" 
        sx={{ mt: 3, textAlign: 'center' }}
        icon={<StarIcon />}
      >
        <Typography variant="body2">
          Após receber seu pedido, que tal avaliar nossa experiência? 
          Sua opinião é muito importante para nós!
        </Typography>
      </Alert>
    </Grow>
  );

  return (
    <Box>
      {/* ÍCONE DE SUCESSO */}
      {renderSuccessIcon()}

      {/* INFORMAÇÕES DO PEDIDO */}
      {renderOrderInfo()}

      {/* PRÓXIMOS PASSOS */}
      {renderNextSteps()}

      {/* INFORMAÇÕES DE ENTREGA/RETIRADA */}
      {renderDeliveryInfo()}

      {/* AÇÕES RÁPIDAS */}
      {renderQuickActions()}

      {/* BOTÕES DE NAVEGAÇÃO */}
      {renderNavigationButtons()}

      {/* PROMPT DE AVALIAÇÃO */}
      {renderRatingPrompt()}
    </Box>
  );
};

export default SuccessStep;
