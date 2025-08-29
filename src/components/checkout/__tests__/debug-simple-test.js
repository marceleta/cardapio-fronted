/**
 * TESTE SIMPLES PARA DEBUG - SEM MOCKS
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Componente e contextos reais
import AuthStep from '../steps/AuthStep';
import { renderWithCheckoutProviders } from './test-utils';

describe('AuthStep Debug - Sem Mocks', () => {
  test('deve renderizar componente básico', () => {
    // ACT: Renderizar com providers reais
    renderWithCheckoutProviders(<AuthStep />);
    
    // DEBUG: Mostrar o que está sendo renderizado
    console.log('HTML renderizado:', document.body.innerHTML);
    
    // ASSERT: Verificar se tem conteúdo
    expect(document.body).not.toBeEmptyDOMElement();
  });
});
