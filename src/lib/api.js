import { restaurant, menuData } from './mockData';

// Simulate an API call
export async function getRestaurantData() {
  return Promise.resolve(restaurant);
}

export async function getMenuData() {
  return Promise.resolve(menuData);
}

// CLIENTES API - Preparado para integração futura com backend
export const clientsAPI = {
  // Buscar todos os clientes
  async getAll() {
    try {
      // Simula uma chamada HTTP GET /api/clients
      const response = await fetch('/api/clients');
      if (!response.ok) throw new Error('Falha ao buscar clientes');
      return await response.json();
    } catch (error) {
      console.log('API não disponível, usando dados mock');
      // Retorna dados mock enquanto não há backend
      return Promise.resolve([]);
    }
  },

  // Buscar cliente por ID
  async getById(id) {
    try {
      // Simula uma chamada HTTP GET /api/clients/:id
      const response = await fetch(`/api/clients/${id}`);
      if (!response.ok) throw new Error('Falha ao buscar cliente');
      return await response.json();
    } catch (error) {
      console.log('API não disponível, usando dados mock');
      return Promise.resolve(null);
    }
  },

  // Criar novo cliente
  async create(clientData) {
    try {
      // Simula uma chamada HTTP POST /api/clients
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData)
      });
      if (!response.ok) throw new Error('Falha ao criar cliente');
      return await response.json();
    } catch (error) {
      console.log('API não disponível, simulando criação de cliente');
      // Simula sucesso local
      return Promise.resolve({ id: Date.now(), ...clientData });
    }
  },

  // Atualizar cliente existente
  async update(id, clientData) {
    try {
      // Simula uma chamada HTTP PUT /api/clients/:id
      const response = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData)
      });
      if (!response.ok) throw new Error('Falha ao atualizar cliente');
      return await response.json();
    } catch (error) {
      console.log('API não disponível, simulando atualização de cliente');
      // Simula sucesso local
      return Promise.resolve({ id, ...clientData });
    }
  },

  // Excluir cliente
  async delete(id) {
    try {
      // Simula uma chamada HTTP DELETE /api/clients/:id
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Falha ao excluir cliente');
      return await response.json();
    } catch (error) {
      console.log('API não disponível, simulando exclusão de cliente');
      // Simula sucesso local
      return Promise.resolve({ message: 'Cliente excluído com sucesso' });
    }
  },

  // Buscar clientes por termo
  async search(searchTerm) {
    try {
      // Simula uma chamada HTTP GET /api/clients/search?q=termo
      const response = await fetch(`/api/clients/search?q=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) throw new Error('Falha na busca de clientes');
      return await response.json();
    } catch (error) {
      console.log('API não disponível, usando busca local');
      return Promise.resolve([]);
    }
  }
};
