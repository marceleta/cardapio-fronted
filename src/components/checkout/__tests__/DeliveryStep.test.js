/**
 * TESTES DO COMPONENTE - DELIVERY STEP
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do componente DeliveryStep (PASSO 2: Seleção do Tipo de Entrega).
 * 
 * Cobertura:
 * - Renderização correta
 * - Seleção de tipos de entrega
 * - Formulário de endereço
 * - Validações de entrada
 * - Cálculo de taxas
 * - Casos extremos e tratamento de erros
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Componente sendo testado
import DeliveryStep from '../steps/DeliveryStep';

// Utilitários de teste customizados
import {
  renderWithCheckoutProviders,
  createMockAuthContext,
  createMockCheckoutContext,
  createMockAddress,
  createMockUser,
  fillAddressForm,
  waitForDelay
} from './test-utils';

// Mocks de dependências
jest.mock('../../../context/AuthContext');
jest.mock('../../../context/CheckoutContext');

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('DeliveryStep - Etapa de Entrega', () => {
  // Mocks padrão para testes
  let mockAuthContext;
  let mockCheckoutContext;

  // Configuração antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockAuthContext = createMockAuthContext({
      user: createMockUser({
        addresses: [
          createMockAddress({
            id: '1',
            street: 'Rua das Flores, 123',
            neighborhood: 'Centro',
            isDefault: true
          })
        ]
      })
    });
    
    mockCheckoutContext = createMockCheckoutContext({
      deliveryType: null,
      deliveryAddress: null,
      deliveryFee: 0
    });
    
    // Mock dos hooks de contexto
    require('../../../context/AuthContext').useAuth.mockReturnValue(mockAuthContext);
    require('../../../context/CheckoutContext').useCheckout.mockReturnValue(mockCheckoutContext);
  });

  /**
   * HELPER: Renderiza componente DeliveryStep com contextos mockados
   */
  const renderDeliveryStep = (authOverrides = {}, checkoutOverrides = {}) => {
    const authContext = { ...mockAuthContext, ...authOverrides };
    const checkoutContext = { ...mockCheckoutContext, ...checkoutOverrides };
    
    require('../../../context/AuthContext').useAuth.mockReturnValue(authContext);
    require('../../../context/CheckoutContext').useCheckout.mockReturnValue(checkoutContext);
    
    return renderWithCheckoutProviders(<DeliveryStep />);
  };

  /**
   * GRUPO: Testes de Renderização
   */
  describe('Renderização', () => {
    test('deve renderizar o componente corretamente', () => {
      // ACT: Renderizar componente
      renderDeliveryStep();

      // ASSERT: Verificar elementos principais
      expect(screen.getByText('Como você quer receber?')).toBeInTheDocument();
      expect(screen.getByText('Escolha o tipo de entrega do seu pedido')).toBeInTheDocument();
      expect(screen.getByText('🏪 Retirada no Local')).toBeInTheDocument();
      expect(screen.getByText('🛵 Entrega')).toBeInTheDocument();
    });

    test('deve mostrar informações da retirada no local', () => {
      // ACT: Renderizar componente
      renderDeliveryStep();

      // ASSERT: Verificar detalhes da retirada
      expect(screen.getByText('Gratuito')).toBeInTheDocument();
      expect(screen.getByText('Retire seu pedido diretamente em nossa loja')).toBeInTheDocument();
      expect(screen.getByText('Pronto em 15-20 minutos')).toBeInTheDocument();
    });

    test('deve mostrar informações da entrega', () => {
      // ACT: Renderizar componente
      renderDeliveryStep();

      // ASSERT: Verificar detalhes da entrega
      expect(screen.getByText('A partir de R$ 5,00')).toBeInTheDocument();
      expect(screen.getByText('Entregamos na sua casa ou escritório')).toBeInTheDocument();
      expect(screen.getByText('30-45 minutos')).toBeInTheDocument();
    });

    test('deve renderizar endereços salvos quando existe usuário logado', () => {
      // ACT: Renderizar componente
      renderDeliveryStep();

      // ASSERT: Verificar se endereços são mostrados
      expect(screen.getByText('Rua das Flores, 123')).toBeInTheDocument();
      expect(screen.getByText('Centro')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Seleção de Tipo de Entrega
   */
  describe('Seleção de Tipo de Entrega', () => {
    test('deve selecionar retirada no local', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Renderizar e selecionar retirada
      renderDeliveryStep();
      const pickupCard = screen.getByTestId('pickup-option');
      await user.click(pickupCard);

      // ASSERT: Verificar que setDeliveryType foi chamado
      expect(mockCheckoutContext.setDeliveryType).toHaveBeenCalledWith('pickup');
      expect(mockCheckoutContext.setDeliveryFee).toHaveBeenCalledWith(0);
    });

    test('deve selecionar entrega e mostrar formulário de endereço', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Renderizar e selecionar entrega
      renderDeliveryStep();
      const deliveryCard = screen.getByTestId('delivery-option');
      await user.click(deliveryCard);

      // ASSERT: Verificar que setDeliveryType foi chamado
      expect(mockCheckoutContext.setDeliveryType).toHaveBeenCalledWith('delivery');

      // ASSERT: Verificar que formulário de endereço apareceu
      await waitFor(() => {
        expect(screen.getByText('Endereço de Entrega')).toBeInTheDocument();
      });
    });

    test('deve marcar visualmente opção selecionada', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Renderizar e selecionar retirada
      renderDeliveryStep();
      const pickupCard = screen.getByTestId('pickup-option');
      await user.click(pickupCard);

      // ASSERT: Verificar marcação visual
      expect(pickupCard).toHaveClass('selected');
    });

    test('deve permitir mudança de tipo de entrega', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Selecionar entrega primeiro, depois retirada
      renderDeliveryStep();
      
      const deliveryCard = screen.getByTestId('delivery-option');
      await user.click(deliveryCard);
      
      const pickupCard = screen.getByTestId('pickup-option');
      await user.click(pickupCard);

      // ASSERT: Verificar mudança
      expect(mockCheckoutContext.setDeliveryType).toHaveBeenCalledWith('delivery');
      expect(mockCheckoutContext.setDeliveryType).toHaveBeenCalledWith('pickup');
    });
  });

  /**
   * GRUPO: Testes de Endereços Salvos
   */
  describe('Endereços Salvos', () => {
    test('deve listar endereços salvos do usuário', () => {
      // ARRANGE: Usuário com múltiplos endereços
      const userWithMultipleAddresses = createMockUser({
        addresses: [
          createMockAddress({
            id: '1',
            street: 'Rua A, 123',
            neighborhood: 'Centro',
            isDefault: true
          }),
          createMockAddress({
            id: '2',
            street: 'Rua B, 456',
            neighborhood: 'Vila Nova',
            isDefault: false
          })
        ]
      });

      // ACT: Renderizar com múltiplos endereços
      renderDeliveryStep({ user: userWithMultipleAddresses });

      // ASSERT: Verificar que ambos endereços são mostrados
      expect(screen.getByText('Rua A, 123')).toBeInTheDocument();
      expect(screen.getByText('Rua B, 456')).toBeInTheDocument();
      expect(screen.getByText('Centro')).toBeInTheDocument();
      expect(screen.getByText('Vila Nova')).toBeInTheDocument();
    });

    test('deve marcar endereço padrão visualmente', () => {
      // ACT: Renderizar componente
      renderDeliveryStep();

      // ASSERT: Verificar marcação do endereço padrão
      const defaultBadge = screen.getByText('Padrão');
      expect(defaultBadge).toBeInTheDocument();
    });

    test('deve selecionar endereço salvo', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Selecionar entrega e depois endereço
      renderDeliveryStep();
      
      const deliveryCard = screen.getByTestId('delivery-option');
      await user.click(deliveryCard);
      
      await waitFor(() => {
        const addressCard = screen.getByTestId('saved-address-1');
        return user.click(addressCard);
      });

      // ASSERT: Verificar que endereço foi selecionado
      expect(mockCheckoutContext.setDeliveryAddress).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          street: 'Rua das Flores, 123'
        })
      );
    });

    test('deve calcular taxa de entrega ao selecionar endereço', async () => {
      // ARRANGE: Configurar userEvent e mock de cálculo
      const user = userEvent.setup();
      mockCheckoutContext.calculateDeliveryFee.mockResolvedValue(8.50);

      // ACT: Selecionar entrega e endereço
      renderDeliveryStep();
      
      const deliveryCard = screen.getByTestId('delivery-option');
      await user.click(deliveryCard);
      
      await waitFor(() => {
        const addressCard = screen.getByTestId('saved-address-1');
        return user.click(addressCard);
      });

      // ASSERT: Verificar que taxa foi calculada
      expect(mockCheckoutContext.calculateDeliveryFee).toHaveBeenCalled();
      expect(mockCheckoutContext.setDeliveryFee).toHaveBeenCalledWith(8.50);
    });
  });

  /**
   * GRUPO: Testes de Novo Endereço
   */
  describe('Novo Endereço', () => {
    test('deve mostrar formulário para novo endereço', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Selecionar entrega e clicar em adicionar endereço
      renderDeliveryStep();
      
      const deliveryCard = screen.getByTestId('delivery-option');
      await user.click(deliveryCard);
      
      await waitFor(() => {
        const addButton = screen.getByText('Adicionar Novo Endereço');
        return user.click(addButton);
      });

      // ASSERT: Verificar campos do formulário
      await waitFor(() => {
        expect(screen.getByLabelText(/CEP/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Rua/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Número/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Bairro/i)).toBeInTheDocument();
      });
    });

    test('deve preencher endereço automaticamente via CEP', async () => {
      // ARRANGE: Configurar userEvent e mock de CEP
      const user = userEvent.setup();
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          logradouro: 'Rua das Palmeiras',
          bairro: 'Jardim América',
          localidade: 'São Paulo',
          uf: 'SP'
        })
      });

      // ACT: Preencher CEP
      renderDeliveryStep();
      
      const deliveryCard = screen.getByTestId('delivery-option');
      await user.click(deliveryCard);
      
      await waitFor(async () => {
        const addButton = screen.getByText('Adicionar Novo Endereço');
        await user.click(addButton);
      });
      
      await waitFor(async () => {
        const cepField = screen.getByLabelText(/CEP/i);
        await user.type(cepField, '01310100');
      });

      // ASSERT: Verificar preenchimento automático
      await waitFor(() => {
        expect(screen.getByDisplayValue('Rua das Palmeiras')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Jardim América')).toBeInTheDocument();
      });
    });

    test('deve validar campos obrigatórios do endereço', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Tentar salvar endereço sem preencher
      renderDeliveryStep();
      
      const deliveryCard = screen.getByTestId('delivery-option');
      await user.click(deliveryCard);
      
      await waitFor(async () => {
        const addButton = screen.getByText('Adicionar Novo Endereço');
        await user.click(addButton);
      });
      
      await waitFor(async () => {
        const saveButton = screen.getByText('Salvar Endereço');
        await user.click(saveButton);
      });

      // ASSERT: Verificar mensagens de validação
      await waitFor(() => {
        expect(screen.getByText('CEP é obrigatório')).toBeInTheDocument();
      });
    });

    test('deve salvar novo endereço corretamente', async () => {
      // ARRANGE: Configurar userEvent e mock
      const user = userEvent.setup();
      mockAuthContext.addAddress.mockResolvedValue({
        success: true,
        address: createMockAddress({ id: '2' })
      });

      // ACT: Preencher e salvar novo endereço
      renderDeliveryStep();
      
      const deliveryCard = screen.getByTestId('delivery-option');
      await user.click(deliveryCard);
      
      await waitFor(async () => {
        const addButton = screen.getByText('Adicionar Novo Endereço');
        await user.click(addButton);
      });
      
      await fillAddressForm(user, {
        cep: '01310-100',
        street: 'Rua Nova',
        number: '456',
        neighborhood: 'Centro',
        complement: 'Apt 12'
      });
      
      await waitFor(async () => {
        const saveButton = screen.getByText('Salvar Endereço');
        await user.click(saveButton);
      });

      // ASSERT: Verificar que addAddress foi chamado
      expect(mockAuthContext.addAddress).toHaveBeenCalledWith({
        cep: '01310-100',
        street: 'Rua Nova',
        number: '456',
        neighborhood: 'Centro',
        complement: 'Apt 12',
        isDefault: false
      });
    });

    test('deve formatar CEP automaticamente', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Digitar CEP
      renderDeliveryStep();
      
      const deliveryCard = screen.getByTestId('delivery-option');
      await user.click(deliveryCard);
      
      await waitFor(async () => {
        const addButton = screen.getByText('Adicionar Novo Endereço');
        await user.click(addButton);
      });
      
      await waitFor(async () => {
        const cepField = screen.getByLabelText(/CEP/i);
        await user.type(cepField, '01310100');
      });

      // ASSERT: Verificar formatação
      const cepField = screen.getByLabelText(/CEP/i);
      expect(cepField.value).toBe('01310-100');
    });
  });

  /**
   * GRUPO: Testes de Cálculo de Taxa
   */
  describe('Cálculo de Taxa de Entrega', () => {
    test('deve calcular taxa baseada na distância', async () => {
      // ARRANGE: Configurar mock de cálculo
      const user = userEvent.setup();
      mockCheckoutContext.calculateDeliveryFee.mockResolvedValue(12.00);

      // ACT: Selecionar entrega e endereço
      renderDeliveryStep();
      
      const deliveryCard = screen.getByTestId('delivery-option');
      await user.click(deliveryCard);
      
      await waitFor(() => {
        const addressCard = screen.getByTestId('saved-address-1');
        return user.click(addressCard);
      });

      // ASSERT: Verificar cálculo
      await waitFor(() => {
        expect(screen.getByText('Taxa de entrega: R$ 12,00')).toBeInTheDocument();
      });
    });

    test('deve mostrar mensagem quando endereço está fora da área', async () => {
      // ARRANGE: Configurar mock para área não atendida
      const user = userEvent.setup();
      mockCheckoutContext.calculateDeliveryFee.mockResolvedValue(null);

      // ACT: Selecionar endereço fora da área
      renderDeliveryStep();
      
      const deliveryCard = screen.getByTestId('delivery-option');
      await user.click(deliveryCard);
      
      await waitFor(() => {
        const addressCard = screen.getByTestId('saved-address-1');
        return user.click(addressCard);
      });

      // ASSERT: Verificar mensagem de erro
      await waitFor(() => {
        expect(screen.getByText('Não entregamos nesta região')).toBeInTheDocument();
      });
    });

    test('deve mostrar loading durante cálculo de taxa', async () => {
      // ARRANGE: Configurar mock com delay
      const user = userEvent.setup();
      mockCheckoutContext.calculateDeliveryFee.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve(8.50), 500))
      );

      // ACT: Selecionar endereço
      renderDeliveryStep();
      
      const deliveryCard = screen.getByTestId('delivery-option');
      await user.click(deliveryCard);
      
      await waitFor(() => {
        const addressCard = screen.getByTestId('saved-address-1');
        return user.click(addressCard);
      });

      // ASSERT: Verificar loading
      expect(screen.getByText('Calculando taxa...')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Navegação
   */
  describe('Navegação de Etapas', () => {
    test('deve habilitar botão Continuar após selecionar retirada', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Selecionar retirada
      renderDeliveryStep();
      const pickupCard = screen.getByTestId('pickup-option');
      await user.click(pickupCard);

      // ASSERT: Verificar que botão está habilitado
      const continueButton = screen.getByText('Continuar');
      expect(continueButton).not.toBeDisabled();
    });

    test('deve habilitar botão Continuar após selecionar entrega e endereço', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();
      mockCheckoutContext.calculateDeliveryFee.mockResolvedValue(8.50);

      // ACT: Selecionar entrega e endereço
      renderDeliveryStep();
      
      const deliveryCard = screen.getByTestId('delivery-option');
      await user.click(deliveryCard);
      
      await waitFor(() => {
        const addressCard = screen.getByTestId('saved-address-1');
        return user.click(addressCard);
      });

      // ASSERT: Verificar que botão está habilitado
      await waitFor(() => {
        const continueButton = screen.getByText('Continuar');
        expect(continueButton).not.toBeDisabled();
      });
    });

    test('deve avançar para próxima etapa ao clicar em Continuar', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Selecionar retirada e continuar
      renderDeliveryStep();
      
      const pickupCard = screen.getByTestId('pickup-option');
      await user.click(pickupCard);
      
      const continueButton = screen.getByText('Continuar');
      await user.click(continueButton);

      // ASSERT: Verificar navegação
      expect(mockCheckoutContext.nextStep).toHaveBeenCalled();
    });

    test('deve voltar para etapa anterior', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Clicar em voltar
      renderDeliveryStep();
      const backButton = screen.getByText('Voltar');
      await user.click(backButton);

      // ASSERT: Verificar navegação
      expect(mockCheckoutContext.prevStep).toHaveBeenCalled();
    });
  });

  /**
   * GRUPO: Testes de Estados Especiais
   */
  describe('Estados Especiais', () => {
    test('deve mostrar mensagem quando usuário não tem endereços salvos', () => {
      // ARRANGE: Usuário sem endereços
      const userWithoutAddresses = createMockUser({ addresses: [] });

      // ACT: Renderizar com usuário sem endereços
      renderDeliveryStep({ user: userWithoutAddresses });
      
      // Selecionar entrega
      const deliveryCard = screen.getByTestId('delivery-option');
      fireEvent.click(deliveryCard);

      // ASSERT: Verificar mensagem
      expect(screen.getByText('Nenhum endereço salvo')).toBeInTheDocument();
    });

    test('deve tratar erro na busca de CEP', async () => {
      // ARRANGE: Configurar mock de CEP com erro
      const user = userEvent.setup();
      global.fetch = jest.fn().mockRejectedValue(new Error('Erro de rede'));

      // ACT: Tentar buscar CEP inválido
      renderDeliveryStep();
      
      const deliveryCard = screen.getByTestId('delivery-option');
      await user.click(deliveryCard);
      
      await waitFor(async () => {
        const addButton = screen.getByText('Adicionar Novo Endereço');
        await user.click(addButton);
      });
      
      await waitFor(async () => {
        const cepField = screen.getByLabelText(/CEP/i);
        await user.type(cepField, '00000000');
      });

      // ASSERT: Verificar tratamento do erro
      await waitFor(() => {
        expect(screen.getByText('CEP não encontrado')).toBeInTheDocument();
      });
    });

    test('deve manter estado ao trocar entre retirada e entrega', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Selecionar entrega, depois retirada, depois entrega novamente
      renderDeliveryStep();
      
      const deliveryCard = screen.getByTestId('delivery-option');
      await user.click(deliveryCard);
      
      const pickupCard = screen.getByTestId('pickup-option');
      await user.click(pickupCard);
      
      await user.click(deliveryCard);

      // ASSERT: Verificar que endereços salvos ainda são mostrados
      await waitFor(() => {
        expect(screen.getByText('Rua das Flores, 123')).toBeInTheDocument();
      });
    });
  });
});
