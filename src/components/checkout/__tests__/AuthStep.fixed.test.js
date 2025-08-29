/**
 * TESTES DO COMPONENTE - AUTH STEP (VERSÃO CORRIGIDA)
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do componente AuthStep sem mocks que interferem na renderização.
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
  createMockUser,
  fillLoginForm,
  fillRegisterForm,
  waitForDelay
} from './test-utils';

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('AuthStep - Etapa de Autenticação (Sem Mocks)', () => {
  
  /**
   * HELPER: Renderiza componente AuthStep com providers reais
   */
  const renderAuthStep = (options = {}) => {
    return renderWithCheckoutProviders(<AuthStep />, options);
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
   * GRUPO: Testes de Interação
   */
  describe('Interação com Formulários', () => {
    test('deve permitir alternar entre abas de login e cadastro', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();
      
      // ACT: Renderizar componente
      renderAuthStep();
      
      // Verificar que começou na aba de login
      expect(screen.getByLabelText(/WhatsApp/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
      
      // Clicar na aba de cadastro
      await user.click(screen.getByText('Criar conta'));
      
      // ASSERT: Verificar que mudou para cadastro
      await waitFor(() => {
        expect(screen.getByLabelText(/Nome Completo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
      });
      
      // Clicar de volta na aba de login
      await user.click(screen.getByText('Já tenho conta'));
      
      // ASSERT: Verificar que voltou para login
      await waitFor(() => {
        expect(screen.getByLabelText(/WhatsApp/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
      });
    });

    test('deve permitir preencher campos do formulário de login', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();
      
      // ACT: Renderizar e preencher formulário
      renderAuthStep();
      
      const whatsappField = screen.getByLabelText(/WhatsApp/i);
      const passwordField = screen.getByLabelText(/Senha/i);
      
      await user.clear(whatsappField);
      await user.type(whatsappField, '11999998888');
      
      await user.clear(passwordField);
      await user.type(passwordField, '1234');

      // ASSERT: Verificar que campos foram preenchidos
      expect(whatsappField).toHaveValue('(11) 99999-8888');
      expect(passwordField).toHaveValue('1234');
    });

    test('deve formatar WhatsApp automaticamente durante digitação', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();
      
      // ACT: Renderizar e digitar WhatsApp
      renderAuthStep();
      const whatsappField = screen.getByLabelText(/WhatsApp/i);
      await user.type(whatsappField, '11999998888');

      // ASSERT: Verificar formatação automática
      expect(whatsappField).toHaveValue('(11) 99999-8888');
    });

    test('deve permitir preencher formulário de cadastro', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();
      
      // ACT: Ir para aba de cadastro e preencher
      renderAuthStep();
      await user.click(screen.getByText('Criar conta'));
      
      await waitFor(() => {
        expect(screen.getByLabelText(/Nome Completo/i)).toBeInTheDocument();
      });
      
      // Preencher campos do cadastro
      const nameField = screen.getByLabelText(/Nome Completo/i);
      const whatsappField = screen.getByLabelText(/WhatsApp/i);
      const emailField = screen.getByLabelText(/E-mail/i);
      const passwordField = screen.getByLabelText('Senha *');
      const confirmPasswordField = screen.getByLabelText(/Confirmar Senha/i);
      
      await user.type(nameField, 'João Silva');
      await user.type(whatsappField, '11999998888');
      await user.type(emailField, 'joao@email.com');
      await user.type(passwordField, '123456');
      await user.type(confirmPasswordField, '123456');

      // ASSERT: Verificar que campos foram preenchidos
      expect(nameField).toHaveValue('João Silva');
      expect(whatsappField).toHaveValue('(11) 99999-8888');
      expect(emailField).toHaveValue('joao@email.com');
      expect(passwordField).toHaveValue('123456');
      expect(confirmPasswordField).toHaveValue('123456');
    });
  });

  /**
   * GRUPO: Testes de Acessibilidade
   */
  describe('Acessibilidade e UX', () => {
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

    test('deve mostrar textos de ajuda nos campos', () => {
      // ACT: Renderizar componente
      renderAuthStep();

      // ASSERT: Verificar textos de ajuda
      expect(screen.getByText('Digite seu número de WhatsApp com DDD')).toBeInTheDocument();
    });

    test('deve ter informação de segurança dos dados', () => {
      // ACT: Renderizar componente
      renderAuthStep();

      // ASSERT: Verificar informação de segurança
      expect(screen.getByText(/Seus dados são seguros e serão usados apenas para processar seu pedido/i)).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Estado
   */
  describe('Estados e Comportamento', () => {
    test('deve mostrar checkbox de aceitar termos no cadastro', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();
      
      // ACT: Ir para aba de cadastro
      renderAuthStep();
      await user.click(screen.getByText('Criar conta'));

      // ASSERT: Verificar checkbox de termos
      await waitFor(() => {
        const termsCheckbox = screen.getByRole('checkbox');
        expect(termsCheckbox).toBeInTheDocument();
        expect(termsCheckbox).not.toBeChecked();
      });
    });

    test('deve permitir marcar/desmarcar checkbox de termos', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();
      
      // ACT: Ir para cadastro e interagir com checkbox
      renderAuthStep();
      await user.click(screen.getByText('Criar conta'));
      
      await waitFor(() => {
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
      });
      
      const termsCheckbox = screen.getByRole('checkbox');
      
      // Marcar checkbox
      await user.click(termsCheckbox);
      expect(termsCheckbox).toBeChecked();
      
      // Desmarcar checkbox
      await user.click(termsCheckbox);
      expect(termsCheckbox).not.toBeChecked();
    });

    test('deve mostrar links de termos e política de privacidade', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();
      
      // ACT: Ir para aba de cadastro
      renderAuthStep();
      await user.click(screen.getByText('Criar conta'));

      // ASSERT: Verificar links
      await waitFor(() => {
        expect(screen.getByText('termos de uso')).toBeInTheDocument();
        expect(screen.getByText('política de privacidade')).toBeInTheDocument();
      });
    });
  });
});
