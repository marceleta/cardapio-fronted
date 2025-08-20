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

// DADOS MOCK PARA CLIENTES
export const mockClients = [
  {
    id: 1,
    name: 'João Silva Santos',
    whatsapp: '(11) 99999-1234',
    phone: '(11) 99999-1234', // compatibilidade
    street: 'Rua das Flores',
    number: '123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    zipCode: '01310-100',
    address: 'Rua das Flores, 123 - Centro', // compatibilidade
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    orderCount: 15,
    lastOrder: '2024-12-10T18:30:00Z'
  },
  {
    id: 2,
    name: 'Maria Oliveira Costa',
    whatsapp: '(11) 98888-5678',
    phone: '(11) 98888-5678',
    street: 'Av. Central',
    number: '456',
    neighborhood: 'Vila Madalena',
    city: 'São Paulo',
    zipCode: '05432-020',
    address: 'Av. Central, 456 - Vila Madalena',
    status: 'active',
    createdAt: '2024-02-20T14:15:00Z',
    orderCount: 8,
    lastOrder: '2024-12-08T20:45:00Z'
  },
  {
    id: 3,
    name: 'Pedro Henrique Lima',
    whatsapp: '(11) 97777-9012',
    phone: '(11) 97777-9012',
    street: 'Rua do Comércio',
    number: '789',
    neighborhood: 'Centro',
    city: 'Guarulhos',
    zipCode: '07110-005',
    address: 'Rua do Comércio, 789 - Centro',
    status: 'active',
    createdAt: '2024-03-10T09:30:00Z',
    orderCount: 22,
    lastOrder: '2024-12-09T19:15:00Z'
  },
  {
    id: 4,
    name: 'Ana Carolina Ferreira',
    whatsapp: '(11) 96666-3456',
    phone: '(11) 96666-3456',
    street: 'Rua Verde',
    number: '321',
    neighborhood: 'Jardins',
    city: 'São Paulo',
    zipCode: '01419-000',
    address: 'Rua Verde, 321 - Jardins',
    status: 'pending',
    createdAt: '2024-11-01T16:20:00Z',
    orderCount: 1,
    lastOrder: '2024-11-01T20:00:00Z'
  },
  {
    id: 5,
    name: 'Carlos Roberto Souza',
    whatsapp: '(11) 95555-7890',
    phone: '(11) 95555-7890',
    street: 'Av. Paulista',
    number: '1000',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    zipCode: '01310-100',
    address: 'Av. Paulista, 1000 - Bela Vista',
    status: 'inactive',
    createdAt: '2024-01-05T11:45:00Z',
    orderCount: 3,
    lastOrder: '2024-06-15T12:30:00Z'
  },
  {
    id: 6,
    name: 'Fernanda Alves Santos',
    whatsapp: '(11) 94444-2468',
    phone: '(11) 94444-2468',
    street: 'Rua da Paz',
    number: '555',
    neighborhood: 'Vila Nova',
    city: 'Osasco',
    zipCode: '06030-230',
    address: 'Rua da Paz, 555 - Vila Nova',
    status: 'active',
    createdAt: '2024-04-25T13:10:00Z',
    orderCount: 12,
    lastOrder: '2024-12-05T21:00:00Z'
  },
  {
    id: 7,
    name: 'Rafael Gonçalves Silva',
    whatsapp: '(11) 93333-1357',
    phone: '(11) 93333-1357',
    street: 'Rua Nova',
    number: '888',
    neighborhood: 'Mooca',
    city: 'São Paulo',
    zipCode: '03104-010',
    address: 'Rua Nova, 888 - Mooca',
    status: 'active',
    createdAt: '2024-05-15T15:25:00Z',
    orderCount: 6,
    lastOrder: '2024-12-07T17:45:00Z'
  },
  {
    id: 8,
    name: 'Juliana Martins Pereira',
    whatsapp: '(11) 92222-9753',
    phone: '(11) 92222-9753',
    street: 'Av. Independência',
    number: '200',
    neighborhood: 'Centro',
    city: 'Santo André',
    zipCode: '09015-070',
    address: 'Av. Independência, 200 - Centro',
    status: 'active',
    createdAt: '2024-07-08T08:50:00Z',
    orderCount: 9,
    lastOrder: '2024-12-06T19:30:00Z'
  }
];