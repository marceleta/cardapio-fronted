/**
 * BARRA DE NAVEGAÇÃO INFERIOR - MOBILE
 * 
 * Componente de navegação fixa na parte inferior da tela, otimizado para
 * dispositivos móveis. Fornece acesso rápido às principais funcionalidades
 * da aplicação com design touch-friendly.
 * 
 * Funcionalidades:
 * - Navegação principal para dispositivos móveis
 * - Indicador visual do carrinho com badge de quantidade
 * - Acesso rápido a conta do usuário e pedidos
 * - Exibição condicional apenas em breakpoints móveis
 * - Integração com contexto do carrinho para atualizações em tempo real
 */

'use client';

// Importações do React
import { useState } from 'react';

// Importações do Material-UI
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Box, 
  Typography, 
  Badge 
} from '@mui/material';
import { 
  Home, 
  ShoppingCart, 
  Person,
  LocalOffer 
} from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// Importações de contextos
import { useCart } from '../../context/CartContext';

// Importações de componentes locais
import AccountDialog from '../account/AccountDialog';
import OrdersDialog from '../account/OrdersDialog';
import CouponsDialog from '../account/CouponsDialog';

/**
 * COMPONENTE PRINCIPAL DA BARRA DE NAVEGAÇÃO MÓVEL
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.setCartOpen - Função para abrir o drawer do carrinho
 * @returns {JSX.Element|null} Elemento AppBar ou null se não for mobile
 */
export default function MobileBottomBar({ setCartOpen }) {
  // Hooks do Material-UI para responsividade
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Hook do contexto do carrinho
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  // Estados locais para controle dos diálogos
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const [isOrdersDialogOpen, setIsOrdersDialogOpen] = useState(false);
  const [isCouponsDialogOpen, setIsCouponsDialogOpen] = useState(false);

  /**
   * MANIPULADORES DE DIÁLOGO DE CONTA
   */
  const handleOpenAccountDialog = () => {
    setIsAccountDialogOpen(true);
  };

  const handleCloseAccountDialog = () => {
    setIsAccountDialogOpen(false);
  };

  /**
   * MANIPULADORES DE DIÁLOGO DE PEDIDOS
   */
  const handleOpenOrdersDialog = () => {
    setIsOrdersDialogOpen(true);
  };

  const handleCloseOrdersDialog = () => {
    setIsOrdersDialogOpen(false);
  };

  /**
   * MANIPULADORES DE DIÁLOGO DE CUPONS
   */
  const handleOpenCouponsDialog = () => {
    setIsCouponsDialogOpen(true);
  };

  const handleCloseCouponsDialog = () => {
    setIsCouponsDialogOpen(false);
  };

  /**
   * NAVEGAÇÃO PARA O TOPO DA PÁGINA
   * Implementa scroll suave para o início da página
   */
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Renderização condicional - apenas em dispositivos móveis
  if (!isMobile) {
    return null;
  }

  return (
    <AppBar 
      position="fixed" 
      color="primary" 
      sx={{ 
        top: 'auto', 
        bottom: 0, 
        display: { xs: 'block', sm: 'none' },
        zIndex: 1200 // Evitar sobreposição com outros elementos
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-around', px: 1 }}>
        {/* BOTÃO INÍCIO - Volta ao topo da página */}
        <Button 
          color="inherit" 
          sx={{ 
            flexDirection: 'column', 
            minWidth: 'auto',
            flex: 1,
            py: 1
          }} 
          onClick={handleScrollToTop}
        >
          <Home sx={{ fontSize: '1.2rem' }} />
          <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
            Início
          </Typography>
        </Button>
        
        {/* BOTÃO PEDIDOS - Abre lista de pedidos do usuário */}
        <Button 
          color="inherit" 
          sx={{ 
            flexDirection: 'column', 
            minWidth: 'auto',
            flex: 1,
            py: 1
          }} 
          onClick={handleOpenOrdersDialog}
        >
          <ShoppingCart sx={{ fontSize: '1.2rem' }} />
          <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
            Pedidos
          </Typography>
        </Button>
        
        {/* BOTÃO CUPONS - Abre diálogo de cupons de desconto */}
        <Button 
          color="inherit" 
          sx={{ 
            flexDirection: 'column', 
            minWidth: 'auto',
            flex: 1,
            py: 1
          }} 
          onClick={handleOpenCouponsDialog}
        >
          <LocalOffer sx={{ fontSize: '1.2rem' }} />
          <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
            Cupons
          </Typography>
        </Button>
        
        {/* BOTÃO CARRINHO - Abre drawer do carrinho com badge de quantidade */}
        <Button 
          color="inherit" 
          sx={{ 
            flexDirection: 'column', 
            minWidth: 'auto',
            flex: 1,
            py: 1
          }} 
          onClick={() => setCartOpen(true)}
        >
          <Badge 
            badgeContent={totalItems} 
            color="secondary" 
            sx={{ 
              '& .MuiBadge-badge': { 
                fontSize: '0.6rem', 
                height: 14, 
                minWidth: 14 
              } 
            }}
          >
            <ShoppingCart sx={{ fontSize: '1.2rem' }} />
          </Badge>
          <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
            Carrinho
          </Typography>
        </Button>
        
        {/* BOTÃO MINHA CONTA - Abre diálogo de gerenciamento da conta */}
        <Button 
          color="inherit" 
          sx={{ 
            flexDirection: 'column', 
            minWidth: 'auto',
            flex: 1,
            py: 1
          }} 
          onClick={handleOpenAccountDialog}
        >
          <Person sx={{ fontSize: '1.2rem' }} />
          <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
            Conta
          </Typography>
        </Button>
      </Toolbar>
      
      {/* DIÁLOGOS MODAIS */}
      {/* Diálogo de gerenciamento da conta do usuário */}
      <AccountDialog 
        open={isAccountDialogOpen} 
        onClose={handleCloseAccountDialog} 
      />
      
      {/* Diálogo de visualização de pedidos */}
      <OrdersDialog 
        open={isOrdersDialogOpen} 
        onClose={handleCloseOrdersDialog} 
      />
      
      {/* Diálogo de cupons de desconto */}
      <CouponsDialog 
        open={isCouponsDialogOpen} 
        onClose={handleCloseCouponsDialog} 
      />
    </AppBar>
  );
}
