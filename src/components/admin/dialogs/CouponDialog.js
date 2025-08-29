/**
 * DIÁLOGO DE CUPOM - CRIAÇÃO E EDIÇÃO
 * 
 * Modal responsável pela criação e edição de cupons de desconto.
 * Inclui validações em tempo real e interface intuitiva para configuração.
 * 
 * Funcionalidades:
 * - Formulário completo de cupom
 * - Validação em tempo real
 * - Configuração de período de validade
 * - Seleção de dias da semana ativos
 * - Opção de primeira compra apenas
 * - Tipos de desconto (porcentagem/valor fixo)
 * - Configurações de uso e limites
 */

'use client';

import React, { useState, useEffect } from 'react';

// Importações do Material-UI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Switch,
  Checkbox,
  RadioGroup,
  Radio,
  Box,
  Typography,
  Grid,
  Alert,
  Chip,
  InputAdornment,
  Paper,
  Divider,
  CircularProgress
} from '@mui/material';

// Importações de ícones
import {
  Save,
  Close,
  LocalOffer,
  Percent,
  AttachMoney,
  CalendarToday,
  Schedule,
  People,
  Info
} from '@mui/icons-material';

/**
 * DADOS DOS DIAS DA SEMANA
 */
const WEEKDAYS = [
  { value: 1, label: 'Segunda', short: 'Seg' },
  { value: 2, label: 'Terça', short: 'Ter' },
  { value: 3, label: 'Quarta', short: 'Qua' },
  { value: 4, label: 'Quinta', short: 'Qui' },
  { value: 5, label: 'Sexta', short: 'Sex' },
  { value: 6, label: 'Sábado', short: 'Sáb' },
  { value: 0, label: 'Domingo', short: 'Dom' }
];

/**
 * COMPONENTE PRINCIPAL DO DIÁLOGO
 */
