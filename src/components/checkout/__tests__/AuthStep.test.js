/**
 * TESTES DO COMPONENTE - AUTH STEP
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do componente AuthStep (PASSO 1: Verificação de Autenticação do Cliente).
 * 
 * Cobertura:
 * - Renderização correta
 * - Formulário de login
 * - Formulário de cadastro
 * - Validações de entrada
 * - Interações do usuário
 * - Casos extremos e tratamento de erros
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Componente sendo testado
import AuthStep from '../steps/AuthStep';

// Utilitários de teste customizados
import {
  renderWithCheckoutProviders,
  createMockAuthContext,
  createMockCheckoutContext,
  fillLoginForm,
  fillRegisterForm,
  waitForDelay
} from './test-utils';

// Mocks de dependências
jest.mock('../../../context/AuthContext');
jest.mock('../../../context/CheckoutContext');

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('AuthStep - Etapa de Autenticação', () => {
  // Mocks padrão para testes
  let mockAuthContext;
  let mockCheckoutContext;

  // Configuração antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockAuthContext = createMockAuthContext();
    mockCheckoutContext = createMockCheckoutContext();
    
    // Mock dos hooks de contexto
    require('../../../context/AuthContext').useAuth.mockReturnValue(mockAuthContext);
    require('../../../context/CheckoutContext').useCheckout.mockReturnValue(mockCheckoutContext);
  });

  /**
   * HELPER: Renderiza componente AuthStep com contextos mockados
   */
  const renderAuthStep = (authOverrides = {}, checkoutOverrides = {}) => {
    const authContext = { ...mockAuthContext, ...authOverrides };
    const checkoutContext = { ...mockCheckoutContext, ...checkoutOverrides };
    
    require('../../../context/AuthContext').useAuth.mockReturnValue(authContext);
    require('../../../context/CheckoutContext').useCheckout.mockReturnValue(checkoutContext);
    
    return renderWithCheckoutProviders(<AuthStep />);
  };

  /**
   * GRUPO: Testes de Renderização
   */
  describe('Renderização', () => {
    test('deve renderizar o componente corretamente', () => {
      // ACT: Renderizar componente
      renderAuthStep();

      // ASSERT: Verificar elementos principais
      expect(screen.getByText('Entre ou cadastre-se')).toBeInTheDocument();
      expect(screen.getByText('Para finalizar seu pedido, precisamos de suas informações')).toBeInTheDocument();
      expect(screen.getByText('Já tenho conta')).toBeInTheDocument();
      expect(screen.getByText('Criar conta')).toBeInTheDocument();
    });

    test('deve iniciar na aba de login por padrão', () => {
      // ACT: Renderizar componente
      renderAuthStep();

      // ASSERT: Verificar que formulário de login está visível
      expect(screen.getByLabelText(/WhatsApp/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    });

    test('deve renderizar formulário de cadastro ao clicar na aba', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();
      
      // ACT: Renderizar e clicar na aba de cadastro
      renderAuthStep();
      await user.click(screen.getByText('Criar conta'));

      // ASSERT: Verificar elementos do formulário de cadastro
      await waitFor(() => {
        expect(screen.getByLabelText(/Nome Completo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /criar conta/i })).toBeInTheDocument();
      });
    });
  });

  /**
   * GRUPO: Testes de Login
   */
  describe('Funcionalidade de Login', () => {
    test('deve realizar login com credenciais válidas', async () => {
      // ARRANGE: Configurar mock de login bem-sucedido
      const user = userEvent.setup();
      mockAuthContext.login.mockResolvedValue({
        success: true,
        user: { name: 'João Silva' }
      });

      // ACT: Renderizar, preencher e submeter formulário
      renderAuthStep();
      await fillLoginForm(user, {
        whatsapp: '11999998888',
        password: '1234'
      });
      
      const loginButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(loginButton);

      // ASSERT: Verificar se login foi chamado corretamente
      await waitFor(() => {
        expect(mockAuthContext.login).toHaveBeenCalledWith({
          whatsapp: '11999998888',
          password: '1234'
        });
      });

      // ASSERT: Verificar mensagem de sucesso
      await waitFor(() => {
        expect(screen.getByText('Login realizado com sucesso!')).toBeInTheDocument();
      });

      // ASSERT: Verificar se avançou para próxima etapa após delay
      await waitFor(() => {
        expect(mockCheckoutContext.nextStep).toHaveBeenCalled();
      }, { timeout: 2000 });
    });

    test('deve exibir erro para credenciais inválidas', async () => {
      // ARRANGE: Configurar mock de login com falha
      const user = userEvent.setup();
      mockAuthContext.login.mockResolvedValue({
        success: false,
        message: 'WhatsApp ou senha incorretos'
      });

      // ACT: Renderizar, preencher e submeter formulário
      renderAuthStep();
      await fillLoginForm(user, {
        whatsapp: '11999999999',
        password: 'senhaerrada'
      });
      
      const loginButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(loginButton);

      // ASSERT: Verificar mensagem de erro
      await waitFor(() => {
        expect(screen.getByText('WhatsApp ou senha incorretos')).toBeInTheDocument();
      });

      // ASSERT: Verificar que não avançou de etapa
      expect(mockCheckoutContext.nextStep).not.toHaveBeenCalled();
    });

    test('deve validar campos obrigatórios no login', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Renderizar e tentar submeter sem preencher
      renderAuthStep();
      const loginButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(loginButton);

      // ASSERT: Verificar mensagem de validação
      await waitFor(() => {
        expect(screen.getByText('WhatsApp é obrigatório')).toBeInTheDocument();
      });

      // ASSERT: Verificar que login não foi chamado
      expect(mockAuthContext.login).not.toHaveBeenCalled();
    });

    test('deve validar formato do WhatsApp', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Renderizar e preencher com WhatsApp inválido
      renderAuthStep();
      await fillLoginForm(user, {
        whatsapp: '123',
        password: '1234'
      });
      
      const loginButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(loginButton);

      // ASSERT: Verificar mensagem de validação
      await waitFor(() => {
        expect(screen.getByText('WhatsApp deve ter 11 dígitos (DDD + número)')).toBeInTheDocument();
      });
    });

    test('deve formatar WhatsApp automaticamente durante digitação', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Renderizar e digitar WhatsApp
      renderAuthStep();
      const whatsappField = screen.getByLabelText(/WhatsApp/i);
      await user.type(whatsappField, '11999998888');

      // ASSERT: Verificar formatação automática
      expect(whatsappField.value).toBe('(11) 99999-8888');
    });
  });

  /**
   * GRUPO: Testes de Cadastro
   */
  describe('Funcionalidade de Cadastro', () => {
    test('deve realizar cadastro com dados válidos', async () => {
      // ARRANGE: Configurar mock de cadastro bem-sucedido
      const user = userEvent.setup();
      mockAuthContext.register.mockResolvedValue({
        success: true,
        user: { name: 'João Silva' }
      });

      // ACT: Ir para aba de cadastro e preencher formulário
      renderAuthStep();
      await user.click(screen.getByText('Criar conta'));
      
      await fillRegisterForm(user, {
        name: 'João Silva',
        whatsapp: '11888887777',
        email: 'joao@email.com',
        password: 'senha123'
      });
      
      const registerButton = screen.getByRole('button', { name: /criar conta/i });
      await user.click(registerButton);

      // ASSERT: Verificar se register foi chamado corretamente
      await waitFor(() => {
        expect(mockAuthContext.register).toHaveBeenCalledWith({
          name: 'João Silva',
          whatsapp: '11888887777',
          email: 'joao@email.com',
          password: 'senha123'
        });
      });

      // ASSERT: Verificar mensagem de sucesso
      await waitFor(() => {
        expect(screen.getByText('Cadastro realizado com sucesso!')).toBeInTheDocument();
      });
    });

    test('deve validar todos os campos obrigatórios no cadastro', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Ir para aba de cadastro e tentar submeter sem preencher
      renderAuthStep();
      await user.click(screen.getByText('Criar conta'));
      
      const registerButton = screen.getByRole('button', { name: /criar conta/i });
      await user.click(registerButton);

      // ASSERT: Verificar mensagem de validação para nome
      await waitFor(() => {
        expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
      });
    });

    test('deve validar conformidade de senhas', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Ir para aba de cadastro e preencher senhas diferentes
      renderAuthStep();
      await user.click(screen.getByText('Criar conta'));
      
      const nameField = screen.getByLabelText(/Nome Completo/i);
      const whatsappField = screen.getByLabelText(/WhatsApp/i);
      const emailField = screen.getByLabelText(/E-mail/i);
      const passwordField = screen.getByLabelText(/Senha/i);
      const confirmPasswordField = screen.getByLabelText(/Confirmar Senha/i);
      
      await user.type(nameField, 'João Silva');
      await user.type(whatsappField, '11888887777');
      await user.type(emailField, 'joao@email.com');
      await user.type(passwordField, 'senha123');
      await user.type(confirmPasswordField, 'senha456');
      
      // Aceitar termos
      const termsCheckbox = screen.getByRole('checkbox');
      await user.click(termsCheckbox);
      
      const registerButton = screen.getByRole('button', { name: /criar conta/i });
      await user.click(registerButton);

      // ASSERT: Verificar mensagem de erro
      await waitFor(() => {
        expect(screen.getByText('Senhas não conferem')).toBeInTheDocument();
      });
    });

    test('deve validar aceitação dos termos', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Ir para aba de cadastro e preencher sem aceitar termos
      renderAuthStep();
      await user.click(screen.getByText('Criar conta'));
      
      await fillRegisterForm(user, {
        name: 'João Silva',
        whatsapp: '11888887777',
        email: 'joao@email.com',
        password: 'senha123',
        acceptTerms: false
      });
      
      const registerButton = screen.getByRole('button', { name: /criar conta/i });
      await user.click(registerButton);

      // ASSERT: Verificar mensagem de validação
      await waitFor(() => {
        expect(screen.getByText('Você deve aceitar os termos de uso')).toBeInTheDocument();
      });
    });

    test('deve validar formato do email', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Ir para aba de cadastro e preencher com email inválido
      renderAuthStep();
      await user.click(screen.getByText('Criar conta'));
      
      await fillRegisterForm(user, {
        name: 'João Silva',
        whatsapp: '11888887777',
        email: 'email-invalido',
        password: 'senha123'
      });
      
      const registerButton = screen.getByRole('button', { name: /criar conta/i });
      await user.click(registerButton);

      // ASSERT: Verificar mensagem de erro
      await waitFor(() => {
        expect(screen.getByText('E-mail inválido')).toBeInTheDocument();
      });
    });

    test('deve exibir erro quando usuário já existe', async () => {
      // ARRANGE: Configurar mock de cadastro com usuário existente
      const user = userEvent.setup();
      mockAuthContext.register.mockResolvedValue({
        success: false,
        message: 'Usuário já cadastrado com este WhatsApp'
      });

      // ACT: Preencher formulário de cadastro
      renderAuthStep();
      await user.click(screen.getByText('Criar conta'));
      
      await fillRegisterForm(user, {
        name: 'João Silva',
        whatsapp: '11999998888', // WhatsApp já existente
        email: 'joao@email.com',
        password: 'senha123'
      });
      
      const registerButton = screen.getByRole('button', { name: /criar conta/i });
      await user.click(registerButton);

      // ASSERT: Verificar mensagem de erro
      await waitFor(() => {
        expect(screen.getByText('Usuário já cadastrado com este WhatsApp')).toBeInTheDocument();
      });
    });
  });

  /**
   * GRUPO: Testes de Estados de Loading e Erro
   */
  describe('Estados de Loading e Erro', () => {
    test('deve mostrar estado de loading durante login', async () => {
      // ARRANGE: Configurar mock com delay
      const user = userEvent.setup();
      mockAuthContext.login.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({ success: true }), 500)
        )
      );

      // ACT: Preencher e submeter formulário
      renderAuthStep();
      await fillLoginForm(user, {
        whatsapp: '11999998888',
        password: '1234'
      });
      
      const loginButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(loginButton);

      // ASSERT: Verificar estado de loading
      expect(screen.getByText('Entrando...')).toBeInTheDocument();
      expect(loginButton).toBeDisabled();
    });

    test('deve mostrar estado de loading durante cadastro', async () => {
      // ARRANGE: Configurar mock com delay
      const user = userEvent.setup();
      mockAuthContext.register.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({ success: true }), 500)
        )
      );

      // ACT: Ir para cadastro e submeter
      renderAuthStep();
      await user.click(screen.getByText('Criar conta'));
      
      await fillRegisterForm(user, {
        name: 'João Silva',
        whatsapp: '11888887777',
        email: 'joao@email.com',
        password: 'senha123'
      });
      
      const registerButton = screen.getByRole('button', { name: /criar conta/i });
      await user.click(registerButton);

      // ASSERT: Verificar estado de loading
      expect(screen.getByText('Criando conta...')).toBeInTheDocument();
      expect(registerButton).toBeDisabled();
    });

    test('deve tratar erros de rede durante login', async () => {
      // ARRANGE: Configurar mock que rejeita
      const user = userEvent.setup();
      mockAuthContext.login.mockRejectedValue(new Error('Erro de rede'));

      // ACT: Tentar fazer login
      renderAuthStep();
      await fillLoginForm(user, {
        whatsapp: '11999998888',
        password: '1234'
      });
      
      const loginButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(loginButton);

      // ASSERT: Verificar tratamento do erro
      await waitFor(() => {
        expect(screen.getByText('Erro interno. Tente novamente.')).toBeInTheDocument();
      });
    });
  });

  /**
   * GRUPO: Testes de Acessibilidade e UX
   */
  describe('Acessibilidade e UX', () => {
    test('deve permitir navegação por teclado entre abas', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Renderizar e navegar por teclado
      renderAuthStep();
      const loginTab = screen.getByText('Já tenho conta');
      const registerTab = screen.getByText('Criar conta');
      
      loginTab.focus();
      await user.keyboard('{ArrowRight}');

      // ASSERT: Verificar se pode navegar por teclado
      expect(registerTab).toHaveFocus();
    });

    test('deve ter labels apropriados nos campos', () => {
      // ACT: Renderizar componente
      renderAuthStep();

      // ASSERT: Verificar se campos têm labels
      expect(screen.getByLabelText(/WhatsApp/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    });

    test('deve mostrar placeholders apropriados', () => {
      // ACT: Renderizar componente
      renderAuthStep();

      // ASSERT: Verificar placeholders
      const whatsappField = screen.getByLabelText(/WhatsApp/i);
      expect(whatsappField).toHaveAttribute('placeholder', '(11) 99999-9999');
    });
  });

  /**
   * GRUPO: Testes de Integração com Contextos
   */
  describe('Integração com Contextos', () => {
    test('deve limpar erro ao digitar após erro de validação', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Causar erro de validação e depois digitar
      renderAuthStep();
      const loginButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(loginButton);
      
      // Verificar erro apareceu
      await waitFor(() => {
        expect(screen.getByText('WhatsApp é obrigatório')).toBeInTheDocument();
      });
      
      // Digitar no campo
      const whatsappField = screen.getByLabelText(/WhatsApp/i);
      await user.type(whatsappField, '1');

      // ASSERT: Verificar que erro foi limpo
      await waitFor(() => {
        expect(screen.queryByText('WhatsApp é obrigatório')).not.toBeInTheDocument();
      });
    });

    test('deve chamar nextStep após login bem-sucedido', async () => {
      // ARRANGE: Configurar mock de sucesso
      const user = userEvent.setup();
      mockAuthContext.login.mockResolvedValue({ success: true });

      // ACT: Fazer login
      renderAuthStep();
      await fillLoginForm(user, {
        whatsapp: '11999998888',
        password: '1234'
      });
      
      const loginButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(loginButton);

      // ASSERT: Verificar que nextStep foi chamado após delay
      await waitFor(() => {
        expect(mockCheckoutContext.nextStep).toHaveBeenCalled();
      }, { timeout: 2000 });
    });
  });
});
