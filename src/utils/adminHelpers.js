// Utilitários para o painel administrativo

export const drawerWidth = 280;

// Mock data para pedidos
export const mockOrders = [
  {
    id: 1,
    customerName: 'João Silva',
    phone: '(11) 99999-9999',
    items: [
      { name: 'Big Burger', quantity: 2, price: 25.00 },
      { name: 'Batata Frita', quantity: 1, price: 12.00 }
    ],
    total: 62.00,
    status: 'pending',
    createdAt: '2025-08-18 14:30',
    observations: 'Sem cebola no burger'
  },
  {
    id: 2,
    customerName: 'Maria Santos',
    phone: '(11) 88888-8888',
    items: [
      { name: 'Cheese Burger', quantity: 1, price: 22.00 },
      { name: 'Refrigerante', quantity: 2, price: 8.00 }
    ],
    total: 38.00,
    status: 'preparing',
    createdAt: '2025-08-18 14:15',
    observations: ''
  },
  {
    id: 3,
    customerName: 'Pedro Costa',
    phone: '(11) 77777-7777',
    items: [
      { name: 'Combo Duplo', quantity: 1, price: 35.00 }
    ],
    total: 35.00,
    status: 'completed',
    createdAt: '2025-08-18 13:45',
    observations: 'Entregar no portão'
  }
];

export const getStatusLabel = (status) => {
  const statusMap = {
    pending: { label: 'Pendente', color: 'warning' },
    preparing: { label: 'Preparando', color: 'info' },
    completed: { label: 'Concluído', color: 'success' },
    cancelled: { label: 'Cancelado', color: 'error' }
  };
  return statusMap[status] || { label: 'Desconhecido', color: 'default' };
};

// Função para calcular estatísticas do dashboard
export const calculateDashboardStats = (orders) => {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const totalRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.total, 0);

  return {
    totalOrders,
    pendingOrders,
    completedOrders,
    totalRevenue
  };
};

// Função para filtrar pedidos
export const filterOrders = (orders, searchTerm, filterStatus) => {
  return orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.phone.includes(searchTerm) ||
                         order.id.toString().includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
};

// Função para filtrar produtos
/**
 * Filtra produtos baseado no termo de busca
 * Busca por nome, categoria ou descrição do produto
 * 
 * @param {Array} products - Array de produtos
 * @param {string} searchTerm - Termo de busca
 * @returns {Array} - Produtos filtrados
 */
export const filterProducts = (products, searchTerm) => {
  if (!searchTerm) return products;
  
  const normalizedTerm = searchTerm.toLowerCase();
  
  return products.filter(product => 
    product.name.toLowerCase().includes(normalizedTerm) ||
    product.category.toLowerCase().includes(normalizedTerm) ||
    (product.description && product.description.toLowerCase().includes(normalizedTerm))
  );
};

/**
 * Filtra clientes baseado no termo de busca
 * Busca por nome, whatsapp, telefone, endereço, bairro ou cidade
 * 
 * @param {Array} clients - Array de clientes
 * @param {string} searchTerm - Termo de busca
 * @returns {Array} - Clientes filtrados
 */
export const filterClients = (clients, searchTerm) => {
  if (!searchTerm) return clients;
  
  const normalizedTerm = searchTerm.toLowerCase();
  
  return clients.filter(client => 
    client.name.toLowerCase().includes(normalizedTerm) ||
    (client.whatsapp && client.whatsapp.toLowerCase().includes(normalizedTerm)) ||
    (client.phone && client.phone.toLowerCase().includes(normalizedTerm)) ||
    (client.street && client.street.toLowerCase().includes(normalizedTerm)) ||
    (client.neighborhood && client.neighborhood.toLowerCase().includes(normalizedTerm)) ||
    (client.address && client.address.toLowerCase().includes(normalizedTerm)) ||
    (client.city && client.city.toLowerCase().includes(normalizedTerm))
  );
};