const CouponDialog = ({ 
  open, 
  onClose, 
  onSave, 
  coupon, 
  mode = 'create', 
  loading = false 
}) => {
  // Estados do formulário
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  /**
   * INICIALIZAR FORMULÁRIO
   * Preenche dados quando o diálogo abre
   */
  useEffect(() => {
    if (open && coupon) {
      setFormData({
        code: coupon.code || '',
        description: coupon.description || '',
        type: coupon.type || 'percentage',
        value: coupon.value || '',
        minOrderValue: coupon.minOrderValue || '',
        maxDiscount: coupon.maxDiscount || '',
        startDate: coupon.startDate || '',
        endDate: coupon.endDate || '',
        isActive: coupon.isActive !== undefined ? coupon.isActive : true,
        firstPurchaseOnly: coupon.firstPurchaseOnly || false,
        activeDays: coupon.activeDays || [1, 2, 3, 4, 5, 6, 0],
        usageLimit: coupon.usageLimit || ''
      });
      setErrors({});
    }
  }, [open, coupon]);

  /**
   * VALIDAÇÃO EM TEMPO REAL
   */
  useEffect(() => {
    if (formData.code !== undefined) {
      validateForm();
    }
  }, [formData]);

  /**
   * FUNÇÃO DE VALIDAÇÃO
   */
  const validateForm = () => {
    const newErrors = {};

    // Validação do código
    if (!formData.code?.trim()) {
      newErrors.code = 'Código é obrigatório';
    } else if (formData.code.length < 3) {
      newErrors.code = 'Código deve ter pelo menos 3 caracteres';
    } else if (!/^[A-Z0-9]+$/.test(formData.code)) {
      newErrors.code = 'Use apenas letras maiúsculas e números';
    }

    // Validação da descrição
    if (!formData.description?.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Descrição deve ter pelo menos 10 caracteres';
    }

    // Validação do valor
    if (!formData.value || isNaN(formData.value) || Number(formData.value) <= 0) {
      newErrors.value = 'Valor deve ser maior que zero';
    } else if (formData.type === 'percentage' && Number(formData.value) > 100) {
      newErrors.value = 'Porcentagem não pode ser maior que 100%';
    }

    // Validação de valor mínimo do pedido
    if (formData.minOrderValue && (isNaN(formData.minOrderValue) || Number(formData.minOrderValue) < 0)) {
      newErrors.minOrderValue = 'Valor deve ser positivo';
    }

    // Validação de desconto máximo
    if (formData.maxDiscount && (isNaN(formData.maxDiscount) || Number(formData.maxDiscount) <= 0)) {
      newErrors.maxDiscount = 'Valor deve ser maior que zero';
    }

    // Validação de datas
    if (!formData.startDate) {
      newErrors.startDate = 'Data de início é obrigatória';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Data de fim é obrigatória';
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate >= endDate) {
        newErrors.endDate = 'Data de fim deve ser posterior à data de início';
      }

      if (endDate < today) {
        newErrors.endDate = 'Data de fim não pode ser no passado';
      }
    }

    // Validação de dias ativos
    if (!formData.activeDays || formData.activeDays.length === 0) {
      newErrors.activeDays = 'Selecione pelo menos um dia';
    }

    // Validação de limite de uso
    if (formData.usageLimit && (isNaN(formData.usageLimit) || Number(formData.usageLimit) <= 0)) {
      newErrors.usageLimit = 'Limite deve ser maior que zero';
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  /**
   * MANIPULADOR DE MUDANÇAS NO FORMULÁRIO
   */
  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' 
      ? event.target.checked 
      : event.target.value;

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * MANIPULADOR DE DIAS DA SEMANA
   */
  const handleDayToggle = (dayValue) => {
    setFormData(prev => ({
      ...prev,
      activeDays: prev.activeDays.includes(dayValue)
        ? prev.activeDays.filter(day => day !== dayValue)
        : [...prev.activeDays, dayValue].sort((a, b) => a - b)
    }));
  };

  /**
   * SELEÇÃO RÁPIDA DE DIAS
   */
  const selectAllDays = () => {
    setFormData(prev => ({
      ...prev,
      activeDays: [1, 2, 3, 4, 5, 6, 0]
    }));
  };

  const selectWeekdays = () => {
    setFormData(prev => ({
      ...prev,
      activeDays: [1, 2, 3, 4, 5]
    }));
  };

  const selectWeekend = () => {
    setFormData(prev => ({
      ...prev,
      activeDays: [6, 0]
    }));
  };

  /**
   * SUBMISSÃO DO FORMULÁRIO
   */
  const handleSubmit = async () => {
    if (!isValid) return;

    // Preparar dados para envio
    const dataToSave = {
      ...formData,
      value: Number(formData.value),
      minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : 0,
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null
    };

    if (mode === 'edit') {
      await onSave(coupon.id, dataToSave);
    } else {
      await onSave(dataToSave);
    }
  };

  /**
   * FORMATADORES DE EXIBIÇÃO
   */
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      {/* CABEÇALHO */}
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LocalOffer color="primary" />
          <Typography variant="h6">
            {mode === 'create' ? 'Criar Novo Cupom' : 'Editar Cupom'}
          </Typography>
        </Box>
      </DialogTitle>

      {/* CONTEÚDO */}
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* INFORMAÇÕES BÁSICAS */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>
                📋 Informações Básicas
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Código do Cupom"
                    value={formData.code || ''}
                    onChange={handleChange('code')}
                    error={!!errors.code}
                    helperText={errors.code || 'Ex: BEMVINDO10, QUINTA15'}
                    placeholder="CODIGO10"
                    inputProps={{ 
                      style: { textTransform: 'uppercase' },
                      maxLength: 20
                    }}
                    onInput={(e) => {
                      e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset">
                    <FormLabel>Status</FormLabel>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isActive || false}
                          onChange={handleChange('isActive')}
                          color="success"
                        />
                      }
                      label={formData.isActive ? 'Ativo' : 'Inativo'}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descrição"
                    value={formData.description || ''}
                    onChange={handleChange('description')}
                    error={!!errors.description}
                    helperText={errors.description || 'Descreva o cupom para os clientes'}
                    multiline
                    rows={2}
                    placeholder="Desconto especial para novos clientes..."
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* CONFIGURAÇÕES DE DESCONTO */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>
                💰 Configurações de Desconto
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel>Tipo de Desconto</FormLabel>
                    <RadioGroup
                      row
                      value={formData.type || 'percentage'}
                      onChange={handleChange('type')}
                    >
                      <FormControlLabel
                        value="percentage"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Percent />
                            <span>Porcentagem</span>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="fixed_amount"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AttachMoney />
                            <span>Valor Fixo</span>
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label={formData.type === 'percentage' ? 'Porcentagem (%)' : 'Valor (R$)'}
                    value={formData.value || ''}
                    onChange={handleChange('value')}
                    error={!!errors.value}
                    helperText={errors.value}
                    type="number"
                    inputProps={{ 
                      min: 0,
                      max: formData.type === 'percentage' ? 100 : undefined,
                      step: formData.type === 'percentage' ? 1 : 0.01
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {formData.type === 'percentage' ? <Percent /> : <AttachMoney />}
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Valor Mínimo do Pedido (R$)"
                    value={formData.minOrderValue || ''}
                    onChange={handleChange('minOrderValue')}
                    error={!!errors.minOrderValue}
                    helperText={errors.minOrderValue || 'Opcional - valor mínimo para usar o cupom'}
                    type="number"
                    inputProps={{ min: 0, step: 0.01 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                {formData.type === 'percentage' && (
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Desconto Máximo (R$)"
                      value={formData.maxDiscount || ''}
                      onChange={handleChange('maxDiscount')}
                      error={!!errors.maxDiscount}
                      helperText={errors.maxDiscount || 'Opcional - limite máximo de desconto'}
                      type="number"
                      inputProps={{ min: 0, step: 0.01 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoney />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* PERÍODO DE VALIDADE */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>
                📅 Período de Validade
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Data de Início"
                    type="date"
                    value={formData.startDate || ''}
                    onChange={handleChange('startDate')}
                    error={!!errors.startDate}
                    helperText={errors.startDate}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Data de Fim"
                    type="date"
                    value={formData.endDate || ''}
                    onChange={handleChange('endDate')}
                    error={!!errors.endDate}
                    helperText={errors.endDate}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* DIAS DA SEMANA ATIVOS */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>
                🗓️ Dias da Semana Ativos
              </Typography>
              
              {/* Botões de seleção rápida */}
              <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button size="small" variant="outlined" onClick={selectAllDays}>
                  Todos os Dias
                </Button>
                <Button size="small" variant="outlined" onClick={selectWeekdays}>
                  Dias Úteis
                </Button>
                <Button size="small" variant="outlined" onClick={selectWeekend}>
                  Fins de Semana
                </Button>
              </Box>

              {/* Seleção individual de dias */}
              <FormGroup row>
                {WEEKDAYS.map((day) => (
                  <FormControlLabel
                    key={day.value}
                    control={
                      <Checkbox
                        checked={formData.activeDays?.includes(day.value) || false}
                        onChange={() => handleDayToggle(day.value)}
                        color="primary"
                      />
                    }
                    label={day.label}
                  />
                ))}
              </FormGroup>
              
              {errors.activeDays && (
                <Typography variant="caption" color="error">
                  {errors.activeDays}
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* CONFIGURAÇÕES AVANÇADAS */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>
                ⚙️ Configurações Avançadas
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.firstPurchaseOnly || false}
                        onChange={handleChange('firstPurchaseOnly')}
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <People />
                        <span>Disponível apenas para primeira compra</span>
                      </Box>
                    }
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Quando ativado, o cupom só pode ser usado por clientes que nunca fizeram pedidos
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Limite de Uso"
                    value={formData.usageLimit || ''}
                    onChange={handleChange('usageLimit')}
                    error={!!errors.usageLimit}
                    helperText={errors.usageLimit || 'Opcional - quantas vezes pode ser usado'}
                    type="number"
                    inputProps={{ min: 1 }}
                    placeholder="Sem limite"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* PREVIEW DO CUPOM */}
          {formData.code && formData.value && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h6" gutterBottom>
                  🎯 Preview do Cupom
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  flexWrap: 'wrap'
                }}>
                  <Chip
                    label={formData.code}
                    variant="outlined"
                    sx={{ 
                      color: 'white', 
                      borderColor: 'white',
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }}
                  />
                  <Typography variant="body1">
                    {formData.type === 'percentage' 
                      ? `${formData.value}% de desconto`
                      : `${formatCurrency(formData.value)} de desconto`
                    }
                  </Typography>
                  {formData.minOrderValue > 0 && (
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      (Mínimo: {formatCurrency(formData.minOrderValue)})
                    </Typography>
                  )}
                </Box>
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                  {formData.description}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      {/* AÇÕES */}
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose}
          startIcon={<Close />}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <Save />}
          disabled={!isValid || loading}
        >
          {loading 
            ? 'Salvando...' 
            : mode === 'create' 
              ? 'Criar Cupom' 
              : 'Salvar Alterações'
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CouponDialog;
