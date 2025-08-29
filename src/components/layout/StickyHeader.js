/**
 * CABEÇALHO FIXO - NAVEGAÇÃO PRINCIPAL
 * 
 * Componente de cabeçalho que aparece fixo no topo da página quando o usuário
 * faz scroll, fornecendo acesso rápido às principais funcionalidades do sistema.
 * 
 * Funcionalidades:
 * - Exibição condicionada baseada no scroll da página
 * - Busca por produtos em tempo real
 * - Navegação por categorias via dropdown
 * - Acesso rápido a conta do usuário e pedidos
 * - Link direto para painel administrativo
 * - Layout responsivo para diferentes breakpoints
 */

'use client';

// Importações do React e hooks
import { useState, useEffect } from 'react';

// Importações do Material-UI
import { 
  AppBar, 
  Toolbar, 
  Box, 
  Typography, 
  Autocomplete, 
  TextField, 
  Button, 
  Avatar 
} from '@mui/material';
import { 
  Home, 
  ShoppingCart, 
  Person, 
  LocalOffer 
} from '@mui/icons-material';

// Importações de componentes locais
import AccountDialog from '../account/AccountDialog';
import OrdersDialog from '../account/OrdersDialog';
import CouponsDialog from '../account/CouponsDialog';

/**
 * COMPONENTE PRINCIPAL DO CABEÇALHO FIXO
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.restaurant - Dados do restaurante (nome, logo)
 * @param {Array} props.categories - Lista de categorias para navegação
 * @param {boolean} props.show - Controla visibilidade do cabeçalho
 * @returns {JSX.Element} Elemento AppBar com navegação principal
 */
export default function StickyHeader({ restaurant, categories, show }) {
  // Estados locais para controle de visibilidade
  const [isVisible, setIsVisible] = useState(false);
  
  // Estados para controle dos diálogos
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const [isOrdersDialogOpen, setIsOrdersDialogOpen] = useState(false);
  const [isCouponsDialogOpen, setIsCouponsDialogOpen] = useState(false);

  /**
   * EFEITO PARA SINCRONIZAR VISIBILIDADE
   * Atualiza estado local baseado na prop show recebida
   */
  useEffect(() => {
    setIsVisible(show);
  }, [show]);

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

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'white',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease-in-out',
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        zIndex: 1300, // Maior que o WelcomeBanner (1300)
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', gap: '1rem', padding: '0 1rem' }}>
        {/* SEÇÃO ESQUERDA - LOGO E NOME DO RESTAURANTE */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Avatar com logo do restaurante */}
          <Avatar 
            src={restaurant.logoUrl} 
            alt={`Logo de ${restaurant.name}`} 
            sx={{ width: 40, height: 40 }} 
          />
          
          {/* Nome do restaurante - oculto em mobile */}
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'primary.main', 
              fontWeight: 'bold', 
              display: { xs: 'none', sm: 'block' } 
            }}
          >
            {restaurant.name}
          </Typography>
        </Box>

        {/* SEÇÃO CENTRAL - BUSCA E NAVEGAÇÃO */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem', 
          flexGrow: 1, 
          justifyContent: 'center' 
        }}>
          {/* Dropdown de navegação por categorias */}
          <Autocomplete
            options={categories}
            renderInput={(params) => <TextField {...params} label="Categorias" size="small" />}
            sx={{ 
              flexGrow: 1, 
              maxWidth: '150px', 
              display: { xs: 'block', md: 'block' } 
            }}
            onChange={(event, value) => {
              if (value) {
                // Converte nome da categoria para ID do elemento
                const categoryId = value.replace(/\s+/g, '-').toLowerCase();
                const element = document.getElementById(categoryId);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }}
          />
          
          {/* Campo de busca por produtos */}
          <TextField
            placeholder="Buscar um produto..."
            variant="outlined"
            size="small"
            sx={{ 
              flexGrow: 1, 
              maxWidth: '180px', 
              display: { xs: 'block', md: 'block' } 
            }}
          />
        </Box>

        {/* SEÇÃO DIREITA - BOTÕES DE AÇÃO */}
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          {/* Botão Início - volta ao topo */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<Home />}
            onClick={handleScrollToTop}
            sx={{
              minWidth: 'auto',
              padding: '6px 12px',
              '& .MuiButton-startIcon': { margin: 0 },
              display: { xs: 'none', sm: 'flex' }
            }}
          >
            <Typography sx={{ display: { xs: 'none', md: 'block' } }}>
              Início
            </Typography>
          </Button>
          
          {/* Botão Pedidos - abre diálogo de pedidos */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<ShoppingCart />}
            onClick={handleOpenOrdersDialog}
            sx={{
              minWidth: 'auto',
              padding: '6px 12px',
              '& .MuiButton-startIcon': { margin: 0 },
              display: { xs: 'none', sm: 'flex' }
            }}
          >
            <Typography sx={{ display: { xs: 'none', md: 'block' } }}>
              Pedidos
            </Typography>
          </Button>
          
          {/* Botão Cupons - abre diálogo de cupons de desconto */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<LocalOffer />}
            onClick={handleOpenCouponsDialog}
            sx={{
              minWidth: 'auto',
              padding: '6px 12px',
              '& .MuiButton-startIcon': { margin: 0 },
              display: { xs: 'none', sm: 'flex' }
            }}
          >
            <Typography sx={{ display: { xs: 'none', md: 'block' } }}>
              Cupons
            </Typography>
          </Button>
          
          {/* Botão Minha Conta - abre diálogo de conta */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<Person />}
            onClick={handleOpenAccountDialog}
            sx={{
              minWidth: 'auto',
              padding: '6px 12px',
              '& .MuiButton-startIcon': { margin: 0 },
              display: { xs: 'none', sm: 'flex' }
            }}
          >
            <Typography sx={{ display: { xs: 'none', md: 'block' } }}>
              Minha conta
            </Typography>
          </Button>
        </Box>
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