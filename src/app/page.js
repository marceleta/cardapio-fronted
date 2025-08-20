'use client';

import { useRef, useState, useEffect, useCallback } from 'react'; // Added imports
import Header from '../components/menu/Header';
import HighlightsSection from '../components/menu/HighlightsSection';
import CategorySection from '../components/menu/CategorySection';
import StickyHeader from '../components/layout/StickyHeader'; // Added import
import WelcomeBanner from '../components/layout/WelcomeBanner'; // Added import
import { getRestaurantData, getMenuData } from '../lib/api';
import { Box } from '@mui/material'; // Added import
import MobileBottomBar from '../components/layout/MobileBottomBar'; // Added import
import { CartProvider } from '../context/CartContext'; // Added import
import CartDrawer from '../components/cart/CartDrawer'; // Added import
import SideCart from '../components/cart/SideCart'; // Added import

export default function HomePage() { // Changed to client component
  const [restaurant, setRestaurant] = useState(null);
  const [menuData, setMenuData] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showStickyHeader, setShowStickyHeader] = useState(true); // Changed to true to show at top
  const [cartOpen, setCartOpen] = useState(false); // Added state for cart drawer
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true); // Added state for welcome banner

  // Dados de exemplo para o banner - em produção viriam da API/admin
  const bannerData = {
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    title: 'Pizza Margherita Especial',
    description: 'Massa artesanal, molho de tomate caseiro, mussarela de búfala e manjericão fresco. Apenas hoje com 30% de desconto!',
    productLink: 'pizza-margherita-123' // ID do produto para scroll/navegação
  };

  // Use a regular ref to store the DOM node
  const headerRef = useRef(null);

  // Callback ref to get the DOM node and set up the scroll listener
  const setHeaderRef = useCallback(node => {
    console.log('headerHeight')
    if (node) {
      headerRef.current = node; // Store the node in the regular ref

      const headerHeight = node.offsetHeight;

      const handleScroll = () => {
        if (window.scrollY === 0 || window.scrollY > headerHeight) {
          setShowStickyHeader(true);
        } else {
          setShowStickyHeader(false);
        }
      };

      window.addEventListener('scroll', handleScroll);
      // Return a cleanup function to remove the event listener
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []); // Empty dependency array for useCallback

  useEffect(() => {
    async function fetchData() {
      const fetchedRestaurant = await getRestaurantData();
      const fetchedMenuData = await getMenuData();
      setRestaurant(fetchedRestaurant);
      setMenuData(fetchedMenuData);
      setHighlights(fetchedMenuData.flatMap(category => category.items));
      setCategories(fetchedMenuData.map(category => category.category));
    }
    fetchData();
  }, []);

  if (!restaurant || !menuData) {
    return <Box>Loading...</Box>; // Or a proper loading spinner
  }

  return (
    <CartProvider> {/* Wrapped with CartProvider */}
      <Box component="main" sx={{ maxWidth: 'var(--max-width)', margin: 'auto', paddingBottom: '50px' }}>
        {/* Welcome Banner */}
        <WelcomeBanner 
          restaurant={restaurant}
          bannerData={bannerData}
          show={showWelcomeBanner}
          onClose={() => setShowWelcomeBanner(false)}
          autoHide={true}
          autoHideDelay={10000}
        />
        
        <StickyHeader restaurant={restaurant} categories={categories} show={showStickyHeader} />
        <Header ref={setHeaderRef} restaurant={restaurant} menuData={menuData} />
        <HighlightsSection title="Promoções do Dia" items={highlights} />
        <Box sx={{ padding: '0 1rem' }} data-section="categories">
          {menuData.map((category, index) => (
            <CategorySection key={index} category={category} />
          ))}
        </Box>
        <MobileBottomBar setCartOpen={setCartOpen} /> {/* Render MobileBottomBar */}
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} /> {/* Render CartDrawer */}
        <SideCart /> {/* Render SideCart for desktop */}
      </Box>
    </CartProvider>
  );
}

