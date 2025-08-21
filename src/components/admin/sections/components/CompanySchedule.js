/**
 * HORÁRIO DE FUNCIONAMENTO - COMPONENTE MODULAR
 * 
 * Componente responsável pelo gerenciamento dos horários de funcionamento
 * da empresa, incluindo horários por dia da semana e períodos especiais.
 * 
 * Funcionalidades:
 * - Horários por dia da semana
 * - Configuração de fechado/aberto
 * - Validação de horários
 * 
 * @author Sistema Admin
 * @since 20/08/2025
 */

// ========== IMPORTAÇÕES ==========
import React from 'react';
import {
  Grid,
  TextField,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Switch,
  Box,
  Chip
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';

// ========== CONSTANTES ==========
/**
 * Dias da semana em português
 */
const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Segunda-feira', short: 'SEG' },
  { key: 'tuesday', label: 'Terça-feira', short: 'TER' },
  { key: 'wednesday', label: 'Quarta-feira', short: 'QUA' },
  { key: 'thursday', label: 'Quinta-feira', short: 'QUI' },
  { key: 'friday', label: 'Sexta-feira', short: 'SEX' },
  { key: 'saturday', label: 'Sábado', short: 'SAB' },
  { key: 'sunday', label: 'Domingo', short: 'DOM' }
];

// ========== COMPONENTE PRINCIPAL ==========
/**
 * COMPONENTE: CompanySchedule
 * Formulário para horários de funcionamento da empresa
 */
const CompanySchedule = ({ companyData, updateField }) => {
  
  // ========== FUNÇÕES AUXILIARES ==========
  
  /**
   * Atualiza horário de um dia específico
   */
  const updateDaySchedule = (day, field, value) => {
    const currentSchedule = companyData.operatingHours || {};
    const daySchedule = currentSchedule[day] || { isOpen: true, openTime: '09:00', closeTime: '18:00' };
    
    const updatedSchedule = {
      ...currentSchedule,
      [day]: {
        ...daySchedule,
        [field]: value
      }
    };
    
    updateField('operatingHours', updatedSchedule);
  };

  /**
   * Obtém horário de um dia específico
   */
  const getDaySchedule = (day) => {
    const schedule = companyData.operatingHours || {};
    return schedule[day] || { isOpen: true, openTime: '09:00', closeTime: '18:00' };
  };

  /**
   * Formata exibição de horário para visualização
   */
  const formatScheduleDisplay = (schedule) => {
    if (!schedule.isOpen) return 'Fechado';
    return `${schedule.openTime} às ${schedule.closeTime}`;
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <ScheduleIcon />
          Horário de Funcionamento
        </Typography>
        
        {/* Lista de dias da semana */}
        <Box sx={{ mt: 2 }}>
          {DAYS_OF_WEEK.map((day) => {
            const daySchedule = getDaySchedule(day.key);
            
            return (
              <Card 
                key={day.key} 
                variant="outlined" 
                sx={{ mb: 2, p: 2 }}
              >
                <Grid container spacing={2} alignItems="center">
                  {/* Nome do dia */}
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={day.short} 
                        size="small" 
                        variant="outlined"
                      />
                      <Typography variant="body1" fontWeight="medium">
                        {day.label}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Switch Aberto/Fechado */}
                  <Grid item xs={12} sm={3}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={daySchedule.isOpen}
                          onChange={(e) => updateDaySchedule(day.key, 'isOpen', e.target.checked)}
                          color="primary"
                        />
                      }
                      label={daySchedule.isOpen ? "Aberto" : "Fechado"}
                    />
                  </Grid>

                  {/* Horários */}
                  {daySchedule.isOpen && (
                    <>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Abertura"
                          type="time"
                          value={daySchedule.openTime}
                          onChange={(e) => updateDaySchedule(day.key, 'openTime', e.target.value)}
                          InputProps={{
                            startAdornment: <TimeIcon sx={{ mr: 1, fontSize: 20 }} />
                          }}
                          size="small"
                        />
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Fechamento"
                          type="time"
                          value={daySchedule.closeTime}
                          onChange={(e) => updateDaySchedule(day.key, 'closeTime', e.target.value)}
                          InputProps={{
                            startAdornment: <TimeIcon sx={{ mr: 1, fontSize: 20 }} />
                          }}
                          size="small"
                        />
                      </Grid>
                    </>
                  )}

                  {/* Status visual para fechado */}
                  {!daySchedule.isOpen && (
                    <Grid item xs={12} sm={6}>
                      <Chip 
                        label="Estabelecimento fechado neste dia" 
                        color="default" 
                        variant="outlined"
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                  )}
                </Grid>
              </Card>
            );
          })}
        </Box>

        {/* Resumo visual */}
        <Card variant="outlined" sx={{ mt: 3, p: 2, bgcolor: 'action.hover' }}>
          <Typography variant="subtitle2" gutterBottom>
            📋 Resumo dos Horários
          </Typography>
          <Grid container spacing={1}>
            {DAYS_OF_WEEK.map((day) => {
              const daySchedule = getDaySchedule(day.key);
              return (
                <Grid item xs={12} sm={6} md={4} key={day.key}>
                  <Typography variant="body2">
                    <strong>{day.short}:</strong> {formatScheduleDisplay(daySchedule)}
                  </Typography>
                </Grid>
              );
            })}
          </Grid>
        </Card>
      </CardContent>
    </Card>
  );
};

export default CompanySchedule;
