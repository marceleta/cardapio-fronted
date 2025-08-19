import { render, screen } from '@testing-library/react';
import HomePage from '../page';
import ThemeRegistry from '../../components/ThemeRegistry';
import { AuthProvider } from '../../context/AuthContext';

operatingHours: [
    { day: 'Segunda-feira', hours: '18:00 - 23:00' },
    { day: 'Terça-feira', hours: '18:00 - 23:00' },
    { day: 'Quarta-feira', hours: 'Fechado' },
    { day: 'Quinta-feira', hours: '18:00 - 23:00' },
    { day: 'Sexta-feira', hours: '18:00 - 00:00' },
    { day: 'Sábado', hours: '12:00 - 00:00' },
    { day: 'Domingo', hours: '12:00 - 22:00' },
  ],

// Mock data and providers if needed
jest.mock('../../lib/mockData', () => ({
  menuData: [
    {
      category: 'Hambúrgueres',
      items: [
        { id: 101, name: 'Classic Burger', description: 'Delicioso hambúrguer clássico', price: '25,00', imageUrl: '/burger.jpg' }
      ]
    },
    {
      category: 'Bebidas',
      items: [
        { id: 201, name: 'Refrigerante', description: 'Bebida gelada', price: '7,00', imageUrl: '/soda.jpg' }
      ]
    }
  ],
  restaurant: {
    name: 'Nome do Restaurante',
    logoUrl: '/logo.png',
    description: 'Restaurante de teste',
    coverUrl: '/cover.png',
    isOpen: true,
    address: {
      street: 'Rua Teste',
      neighborhood: 'Centro'
    },
    phone: '+55 11 98765-4321',
    instagram: 'https://www.instagram.com/seuinstragram',
    whatsapp: '+55 11 98765-4321'
  },
  restaurantInfo: {
    name: 'Nome do Restaurante',
    logoUrl: '/logo.png',
    description: 'Restaurante de teste',
    coverUrl: '/cover.png',
    isOpen: true,
    address: {
      street: 'Rua Teste',
      neighborhood: 'Centro'
    },
    phone: '+55 11 98765-4321',
    instagram: 'https://www.instagram.com/seuinstragram',
    whatsapp: '+55 11 98765-4321'
  }
}));

// Ajuste o caminho do logo conforme seu projeto
const RESTAURANT_NAME = 'Giga Burguer';
const LOGO_ALT = 'Logo de Giga Burguer';

describe('Home Page', () => {

  it('exibe nome e logo do restaurante no header', async () => {
    render(
      <ThemeRegistry>
        <AuthProvider>
          <HomePage />
        </AuthProvider>
      </ThemeRegistry>
    );
    expect(await screen.findAllByText(RESTAURANT_NAME)).not.toHaveLength(0);
    expect(await screen.findAllByAltText(LOGO_ALT)).not.toHaveLength(0);
  });

  it('exibe categorias e produtos do menu', async () => {
    render(
      <ThemeRegistry>
        <AuthProvider>
          <HomePage />
        </AuthProvider>
      </ThemeRegistry>
    );
    expect(await screen.findByText('Hambúrgueres')).toBeInTheDocument();
    expect(await screen.findByText('Bebidas')).toBeInTheDocument();
    expect(await screen.findAllByText('Classic Burger')).not.toHaveLength(0);
    expect(await screen.findAllByText('Coca-Cola')).not.toHaveLength(0);
  });

  // Adicione outros testes de responsividade e navegação conforme necessário
});
