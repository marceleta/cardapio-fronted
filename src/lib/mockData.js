export const restaurant = {
  name: 'Giga Burguer',
  description: 'O Gigante do Vale.',
  logoUrl: 'https://storage.googleapis.com/prod-cardapio-web/uploads/company/logo/4200/thumb_b1499cd2logo.jpg',
  coverUrl: 'https://storage.googleapis.com/prod-cardapio-web/uploads/company/image/4200/26b616a6CAPA.png',
  isOpen: true,
  address: {
    street: 'Rua Principal, 123',
    neighborhood: 'Centro',
  },
};

export const menuData = [
  {
    category: 'Hambúrgueres',
    items: [
      {
        id: 1,
        name: 'Classic Burger',
        description: 'Pão, carne, queijo, alface, tomate e molho especial.',
        price: '25,00',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1998&auto=format&fit=crop',
        addOns: [
          {
            title: 'Adicionais',
            options: [
              { name: 'Ovo de galinha', price: '2,00' },
              { name: 'Queijo extra', price: '3,50' },
              { name: 'Bacon', price: '4,00' }
            ]
          }
        ]
      },
      {
        id: 2,
        name: 'Bacon Burger',
        description: 'Pão, carne, queijo, bacon crocante, alface e barbecue.',
        price: '28,00',
        imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=2148&auto=format&fit=crop',
        addOns: [
          {
            title: 'Turbine seu lanche',
            options: [
              { name: 'Dobro de carne', price: '8,00' },
              { name: 'Cheddar e bacon', price: '6,50' }
            ]
          },
          {
            title: 'Molho extra',
            options: [
              { name: 'Barbecue', price: '2,00' },
              { name: 'Maionese da casa', price: '2,00' }
            ]
          }
        ]
      },
      {
        id: 3,
        name: 'Chicken Burger',
        description: 'Pão, frango empanado, queijo, alface e maionese.',
        price: '26,00',
        imageUrl: 'https://images.unsplash.com/photo-1606755962746-a2684a53222a?q=80&w=2070&auto=format&fit=crop',
      },
    ],
  },
  {
    category: 'Combos',
    items: [
      {
        id: 4,
        name: 'Combo Classic',
        description: 'Classic Burger + Fritas + Refrigerante.',
        price: '38,00',
        imageUrl: 'https://images.unsplash.com/photo-1596662951592-9494b1605258?q=80&w=2148&auto=format&fit=crop',
      },
      {
        id: 5,
        name: 'Combo Bacon',
        description: 'Bacon Burger + Fritas + Refrigerante.',
        price: '42,00',
        imageUrl: 'https://images.unsplash.com/photo-1604467707610-df0273ac331a?q=80&w=2070&auto=format&fit=crop',
      },
    ],
  },
  {
    category: 'Bebidas',
    items: [
      {
        id: 6,
        name: 'Coca-Cola',
        description: 'Lata 350ml.',
        price: '5,00',
        imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32a2ea7?q=80&w=2070&auto=format&fit=crop',
      },
      {
        id: 7,
        name: 'Guaraná Antarctica',
        description: 'Lata 350ml.',
        price: '5,00',
        imageUrl: 'https://images.unsplash.com/photo-1633140433436-77d15a80b185?q=80&w=1974&auto=format&fit=crop',
      },
    ],
  },
];

export const restaurantInfo = {
  logo: 'https://via.placeholder.com/100', // Placeholder image
  name: 'M Burguer',
  instagram: 'https://www.instagram.com/seuinstragram',
  phone: '+55 11 98765-4321',
  whatsapp: '+55 11 98765-4321',
  address: 'Rua Exemplo, 123 - Bairro, Cidade - SP',
};

export const operatingHours = [
  { day: 'Segunda-feira', hours: '18:00 - 23:00' },
  { day: 'Terça-feira', hours: '18:00 - 23:00' },
  { day: 'Quarta-feira', hours: 'Fechado' },
  { day: 'Quinta-feira', hours: '18:00 - 23:00' },
  { day: 'Sexta-feira', hours: '18:00 - 00:00' },
  { day: 'Sábado', hours: '12:00 - 00:00' },
  { day: 'Domingo', hours: '12:00 - 22:00' },
];

export const paymentMethods = [
  'Dinheiro',
  'Cartão de Crédito',
  'Cartão de Débito',
  'Pix',
  'Vale Refeição',
];