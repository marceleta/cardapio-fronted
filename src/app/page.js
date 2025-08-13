'use client';

import { useRef, useState, useEffect, useCallback } from 'react'; // Added imports
import Header from '../components/menu/Header';
import HighlightsSection from '../components/menu/HighlightsSection';
import CategorySection from '../components/menu/CategorySection';
import StickyHeader from '../components/layout/StickyHeader'; // Added import
import { getRestaurantData, getMenuData } from '../lib/api';
import { Box } from '@mui/material'; // Added import
import MobileBottomBar from '../components/layout/MobileBottomBar'; // Added import
import { CartProvider } from '../context/CartContext'; // Added import
import CartDrawer from '../components/cart/CartDrawer'; // Added import

export default function HomePage() { // Changed to client component
  const [restaurant, setRestaurant] = useState(null);
  const [menuData, setMenuData] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [cartOpen, setCartOpen] = useState(false); // Added state for cart drawer

  // Use a regular ref to store the DOM node
  const headerRef = useRef(null);

  // Callback ref to get the DOM node and set up the scroll listener
  const setHeaderRef = useCallback(node => {
    console.log('headerHeight')
    if (node) {
      headerRef.current = node; // Store the node in the regular ref

      const headerHeight = node.offsetHeight;

      const handleScroll = () => {
        if (window.scrollY > headerHeight) {
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
        <StickyHeader restaurant={restaurant} categories={categories} show={showStickyHeader} />
        <Header ref={setHeaderRef} restaurant={restaurant} menuData={menuData} />
        <HighlightsSection title="Promoções do Dia" items={highlights} />
        <Box sx={{ padding: '0 1rem' }}>
          {menuData.map((category, index) => (
            <CategorySection key={index} category={category} />
          ))}
        </Box>
        <MobileBottomBar setCartOpen={setCartOpen} /> {/* Render MobileBottomBar */}
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} /> {/* Render CartDrawer */}
      </Box>
    </CartProvider>
  );
}

