'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Container, 
  Skeleton, 
  Fade, 
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import Header from '../components/menu/Header';
import HighlightsSection from '../components/menu/HighlightsSection';
import CategorySection from '../components/menu/CategorySection';
import StickyHeader from '../components/layout/StickyHeader';
import WelcomeBanner from '../components/layout/WelcomeBanner';
import { getRestaurantData, getMenuData } from '../lib/api';
import MobileBottomBar from '../components/layout/MobileBottomBar';
import { CartProvider } from '../context/CartContext';
import CartDrawer from '../components/cart/CartDrawer';
import SideCart from '../components/cart/SideCart';

export default function HomePage() {
  const [restaurant, setRestaurant] = useState(null);
  const [menuData, setMenuData] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showStickyHeader, setShowStickyHeader] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);

  // Dados de exemplo para o banner - em produção viriam da API/admin
  const bannerData = {
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    title: 'Pizza Margherita Especial',
    description: 'Massa artesanal, molho de tomate caseiro, mussarela de búfala e manjericão fresco. Apenas hoje com 30% de desconto!',
    productLink: 'pizza-margherita-123'
  };

  // Use a regular ref to store the DOM node
  const headerRef = useRef(null);

  // Callback ref to get the DOM node and set up the scroll listener
  const setHeaderRef = useCallback(node => {
    if (node) {
      headerRef.current = node;
      const headerHeight = node.offsetHeight;

      const handleScroll = () => {
        if (window.scrollY === 0 || window.scrollY > headerHeight) {
          setShowStickyHeader(true);
        } else {
          setShowStickyHeader(false);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const [fetchedRestaurant, fetchedMenuData] = await Promise.all([
          getRestaurantData(),
          getMenuData()
        ]);
        
        setRestaurant(fetchedRestaurant);
        setMenuData(fetchedMenuData);
        setHighlights(fetchedMenuData.flatMap(category => category.items));
        setCategories(fetchedMenuData.map(category => category.category));
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar o cardápio. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Estados de loading/erro com feedback visual claro
  if (loading) {
    return (
      <CartProvider>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Fade in={loading} timeout={300}>
            <Box>
              {/* Skeleton do StickyHeader */}
              <Box 
                sx={{ 
                  position: 'fixed', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  zIndex: 1100, 
                  bgcolor: 'background.paper' 
                }}
              >
                <Skeleton variant="rectangular" height={64} />
              </Box>
              
              {/* Skeleton do Header principal */}
              <Box sx={{ pt: 8 }}>
                <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Skeleton variant="circular" width={100} height={100} />
                </Box>
                <Skeleton variant="text" sx={{ fontSize: '2rem', mx: 'auto', width: '60%', mb: 1 }} />
                <Skeleton variant="text" sx={{ mx: 'auto', width: '80%', mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <Skeleton variant="rounded" width={80} height={32} />
                </Box>
              </Box>

              {/* Skeleton das seções */}
              <Box sx={{ px: 2 }}>
                {/* Skeleton da seção de destaques */}
                <Skeleton variant="text" sx={{ fontSize: '1.8rem', mb: 2, width: '40%' }} />
                <Box sx={{ display: 'flex', gap: 2, overflowX: 'hidden', mb: 4 }}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Paper key={index} sx={{ minWidth: 220, flex: '0 0 auto' }}>
                      <Skeleton variant="rectangular" height={280} />
                      <Box sx={{ p: 2 }}>
                        <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 1 }} />
                        <Skeleton variant="text" sx={{ mb: 2 }} />
                        <Skeleton variant="text" sx={{ fontSize: '1.4rem', width: '40%' }} />
                      </Box>
                    </Paper>
                  ))}
                </Box>

                {/* Skeleton das categorias */}
                {Array.from({ length: 3 }).map((_, categoryIndex) => (
                  <Box key={categoryIndex} sx={{ mb: 4 }}>
                    <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 2, width: '30%' }} />
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, 
                      gap: 2 
                    }}>
                      {Array.from({ length: 4 }).map((_, itemIndex) => (
                        <Paper key={itemIndex} sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Skeleton variant="rectangular" width={80} height={80} />
                            <Box sx={{ flex: 1 }}>
                              <Skeleton variant="text" sx={{ fontSize: '1.2rem', mb: 1 }} />
                              <Skeleton variant="text" sx={{ mb: 1 }} />
                              <Skeleton variant="text" sx={{ width: '40%' }} />
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Fade>
        </Container>
      </CartProvider>
    );
  }

  if (error) {
    return (
      <CartProvider>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Fade in={!!error} timeout={500}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
              <Alert 
                severity="error" 
                sx={{ 
                  maxWidth: 500,
                  '& .MuiAlert-message': {
                    fontSize: '1.1rem'
                  }
                }}
                action={
                  <button 
                    onClick={() => window.location.reload()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    Tentar novamente
                  </button>
                }
              >
                {error}
              </Alert>
            </Box>
          </Fade>
        </Container>
      </CartProvider>
    );
  }

  return (
    <CartProvider>
      <Box component="main">
        {/* Container principal com layout responsivo */}
        <Container 
          maxWidth="lg" 
          disableGutters
          sx={{ 
            minHeight: '100vh',
            pb: { xs: 8, md: 4 }, // Padding bottom para mobile bar
            position: 'relative'
          }}
        >
          {/* Welcome Banner com transições suaves */}
          <Fade in={showWelcomeBanner} timeout={800}>
            <Box>
              <WelcomeBanner 
                restaurant={restaurant}
                bannerData={bannerData}
                show={showWelcomeBanner}
                onClose={() => setShowWelcomeBanner(false)}
                autoHide={true}
                autoHideDelay={10000}
              />
            </Box>
          </Fade>
          
          {/* Sticky Header com animação suave */}
          <Fade in={showStickyHeader} timeout={300}>
            <Box>
              <StickyHeader 
                restaurant={restaurant} 
                categories={categories} 
                show={showStickyHeader} 
              />
            </Box>
          </Fade>

          {/* Header principal com ref callback */}
          <Header 
            ref={setHeaderRef} 
            restaurant={restaurant} 
            menuData={menuData} 
          />

          {/* Seção de destaques com espaçamento consistente */}
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <HighlightsSection 
              title="🔥 Promoções do Dia" 
              items={highlights} 
            />
          </Box>

          {/* Container das categorias com Grid System responsivo */}
          <Container 
            maxWidth="lg" 
            sx={{ 
              px: { xs: 2, sm: 3 },
              py: 0
            }}
            data-section="categories"
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 3, md: 4 }
              }}
            >
              {menuData.map((category, index) => (
                <Fade 
                  key={category.category} 
                  in={true} 
                  timeout={500}
                  style={{ 
                    transitionDelay: `${index * 100}ms` 
                  }}
                >
                  <Box>
                    <CategorySection category={category} />
                  </Box>
                </Fade>
              ))}
            </Box>
          </Container>

          {/* Mobile Bottom Bar com responsividade */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <MobileBottomBar setCartOpen={setCartOpen} />
          </Box>

          {/* Cart Drawer para mobile */}
          <CartDrawer 
            open={cartOpen} 
            onClose={() => setCartOpen(false)} 
          />

          {/* Side Cart para desktop */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <SideCart />
          </Box>
        </Container>
      </Box>
    </CartProvider>
  );
}

