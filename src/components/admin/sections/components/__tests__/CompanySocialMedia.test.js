/**
 * TESTES DO COMPONENTE - COMPANYSOCIALMEDIA
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do componente CompanySocialMedia.
 * 
 * Cobertura:
 * - Renderização correta dos campos
 * - Validação de URLs das redes sociais
 * - Interações do usuário (input, validação)
 * - Preview de perfis configurados
 * - Status das redes sociais
 * 
 * @author Sistema Admin
 * @since 22/08/2025
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Importações de mocks e utilitários de teste
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Componente sendo testado
import CompanySocialMedia from '../CompanySocialMedia';

/**
 * HELPER: Renderiza componente com providers necessários
 */
const renderWithProviders = (component, options = {}) => {
  const theme = createTheme();
  
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>,
    options
  );
};

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('CompanySocialMedia', () => {
  // Props padrão para testes
  const defaultProps = {
    companyData: {
      socialMedia: {
        facebook: '',
        instagram: ''
      }
    },
    updateField: jest.fn()
  };

  // Limpar mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * GRUPO: Testes de Renderização
   */
  describe('Renderização', () => {
    test('deve renderizar o componente corretamente', () => {
      // ARRANGE: Preparar props padrão
      const props = { ...defaultProps };

      // ACT: Renderizar componente
      renderWithProviders(<CompanySocialMedia {...props} />);

      // ASSERT: Verificar se elementos principais estão presentes
      expect(screen.getByText('Redes Sociais')).toBeInTheDocument();
      expect(screen.getByText('Facebook')).toBeInTheDocument();
      expect(screen.getByText('Instagram')).toBeInTheDocument();
      expect(screen.getByLabelText('URL do Facebook')).toBeInTheDocument();
      expect(screen.getByLabelText('URL do Instagram')).toBeInTheDocument();
    });

    test('deve exibir placeholders corretos nos campos de entrada', () => {
      // ARRANGE: Props padrão
      const props = { ...defaultProps };

      // ACT: Renderizar componente
      renderWithProviders(<CompanySocialMedia {...props} />);

      // ASSERT: Verificar placeholders
      const facebookInput = screen.getByLabelText('URL do Facebook');
      const instagramInput = screen.getByLabelText('URL do Instagram');
      
      expect(facebookInput).toHaveAttribute('placeholder', 'https://facebook.com/sua-empresa');
      expect(instagramInput).toHaveAttribute('placeholder', 'https://instagram.com/sua_empresa');
    });

    test('deve mostrar status inicial como não configurado', () => {
      // ARRANGE: Props com redes sociais vazias
      const props = { ...defaultProps };

      // ACT: Renderizar componente
      renderWithProviders(<CompanySocialMedia {...props} />);

      // ASSERT: Verificar chips de status
      expect(screen.getByText('Facebook Não Configurado')).toBeInTheDocument();
      expect(screen.getByText('Instagram Não Configurado')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Interação
   */
  describe('Interações do Usuário', () => {
    test('deve chamar updateField quando URL do Facebook é alterada', async () => {
      // ARRANGE: Preparar props com função mock
      const mockUpdateField = jest.fn();
      const props = { ...defaultProps, updateField: mockUpdateField };

      // ACT: Renderizar e digitar no campo Facebook
      renderWithProviders(<CompanySocialMedia {...props} />);
      const facebookInput = screen.getByLabelText('URL do Facebook');
      fireEvent.change(facebookInput, { target: { value: 'https://facebook.com/teste' } });

      // ASSERT: Verificar se função foi chamada
      expect(mockUpdateField).toHaveBeenCalledWith('socialMedia.facebook', 'https://facebook.com/teste');
    });

    test('deve chamar updateField quando URL do Instagram é alterada', async () => {
      // ARRANGE: Preparar props com função mock
      const mockUpdateField = jest.fn();
      const props = { ...defaultProps, updateField: mockUpdateField };

      // ACT: Renderizar e digitar no campo Instagram
      renderWithProviders(<CompanySocialMedia {...props} />);
      const instagramInput = screen.getByLabelText('URL do Instagram');
      fireEvent.change(instagramInput, { target: { value: 'https://instagram.com/teste' } });

      // ASSERT: Verificar se função foi chamada
      expect(mockUpdateField).toHaveBeenCalledWith('socialMedia.instagram', 'https://instagram.com/teste');
    });
  });

  /**
   * GRUPO: Testes de Validação
   */
  describe('Validação de URLs', () => {
    test('deve aceitar URL válida do Facebook', async () => {
      // ARRANGE: Props com função mock
      const mockUpdateField = jest.fn();
      const props = { ...defaultProps, updateField: mockUpdateField };
      const urlValida = 'https://facebook.com/minha-empresa';

      // ACT: Renderizar e inserir URL válida
      renderWithProviders(<CompanySocialMedia {...props} />);
      const facebookInput = screen.getByLabelText('URL do Facebook');
      fireEvent.change(facebookInput, { target: { value: urlValida } });

      // ASSERT: Não deve mostrar erro de validação
      await waitFor(() => {
        expect(screen.queryByText('URL inválida para esta rede social')).not.toBeInTheDocument();
      });
    });

    test('deve aceitar URL válida do Instagram', async () => {
      // ARRANGE: Props com função mock
      const mockUpdateField = jest.fn();
      const props = { ...defaultProps, updateField: mockUpdateField };
      const urlValida = 'https://instagram.com/minha_empresa';

      // ACT: Renderizar e inserir URL válida
      renderWithProviders(<CompanySocialMedia {...props} />);
      const instagramInput = screen.getByLabelText('URL do Instagram');
      fireEvent.change(instagramInput, { target: { value: urlValida } });

      // ASSERT: Não deve mostrar erro de validação
      await waitFor(() => {
        expect(screen.queryByText('URL inválida para esta rede social')).not.toBeInTheDocument();
      });
    });

    test('deve mostrar erro para URL inválida do Facebook', async () => {
      // ARRANGE: Props com função mock
      const mockUpdateField = jest.fn();
      const props = { ...defaultProps, updateField: mockUpdateField };
      const urlInvalida = 'https://google.com/teste';

      // ACT: Renderizar e inserir URL inválida
      renderWithProviders(<CompanySocialMedia {...props} />);
      const facebookInput = screen.getByLabelText('URL do Facebook');
      fireEvent.change(facebookInput, { target: { value: urlInvalida } });

      // ASSERT: Deve mostrar erro de validação
      await waitFor(() => {
        expect(screen.getByText('URL inválida para esta rede social')).toBeInTheDocument();
      });
    });

    test('deve aceitar campo vazio como válido', () => {
      // ARRANGE: Props com função mock
      const mockUpdateField = jest.fn();
      const props = { ...defaultProps, updateField: mockUpdateField };

      // ACT: Renderizar componente (campos iniciam vazios)
      renderWithProviders(<CompanySocialMedia {...props} />);

      // ASSERT: Não deve mostrar erro para campos vazios
      expect(screen.queryByText('URL inválida para esta rede social')).not.toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Preview
   */
  describe('Preview de Perfis', () => {
    test('deve mostrar preview do Facebook quando URL é válida', () => {
      // ARRANGE: Props com URL válida do Facebook
      const propsComFacebook = {
        ...defaultProps,
        companyData: {
          socialMedia: {
            facebook: 'https://facebook.com/minha-empresa',
            instagram: ''
          }
        }
      };

      // ACT: Renderizar componente
      renderWithProviders(<CompanySocialMedia {...propsComFacebook} />);

      // ASSERT: Verificar preview do Facebook
      expect(screen.getByText('Preview:')).toBeInTheDocument();
      expect(screen.getByText('facebook.com/minha-empresa')).toBeInTheDocument();
    });

    test('deve mostrar preview do Instagram quando URL é válida', () => {
      // ARRANGE: Props com URL válida do Instagram
      const propsComInstagram = {
        ...defaultProps,
        companyData: {
          socialMedia: {
            facebook: '',
            instagram: 'https://instagram.com/minha_empresa'
          }
        }
      };

      // ACT: Renderizar componente
      renderWithProviders(<CompanySocialMedia {...propsComInstagram} />);

      // ASSERT: Verificar preview do Instagram
      expect(screen.getByText('Preview:')).toBeInTheDocument();
      expect(screen.getByText('@minha_empresa')).toBeInTheDocument();
    });

    test('não deve mostrar preview para URLs inválidas', () => {
      // ARRANGE: Props com URL inválida
      const propsComURLInvalida = {
        ...defaultProps,
        companyData: {
          socialMedia: {
            facebook: 'url-invalida',
            instagram: ''
          }
        }
      };

      // ACT: Renderizar componente
      renderWithProviders(<CompanySocialMedia {...propsComURLInvalida} />);

      // ASSERT: Preview não deve aparecer
      expect(screen.queryByText('Preview:')).not.toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Status
   */
  describe('Status das Redes Sociais', () => {
    test('deve mostrar status configurado quando URLs são válidas', () => {
      // ARRANGE: Props com URLs válidas
      const propsConfiguradas = {
        ...defaultProps,
        companyData: {
          socialMedia: {
            facebook: 'https://facebook.com/empresa',
            instagram: 'https://instagram.com/empresa'
          }
        }
      };

      // ACT: Renderizar componente
      renderWithProviders(<CompanySocialMedia {...propsConfiguradas} />);

      // ASSERT: Verificar status configurado
      expect(screen.getByText('Facebook Configurado')).toBeInTheDocument();
      expect(screen.getByText('Instagram Configurado')).toBeInTheDocument();
    });

    test('deve mostrar status não configurado quando URLs estão vazias', () => {
      // ARRANGE: Props com URLs vazias
      const props = { ...defaultProps };

      // ACT: Renderizar componente
      renderWithProviders(<CompanySocialMedia {...props} />);

      // ASSERT: Verificar status não configurado
      expect(screen.getByText('Facebook Não Configurado')).toBeInTheDocument();
      expect(screen.getByText('Instagram Não Configurado')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Casos Extremos
   */
  describe('Casos Extremos', () => {
    test('deve tratar dados ausentes graciosamente', () => {
      // ARRANGE: Props sem dados de redes sociais
      const propsVazias = {
        companyData: {},
        updateField: jest.fn()
      };

      // ACT: Renderizar componente
      renderWithProviders(<CompanySocialMedia {...propsVazias} />);

      // ASSERT: Componente deve renderizar sem erros
      expect(screen.getByText('Redes Sociais')).toBeInTheDocument();
      expect(screen.getByLabelText('URL do Facebook')).toBeInTheDocument();
      expect(screen.getByLabelText('URL do Instagram')).toBeInTheDocument();
    });

    test('deve tratar diferentes formatos de URL corretamente', () => {
      // ARRANGE: Testes com diferentes formatos
      const formatos = [
        'https://facebook.com/empresa',
        'http://facebook.com/empresa',
        'https://www.facebook.com/empresa',
        'facebook.com/empresa' // Deve ser inválido
      ];

      const mockUpdateField = jest.fn();
      const props = { ...defaultProps, updateField: mockUpdateField };

      // ACT & ASSERT: Testar cada formato
      renderWithProviders(<CompanySocialMedia {...props} />);
      const facebookInput = screen.getByLabelText('URL do Facebook');

      formatos.forEach((formato, index) => {
        fireEvent.change(facebookInput, { target: { value: formato } });
        
        if (formato.startsWith('http')) {
          // URLs com protocolo devem ser válidas
          expect(screen.queryByText('URL inválida para esta rede social')).not.toBeInTheDocument();
        } else {
          // URLs sem protocolo devem ser inválidas
          expect(screen.getByText('URL inválida para esta rede social')).toBeInTheDocument();
        }
      });
    });
  });
});
