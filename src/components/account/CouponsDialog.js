/**
 * DIÁLOGO DE CUPONS DE DESCONTO
 * 
 * Componente modal que exibe os cupons de desconto disponíveis
 * para o usuário, com informações sobre valor, validade e condições.
 * 
 * Funcionalidades:
 * - Listagem de cupons disponíveis
 * - Informações detalhadas de cada cupom
 * - Interface responsiva e acessível
 * - Aplicação direta do cupom no carrinho
 */

'use client';

// Importações do React
import { useState } from 'react';

// Importações do Material-UI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close,
  LocalOffer,
  ContentCopy,
  CheckCircle
} from '@mui/icons-material';

/**
 * DADOS MOCK DOS CUPONS DISPONÍVEIS
 */
const AVAILABLE_COUPONS = [
  {
    id: 1,
    code: 'PRIMEIRA15',
    title: 'Primeira Compra',
    description: '15% de desconto na sua primeira compra',
    discount: '15%',
    type: 'percentage',
    value: 15,
    minOrder: 30,
    validUntil: '2025-12-31',
    isActive: true,
    color: 'success'
  },
  {
    id: 2,
    code: 'FRETE10',
    title: 'Frete Grátis',
    description: 'R$ 10 de desconto no frete para pedidos acima de R$ 50',
    discount: 'R$ 10',
    type: 'fixed',
    value: 10,
    minOrder: 50,
    validUntil: '2025-09-30',
    isActive: true,
    color: 'primary'
  },
  {
    id: 3,
    code: 'SAVE20',
    title: 'Economia Total',
    description: '20% de desconto em pedidos acima de R$ 80',
    discount: '20%',
    type: 'percentage',
    value: 20,
    minOrder: 80,
    validUntil: '2025-10-15',
    isActive: true,
    color: 'secondary'
  },
  {
    id: 4,
    code: 'COMBO25',
    title: 'Super Combo',
    description: 'R$ 25 de desconto em combos familiares',
    discount: 'R$ 25',
    type: 'fixed',
    value: 25,
    minOrder: 100,
    validUntil: '2025-08-31',
    isActive: false,
    color: 'warning'
  }
];

/**
 * COMPONENTE PRINCIPAL DO DIÁLOGO DE CUPONS
 * 
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.open - Estado de abertura do diálogo
 * @param {Function} props.onClose - Função para fechar o diálogo
 * @returns {JSX.Element} Elemento Dialog com listagem de cupons
 */
export default function CouponsDialog({ open, onClose }) {
  // Estados locais
  const [copiedCoupon, setCopiedCoupon] = useState(null);

  // Hooks do Material-UI para responsividade
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  /**
   * COPIA CÓDIGO DO CUPOM PARA ÁREA DE TRANSFERÊNCIA
   */
  const handleCopyCoupon = async (couponCode) => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopiedCoupon(couponCode);
      
      // Remove indicador visual após 2 segundos
      setTimeout(() => {
        setCopiedCoupon(null);
      }, 2000);
    } catch (err) {
      console.error('Erro ao copiar cupom:', err);
    }
  };

  /**
   * APLICA CUPOM DIRETAMENTE NO CARRINHO
   */
  const handleApplyCoupon = (coupon) => {
    // TODO: Integrar com contexto do carrinho
    console.log('Aplicando cupom:', coupon.code);
    onClose();
  };

  /**
   * FORMATA DATA DE VALIDADE
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: isMobile ? 0 : 2,
          margin: isMobile ? 0 : 2
        }
      }}
    >
      {/* CABEÇALHO DO DIÁLOGO */}
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalOffer color="primary" />
          <Typography variant="h6" component="h2">
            Cupons de Desconto
          </Typography>
        </Box>
        
        <IconButton
          onClick={onClose}
          sx={{ ml: 1 }}
          aria-label="Fechar diálogo"
        >
          <Close />
        </IconButton>
      </DialogTitle>

      {/* CONTEÚDO DO DIÁLOGO */}
      <DialogContent sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Aproveite nossos cupons de desconto exclusivos. Clique para copiar o código ou aplicar diretamente.
        </Typography>

        {/* LISTAGEM DE CUPONS */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {AVAILABLE_COUPONS.map((coupon) => (
            <Card
              key={coupon.id}
              variant="outlined"
              sx={{
                position: 'relative',
                opacity: coupon.isActive ? 1 : 0.6,
                transition: 'all 0.2s ease-in-out',
                '&:hover': coupon.isActive ? {
                  boxShadow: 2,
                  transform: 'translateY(-1px)'
                } : {}
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* CABEÇALHO DO CUPOM */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  mb: 2,
                  flexWrap: 'wrap',
                  gap: 1
                }}>
                  <Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {coupon.title}
                    </Typography>
                    <Chip
                      label={coupon.discount}
                      color={coupon.color}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* Botão copiar código */}
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={
                        copiedCoupon === coupon.code ? 
                        <CheckCircle /> : 
                        <ContentCopy />
                      }
                      onClick={() => handleCopyCoupon(coupon.code)}
                      disabled={!coupon.isActive}
                      color={copiedCoupon === coupon.code ? 'success' : 'primary'}
                    >
                      {copiedCoupon === coupon.code ? 'Copiado!' : coupon.code}
                    </Button>
                    
                    {/* Botão aplicar cupom */}
                    {coupon.isActive && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleApplyCoupon(coupon)}
                        sx={{ minWidth: 'auto' }}
                      >
                        Aplicar
                      </Button>
                    )}
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* DESCRIÇÃO E CONDIÇÕES */}
                <Typography variant="body2" color="text.secondary" paragraph>
                  {coupon.description}
                </Typography>

                {/* INFORMAÇÕES ADICIONAIS */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 1,
                  mt: 2
                }}>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Pedido mínimo:</strong> R$ {coupon.minOrder.toFixed(2)}
                  </Typography>
                  
                  <Typography variant="caption" color="text.secondary">
                    <strong>Válido até:</strong> {formatDate(coupon.validUntil)}
                  </Typography>
                </Box>

                {/* INDICADOR DE STATUS */}
                {!coupon.isActive && (
                  <Box sx={{ 
                    position: 'absolute',
                    top: 10,
                    right: 10,
                  }}>
                    <Chip
                      label="Expirado"
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* INFORMAÇÕES ADICIONAIS */}
        <Box sx={{ 
          mt: 3, 
          p: 2, 
          backgroundColor: 'grey.50', 
          borderRadius: 1 
        }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Como usar:</strong> Copie o código do cupom e cole no campo "Cupom de desconto" 
            durante o checkout, ou clique em "Aplicar" para usar automaticamente.
          </Typography>
        </Box>
      </DialogContent>

      {/* RODAPÉ DO DIÁLOGO */}
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} variant="outlined" fullWidth={isMobile}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
