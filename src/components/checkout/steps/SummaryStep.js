/**
 * ETAPA DE RESUMO - CHECKOUT
 * 
 * Quarta etapa do checkout que apresenta um resumo completo
 * do pedido antes do envio para o WhatsApp.
 * 
 * Funcionalidades:
 * - Exibe todos os itens do carrinho
 * - Mostra informações de entrega
 * - Apresenta método de pagamento escolhido
 * - Permite adicionar observações
 * - Confirma dados antes do envio
 * - Gera mensagem formatada para WhatsApp
 * - Validação final dos dados
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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  TextField,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ShoppingCart as CartIcon,
  LocalShipping as DeliveryIcon,
  Store as StoreIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  WhatsApp as WhatsAppIcon,
  Edit as EditIcon,
  Receipt as ReceiptIcon,
  Note as NoteIcon
} from '@mui/icons-material';

// Hooks de contexto
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { useCheckout } from '../../../context/CheckoutContext';

/**
 * COMPONENTE PRINCIPAL DA ETAPA DE RESUMO
 */
const SummaryStep = () => {
  // Estados locais
  const [observations, setObservations] = useState('');
  const [expanded, setExpanded] = useState('items');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Hooks de contexto
  const { user } = useAuth();
  const { 
    cartItems, 
    cartTotal, 
    clearCart 
  } = useCart();
  const { 
    deliveryData, 
    paymentData, 
    nextStep,
    generateWhatsAppMessage,
    sendToWhatsApp,
    DELIVERY_TYPES 
  } = useCheckout();

  // Valor total incluindo taxa de entrega
  const totalWithDelivery = cartTotal + (deliveryData.deliveryFee || 0);

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
   * MANIPULA EXPANSÃO DOS ACORDEÕES
   */
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  /**
   * CONFIRMA E ENVIA PEDIDO
   * PASSO 4: Resumo Final e Confirmação
   * PASSO 5: Geração da Mensagem e Redirecionamento para WhatsApp
   */
  const handleConfirmOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      // Envia para o WhatsApp (PASSO 5)
      const success = await sendToWhatsApp();
      
      if (success) {
        // O sendToWhatsApp já avança para PASSO 6 (página de sucesso)
        // e limpa o carrinho
      } else {
        setError('Erro ao enviar pedido. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro ao confirmar pedido:', err);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * RENDERIZA INFORMAÇÕES DO CLIENTE
   */
  const renderCustomerInfo = () => (
    <Accordion 
      expanded={expanded === 'customer'} 
      onChange={handleAccordionChange('customer')}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PersonIcon color="primary" />
          <Typography variant="h6">
            Dados do Cliente
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Nome
            </Typography>
            <Typography variant="body1">
              {user?.name || 'Não informado'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Telefone
            </Typography>
            <Typography variant="body1">
              {user?.phone || 'Não informado'}
            </Typography>
          </Grid>
          
          {user?.email && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                E-mail
              </Typography>
              <Typography variant="body1">
                {user.email}
              </Typography>
            </Grid>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  /**
   * RENDERIZA ITENS DO CARRINHO
   */
  const renderCartItems = () => (
    <Accordion 
      expanded={expanded === 'items'} 
      onChange={handleAccordionChange('items')}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CartIcon color="primary" />
          <Typography variant="h6">
            Itens do Pedido ({cartItems.length})
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <List>
          {cartItems.map((item, index) => (
            <React.Fragment key={`${item.id}-${index}`}>
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar 
                    src={item.image} 
                    alt={item.name}
                    sx={{ width: 56, height: 56 }}
                  >
                    {item.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6" component="span">
                        {item.name}
                      </Typography>
                      <Typography variant="h6" color="primary.main">
                        {formatCurrency(item.price * item.quantity)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box>
                      {item.description && (
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {item.description}
                        </Typography>
                      )}
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip 
                            label={`Qtd: ${item.quantity}`} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                          <Chip 
                            label={formatCurrency(item.price)} 
                            size="small" 
                            color="secondary"
                            variant="outlined"
                          />
                        </Box>
                      </Box>

                      {/* OPÇÕES SELECIONADAS */}
                      {item.selectedOptions && item.selectedOptions.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Opções:
                          </Typography>
                          {item.selectedOptions.map((option, optIndex) => (
                            <Chip
                              key={optIndex}
                              label={`${option.name} (+${formatCurrency(option.price)})`}
                              size="small"
                              variant="outlined"
                              sx={{ ml: 1, mt: 0.5 }}
                            />
                          ))}
                        </Box>
                      )}

                      {/* OBSERVAÇÕES DO ITEM */}
                      {item.observations && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Observações: {item.observations}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ListItem>
              
              {index < cartItems.length - 1 && <Divider sx={{ my: 1 }} />}
            </React.Fragment>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );

  /**
   * RENDERIZA INFORMAÇÕES DE ENTREGA
   */
  const renderDeliveryInfo = () => (
    <Accordion 
      expanded={expanded === 'delivery'} 
      onChange={handleAccordionChange('delivery')}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {deliveryData.type === DELIVERY_TYPES.DELIVERY ? (
            <DeliveryIcon color="primary" />
          ) : (
            <StoreIcon color="primary" />
          )}
          <Typography variant="h6">
            {deliveryData.type === DELIVERY_TYPES.DELIVERY ? 'Entrega' : 'Retirada'}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {deliveryData.type === DELIVERY_TYPES.DELIVERY ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Endereço de Entrega
              </Typography>
              <Typography variant="body1">
                {deliveryData.address.street}, {deliveryData.address.number}
                {deliveryData.address.complement && `, ${deliveryData.address.complement}`}
              </Typography>
              <Typography variant="body1">
                {deliveryData.address.neighborhood}, {deliveryData.address.city} - {deliveryData.address.state}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                CEP: {deliveryData.address.cep}
              </Typography>
              
              {deliveryData.address.reference && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Referência: {deliveryData.address.reference}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Taxa de Entrega
              </Typography>
              <Typography variant="body1" color="primary.main" fontWeight="bold">
                {formatCurrency(deliveryData.deliveryFee)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Tempo Estimado
              </Typography>
              <Typography variant="body1">
                {deliveryData.estimatedTime}
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Box>
            <Typography variant="body1" gutterBottom>
              <strong>Endereço do Restaurante:</strong>
            </Typography>
            <Typography variant="body1">
              Rua das Delícias, 123 - Centro
            </Typography>
            <Typography variant="body1">
              São Paulo - SP, CEP: 01234-567
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Tempo de Preparo: {deliveryData.estimatedTime}
            </Typography>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );

  /**
   * RENDERIZA INFORMAÇÕES DE PAGAMENTO
   */
  const renderPaymentInfo = () => (
    <Accordion 
      expanded={expanded === 'payment'} 
      onChange={handleAccordionChange('payment')}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PaymentIcon color="primary" />
          <Typography variant="h6">
            Pagamento
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Método de Pagamento
            </Typography>
            <Typography variant="body1">
              {paymentData.methodName}
            </Typography>
          </Grid>
          
          {paymentData.needsChange && (
            <>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Valor para Troco
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(paymentData.changeFor)}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Troco
                </Typography>
                <Typography variant="body1" color="success.main" fontWeight="bold">
                  {formatCurrency(paymentData.changeAmount)}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  /**
   * RENDERIZA TOTAL DO PEDIDO
   */
  const renderOrderTotal = () => (
    <Paper sx={{ p: 3, mt: 3, backgroundColor: 'primary.50' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <ReceiptIcon color="primary" />
        <Typography variant="h6">
          Total do Pedido
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body1">
            Subtotal:
          </Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Typography variant="body1">
            {formatCurrency(cartTotal)}
          </Typography>
        </Grid>

        {deliveryData.deliveryFee > 0 && (
          <>
            <Grid item xs={6}>
              <Typography variant="body1">
                Taxa de Entrega:
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography variant="body1">
                {formatCurrency(deliveryData.deliveryFee)}
              </Typography>
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h5" color="primary.main" fontWeight="bold">
            Total:
          </Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Typography variant="h5" color="primary.main" fontWeight="bold">
            {formatCurrency(totalWithDelivery)}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );

  /**
   * RENDERIZA CAMPO DE OBSERVAÇÕES
   */
  const renderObservations = () => (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <NoteIcon color="primary" />
        <Typography variant="h6">
          Observações do Pedido
        </Typography>
      </Box>

      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="Alguma observação especial? (ex: sem cebola, ponto da carne, etc.)"
        value={observations}
        onChange={(e) => setObservations(e.target.value)}
        inputProps={{ maxLength: 200 }}
        helperText={`${observations.length}/200 caracteres`}
      />
    </Paper>
  );

  return (
    <Box>
      {/* CABEÇALHO */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Confirme seu Pedido
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Revise todas as informações antes de finalizar
        </Typography>
      </Box>

      {/* ALERT DE ERRO */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* DADOS DO CLIENTE */}
      {renderCustomerInfo()}

      {/* ITENS DO CARRINHO */}
      {renderCartItems()}

      {/* INFORMAÇÕES DE ENTREGA */}
      {renderDeliveryInfo()}

      {/* INFORMAÇÕES DE PAGAMENTO */}
      {renderPaymentInfo()}

      {/* OBSERVAÇÕES */}
      {renderObservations()}

      {/* TOTAL DO PEDIDO */}
      {renderOrderTotal()}

      {/* BOTÕES */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleConfirmOrder}
          disabled={loading}
          startIcon={loading ? null : <WhatsAppIcon />}
          sx={{ 
            minWidth: 200,
            backgroundColor: '#25D366',
            '&:hover': {
              backgroundColor: '#1da851'
            }
          }}
        >
          {loading ? 'Enviando...' : 'Finalizar Pedido'}
        </Button>
      </Box>

      {/* INFORMAÇÃO SOBRE O WHATSAPP */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          Ao finalizar, você será direcionado para o WhatsApp com todos os detalhes do seu pedido.
          Nossa equipe entrará em contato para confirmar e dar andamento ao seu pedido.
        </Typography>
      </Alert>
    </Box>
  );
};

export default SummaryStep;
