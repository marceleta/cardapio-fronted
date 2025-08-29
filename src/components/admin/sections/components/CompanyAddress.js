/**
 * ENDEREÇO DA EMPRESA - COMPONENTE MODULAR
 * 
 * Componente responsável pelos campos de endereço da empresa,
 * incluindo CEP, endereço, número, cidade e estado.
 * 
 * Funcionalidades:
 * - Formulário de endereço completo
 * - Combobox de estados brasileiros
 * - Validação de campos obrigatórios
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
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  LocationOn as LocationIcon
} from '@mui/icons-material';

// ========== CONSTANTES ==========
/**
 * Lista de estados brasileiros
 */
const BRAZILIAN_STATES = [
  { code: 'AC', name: 'Acre' },
  { code: 'AL', name: 'Alagoas' },
  { code: 'AP', name: 'Amapá' },
  { code: 'AM', name: 'Amazonas' },
  { code: 'BA', name: 'Bahia' },
  { code: 'CE', name: 'Ceará' },
  { code: 'DF', name: 'Distrito Federal' },
  { code: 'ES', name: 'Espírito Santo' },
  { code: 'GO', name: 'Goiás' },
  { code: 'MA', name: 'Maranhão' },
  { code: 'MT', name: 'Mato Grosso' },
  { code: 'MS', name: 'Mato Grosso do Sul' },
  { code: 'MG', name: 'Minas Gerais' },
  { code: 'PA', name: 'Pará' },
  { code: 'PB', name: 'Paraíba' },
  { code: 'PR', name: 'Paraná' },
  { code: 'PE', name: 'Pernambuco' },
  { code: 'PI', name: 'Piauí' },
  { code: 'RJ', name: 'Rio de Janeiro' },
  { code: 'RN', name: 'Rio Grande do Norte' },
  { code: 'RS', name: 'Rio Grande do Sul' },
  { code: 'RO', name: 'Rondônia' },
  { code: 'RR', name: 'Roraima' },
  { code: 'SC', name: 'Santa Catarina' },
  { code: 'SP', name: 'São Paulo' },
  { code: 'SE', name: 'Sergipe' },
  { code: 'TO', name: 'Tocantins' }
];

// ========== COMPONENTE PRINCIPAL ==========
/**
 * COMPONENTE: CompanyAddress
 * Formulário para endereço da empresa
 */
const CompanyAddress = ({ companyData, updateField }) => {
  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <LocationIcon />
          Endereço da Empresa
        </Typography>
        
        {/* 3. CEP - Otimizado para Full HD (1920px) */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={2}>
            <TextField
              fullWidth
              label="CEP"
              value={companyData.zipCode || ''}
              onChange={(e) => updateField('zipCode', e.target.value)}
              variant="outlined"
              placeholder="12345-678"
            />
          </Grid>
        </Grid>

        {/* 4. Endereço + Número - Layout 67% / 33% */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={10}>
            <TextField
              fullWidth
              label="Endereço *"
              value={companyData.address}
              onChange={(e) => updateField('address', e.target.value)}
              variant="outlined"
              required
              sx={{
                '& .MuiInputBase-input': { fontSize: '1.4rem' },
                '& .MuiInputLabel-root': { fontSize: '1.4rem' }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid size={2}>
            <TextField
              fullWidth
              label="Número"
              value={companyData.number || ''}
              onChange={(e) => updateField('number', e.target.value)}
              variant="outlined"
              placeholder="123"
              sx={{
                '& .MuiInputBase-input': { fontSize: '1.4rem' },
                '& .MuiInputLabel-root': { fontSize: '1.4rem' }
              }}
            />
          </Grid>

        </Grid>

        {/* 4.1. Bairro - Otimizado para Full HD */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Bairro *"
              value={companyData.neighborhood || ''}
              onChange={(e) => updateField('neighborhood', e.target.value)}
              variant="outlined"
              required
            />
          </Grid>
        </Grid>

        {/* 5. Cidade + Estado - Otimizado para Full HD */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Cidade *"
              value={companyData.city}
              onChange={(e) => updateField('city', e.target.value)}
              variant="outlined"
              required
            />
          </Grid>

          <Grid size={4}>
            <FormControl fullWidth variant="outlined" required>
              <InputLabel>Estado *</InputLabel>
              <Select
                value={companyData.state}
                onChange={(e) => updateField('state', e.target.value)}
                label="Estado *"
              >
                {BRAZILIAN_STATES.map((state) => (
                  <MenuItem key={state.code} value={state.code}>
                    {state.name} ({state.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CompanyAddress;
