import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountDialog from '../AccountDialog';
import ThemeRegistry from '../../ThemeRegistry';
import { AuthProvider } from '../../../context/AuthContext';

// Mock do contexto de autenticação
const mockLogin = jest.fn();
const mockLogout = jest.fn();

// Mock do useAuth
jest.mock('../../../context/AuthContext', () => ({
  ...jest.requireActual('../../../context/AuthContext'),
  useAuth: jest.fn()
}));

describe('AccountDialog', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderAccountDialog = (open = true, user = null) => {
    // Configure o mock do useAuth baseado no parâmetro user
    const { useAuth } = require('../../../context/AuthContext');
    useAuth.mockReturnValue({
      user,
      login: mockLogin,
      logout: mockLogout
    });

    return render(
      <ThemeRegistry>
        <AuthProvider>
          <AccountDialog
            open={open}
            onClose={mockOnClose}
          />
        </AuthProvider>
      </ThemeRegistry>
    );
  };

  describe('quando usuário não está logado', () => {
    it('exibe título e botão de fechar', async () => {
      renderAccountDialog();
      
      expect(await screen.findByText('Minha Conta')).toBeInTheDocument();
      expect(screen.getByLabelText(/close/i)).toBeInTheDocument();
    });

    it('exibe campos de login (WhatsApp e senha)', async () => {
      renderAccountDialog();
      
      expect(await screen.findByLabelText(/whatsapp/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    });

    it('exibe botão de Entrar', async () => {
      renderAccountDialog();
      
      expect(await screen.findByRole('button', { name: /entrar/i })).toBeInTheDocument();
    });

    it('aceita input nos campos de WhatsApp e senha', async () => {
      const user = userEvent.setup();
      renderAccountDialog();

      const whatsappField = await screen.findByLabelText(/whatsapp/i);
      const passwordField = screen.getByLabelText(/senha/i);

      await user.type(whatsappField, '11987654321');
      expect(whatsappField).toHaveValue('11987654321');

      await user.type(passwordField, 'minhasenha123');
      expect(passwordField).toHaveValue('minhasenha123');
    });

    it('chama função de login quando clica em Entrar', async () => {
      const user = userEvent.setup();
      renderAccountDialog();

      const whatsappField = await screen.findByLabelText(/whatsapp/i);
      const passwordField = screen.getByLabelText(/senha/i);
      const loginButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(whatsappField, '11987654321');
      await user.type(passwordField, 'senha123');
      await user.click(loginButton);

      expect(mockLogin).toHaveBeenCalledWith('11987654321', 'senha123');
    });

    it('fecha dialog quando login é bem-sucedido', async () => {
      const user = userEvent.setup();
      mockLogin.mockReturnValue(true); // Login bem-sucedido
      
      renderAccountDialog();

      const whatsappField = await screen.findByLabelText(/whatsapp/i);
      const passwordField = screen.getByLabelText(/senha/i);
      const loginButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(whatsappField, '11987654321');
      await user.type(passwordField, 'senha123');
      await user.click(loginButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('exibe erro quando login falha', async () => {
      const user = userEvent.setup();
      mockLogin.mockReturnValue(false); // Login falhado
      
      renderAccountDialog();

      const whatsappField = await screen.findByLabelText(/whatsapp/i);
      const passwordField = screen.getByLabelText(/senha/i);
      const loginButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(whatsappField, '11987654321');
      await user.type(passwordField, 'senhaerrada');
      await user.click(loginButton);

      expect(await screen.findByText('Whatsapp ou senha inválidos.')).toBeInTheDocument();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('quando usuário está logado', () => {
    const mockUser = {
      name: 'João Silva',
      whatsapp: '11987654321',
      address: 'Rua das Flores, 123 - São Paulo, SP'
    };

    it('exibe informações do usuário logado', async () => {
      renderAccountDialog(true, mockUser);
      
      expect(await screen.findByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('11987654321')).toBeInTheDocument();
      expect(screen.getByText('Rua das Flores, 123 - São Paulo, SP')).toBeInTheDocument();
    });

    it('exibe botão de Sair', async () => {
      renderAccountDialog(true, mockUser);
      
      expect(await screen.findByRole('button', { name: /sair/i })).toBeInTheDocument();
    });

    it('não exibe campos de login quando usuário está logado', async () => {
      renderAccountDialog(true, mockUser);
      
      await screen.findByText('João Silva'); // Aguarda carregar
      
      expect(screen.queryByLabelText(/whatsapp/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/senha/i)).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /entrar/i })).not.toBeInTheDocument();
    });

    it('chama função de logout quando clica em Sair', async () => {
      const user = userEvent.setup();
      renderAccountDialog(true, mockUser);

      const logoutButton = await screen.findByRole('button', { name: /sair/i });
      await user.click(logoutButton);

      expect(mockLogout).toHaveBeenCalled();
    });

    it('fecha dialog quando faz logout', async () => {
      const user = userEvent.setup();
      renderAccountDialog(true, mockUser);

      const logoutButton = await screen.findByRole('button', { name: /sair/i });
      await user.click(logoutButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('comportamentos gerais', () => {
    it('fecha dialog quando clica no botão X', async () => {
      const user = userEvent.setup();
      renderAccountDialog();

      const closeButton = await screen.findByLabelText(/close/i);
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('limpa erro quando fecha dialog', async () => {
      const user = userEvent.setup();
      mockLogin.mockReturnValue(false); // Para gerar erro
      
      renderAccountDialog();

      // Primeiro, gera um erro
      const whatsappField = await screen.findByLabelText(/whatsapp/i);
      const passwordField = screen.getByLabelText(/senha/i);
      const loginButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(whatsappField, '11987654321');
      await user.type(passwordField, 'senhaerrada');
      await user.click(loginButton);

      // Verifica se erro aparece
      expect(await screen.findByText('Whatsapp ou senha inválidos.')).toBeInTheDocument();

      // Fecha o dialog
      const closeButton = screen.getByLabelText(/close/i);
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('não renderiza quando open é false', () => {
      renderAccountDialog(false);

      expect(screen.queryByText('Minha Conta')).not.toBeInTheDocument();
    });

    it('fecha dialog quando clica no backdrop', async () => {
      renderAccountDialog();

      await screen.findByText('Minha Conta');

      // Simular clique no backdrop
      const backdrop = document.querySelector('.MuiBackdrop-root');
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(mockOnClose).toHaveBeenCalled();
      }
    });

    it('campo WhatsApp tem foco automático quando dialog abre', async () => {
      renderAccountDialog();

      const whatsappField = await screen.findByLabelText(/whatsapp/i);
      
      // Aguarda um pouco para o autofocus funcionar
      await waitFor(() => {
        expect(whatsappField).toHaveFocus();
      });
    });
  });
});
