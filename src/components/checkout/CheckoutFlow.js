/**
 * COMPONENTE PRINCIPAL DE CHECKOUT
 * 
 * Componente responsável por orquestrar todo o fluxo de checkout,
 * renderizando as etapas corretas baseado no estado atual.
 * 
 * Funcionalidades:
 * - Navegação entre etapas do checkout
 * - Integração com contexto de checkout
 * - Renderização condicional de componentes
 * - Controle de estado de carregamento
 * - Tratamento de erros
 */

import React from 'react';
import {
  Box,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Typography,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ShoppingCart as CartIcon,
  LocalShipping as DeliveryIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckIcon,
  Person as PersonIcon
} from '@mui/icons-material';

// Importação dos componentes de cada etapa
import AuthStep from './steps/AuthStep';
import DeliveryStep from './steps/DeliveryStep';
import PaymentStep from './steps/PaymentStep';
import SummaryStep from './steps/SummaryStep';
import SuccessStep from './steps/SuccessStep';

// Hook do contexto
import { useCheckout } from '../../context/CheckoutContext';

/**
 * CONFIGURAÇÃO DAS ETAPAS
 */
const stepConfig = {
  auth: {
    label: 'Login',
    icon: <PersonIcon />,
    component: AuthStep
  },
  delivery: {
    label: 'Entrega',
    icon: <DeliveryIcon />,
    component: DeliveryStep
  },
  payment: {
    label: 'Pagamento',
    icon: <PaymentIcon />,
    component: PaymentStep
  },
  summary: {
    label: 'Confirmação',
    icon: <CheckIcon />,
    component: SummaryStep
  },
  success: {
    label: 'Concluído',
    icon: <CheckIcon />,
    component: SuccessStep
  }
};

/**
 * COMPONENTE PRINCIPAL DO CHECKOUT
 */
const CheckoutFlow = () => {
  const {
    currentStep,
    loading,
    error,
    previousStep,
    clearError,
    CHECKOUT_STEPS
  } = useCheckout();

  /**
   * OBTÉM CONFIGURAÇÃO DA ETAPA ATUAL
   */
  const getCurrentStepConfig = () => {
    return stepConfig[currentStep] || stepConfig.auth;
  };

  /**
   * OBTÉM ÍNDICE DA ETAPA ATUAL PARA O STEPPER
   */
  const getActiveStepIndex = () => {
    const stepOrder = [
      CHECKOUT_STEPS.AUTH,
      CHECKOUT_STEPS.DELIVERY,
      CHECKOUT_STEPS.PAYMENT,
      CHECKOUT_STEPS.SUMMARY,
      CHECKOUT_STEPS.SUCCESS
    ];
    
    return stepOrder.indexOf(currentStep);
  };

  /**
   * RENDERIZA BOTÃO DE VOLTAR
   */
  const renderBackButton = () => {
    // Não mostrar botão de voltar na primeira etapa ou na página de sucesso
    if (currentStep === CHECKOUT_STEPS.AUTH || currentStep === CHECKOUT_STEPS.SUCCESS) {
      return null;
    }

    return (
      <IconButton
        onClick={previousStep}
        disabled={loading}
        sx={{
          position: 'absolute',
          left: 16,
          top: 16,
          zIndex: 1
        }}
        aria-label="Voltar etapa anterior"
      >
        <ArrowBackIcon />
      </IconButton>
    );
  };

  /**
   * RENDERIZA STEPPER DE PROGRESSO
   */
  const renderStepper = () => {
    // Não mostrar stepper na página de sucesso
    if (currentStep === CHECKOUT_STEPS.SUCCESS) {
      return null;
    }

    return (
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={getActiveStepIndex()} alternativeLabel>
          {Object.entries(stepConfig).map(([key, config]) => {
            // Não incluir a etapa de sucesso no stepper
            if (key === CHECKOUT_STEPS.SUCCESS) return null;
            
            return (
              <Step key={key}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: key === currentStep 
                          ? 'primary.main' 
                          : getActiveStepIndex() > Object.keys(stepConfig).indexOf(key)
                          ? 'success.main'
                          : 'grey.300',
                        color: 'white'
                      }}
                    >
                      {config.icon}
                    </Box>
                  )}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: key === currentStep ? 'bold' : 'normal',
                      color: key === currentStep ? 'primary.main' : 'text.secondary'
                    }}
                  >
                    {config.label}
                  </Typography>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
    );
  };

  /**
   * RENDERIZA INDICADOR DE CARREGAMENTO
   */
  const renderLoadingOverlay = () => {
    if (!loading) return null;

    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="h6" color="primary">
            Processando pedido...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Aguarde enquanto preparamos seu pedido
          </Typography>
        </Box>
      </Box>
    );
  };

  /**
   * RENDERIZA COMPONENTE DA ETAPA ATUAL
   */
  const renderCurrentStep = () => {
    const { component: StepComponent } = getCurrentStepConfig();
    return <StepComponent />;
  };

  return (
    <>
      {/* CONTAINER PRINCIPAL */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper
          elevation={3}
          sx={{
            position: 'relative',
            p: { xs: 2, md: 4 },
            minHeight: 600
          }}
        >
          {/* BOTÃO DE VOLTAR */}
          {renderBackButton()}

          {/* TÍTULO PRINCIPAL */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Finalizar Pedido
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Complete as informações para enviar seu pedido
            </Typography>
          </Box>

          {/* STEPPER DE PROGRESSO */}
          {renderStepper()}

          {/* ALERT DE ERRO */}
          {error && (
            <Alert
              severity="error"
              onClose={clearError}
              sx={{ mb: 3 }}
            >
              {error}
            </Alert>
          )}

          {/* COMPONENTE DA ETAPA ATUAL */}
          <Box sx={{ position: 'relative' }}>
            {renderCurrentStep()}
          </Box>
        </Paper>
      </Container>

      {/* OVERLAY DE CARREGAMENTO */}
      {renderLoadingOverlay()}
    </>
  );
};

export default CheckoutFlow;
