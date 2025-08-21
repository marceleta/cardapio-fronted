/**
 * MAPA DA EMPRESA - COMPONENTE MODULAR
 * 
 * Componente responsável pela visualização da localização da empresa
 * no mapa, incluindo coordenadas e visualização interativa.
 * 
 * Funcionalidades:
 * - Campos de latitude e longitude
 * - Preview do endereço completo
 * - Links para mapas externos
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
  Box,
  Button,
  Chip,
  Alert
} from '@mui/material';
import {
  Map as MapIcon,
  LocationOn as LocationIcon,
  Launch as LaunchIcon,
  MyLocation as MyLocationIcon
} from '@mui/icons-material';

// ========== COMPONENTE PRINCIPAL ==========
/**
 * COMPONENTE: CompanyMap
 * Formulário para localização e mapa da empresa
 */
const CompanyMap = ({ companyData, updateField }) => {
  
  // ========== FUNÇÕES AUXILIARES ==========
  
  /**
   * Formata endereço completo para exibição
   */
  const getFullAddress = () => {
    const parts = [];
    if (companyData.address) parts.push(companyData.address);
    if (companyData.number) parts.push(companyData.number);
    if (companyData.city) parts.push(companyData.city);
    if (companyData.state) parts.push(companyData.state);
    if (companyData.zipCode) parts.push(`CEP ${companyData.zipCode}`);
    
    return parts.join(', ') || 'Endereço não informado';
  };

  /**
   * Abre Google Maps com o endereço
   */
  const openGoogleMaps = () => {
    const address = getFullAddress();
    if (address !== 'Endereço não informado') {
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    }
  };

  /**
   * Abre Google Maps com coordenadas
   */
  const openMapsWithCoordinates = () => {
    if (companyData.latitude && companyData.longitude) {
      window.open(`https://www.google.com/maps?q=${companyData.latitude},${companyData.longitude}`, '_blank');
    }
  };

  /**
   * Obtém localização atual do usuário
   */
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateField('latitude', position.coords.latitude.toString());
          updateField('longitude', position.coords.longitude.toString());
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          alert('Erro ao obter localização. Verifique as permissões do navegador.');
        }
      );
    } else {
      alert('Geolocalização não é suportada por este navegador.');
    }
  };

  /**
   * Valida se as coordenadas são válidas
   */
  const areCoordinatesValid = () => {
    const lat = parseFloat(companyData.latitude);
    const lng = parseFloat(companyData.longitude);
    return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <MapIcon />
          Localização no Mapa
        </Typography>

        {/* Preview do endereço */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            📍 Endereço Atual:
          </Typography>
          <Chip 
            icon={<LocationIcon />}
            label={getFullAddress()}
            variant="outlined"
            sx={{ 
              height: 'auto',
              '& .MuiChip-label': {
                display: 'block',
                whiteSpace: 'normal',
                textAlign: 'left',
                py: 1
              }
            }}
          />
        </Box>

        {/* Coordenadas */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Latitude"
              value={companyData.latitude || ''}
              onChange={(e) => updateField('latitude', e.target.value)}
              variant="outlined"
              placeholder="-23.5505"
              helperText="Exemplo: -23.5505 (São Paulo)"
              type="number"
              inputProps={{
                step: "any",
                min: -90,
                max: 90
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Longitude"
              value={companyData.longitude || ''}
              onChange={(e) => updateField('longitude', e.target.value)}
              variant="outlined"
              placeholder="-46.6333"
              helperText="Exemplo: -46.6333 (São Paulo)"
              type="number"
              inputProps={{
                step: "any",
                min: -180,
                max: 180
              }}
            />
          </Grid>
        </Grid>

        {/* Botões de ação */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<MyLocationIcon />}
              onClick={getCurrentLocation}
              size="small"
            >
              Usar Localização Atual
            </Button>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<LaunchIcon />}
              onClick={openGoogleMaps}
              disabled={getFullAddress() === 'Endereço não informado'}
              size="small"
            >
              Abrir no Google Maps
            </Button>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<MapIcon />}
              onClick={openMapsWithCoordinates}
              disabled={!areCoordinatesValid()}
              size="small"
            >
              Ver Coordenadas
            </Button>
          </Grid>
        </Grid>

        {/* Status das coordenadas */}
        {companyData.latitude && companyData.longitude && (
          <Box sx={{ mt: 2 }}>
            {areCoordinatesValid() ? (
              <Alert severity="success" icon={<LocationIcon />}>
                <strong>Coordenadas válidas!</strong> Sua empresa será exibida corretamente no mapa.
                <br />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  📍 {companyData.latitude}, {companyData.longitude}
                </Typography>
              </Alert>
            ) : (
              <Alert severity="error">
                <strong>Coordenadas inválidas!</strong> Verifique se os valores estão corretos.
              </Alert>
            )}
          </Box>
        )}

        {/* Dica para usuário */}
        {!companyData.latitude && !companyData.longitude && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>💡 Dica:</strong> Para uma melhor experiência dos clientes, adicione as coordenadas da sua empresa. 
            Você pode usar o botão "Usar Localização Atual" se estiver no local do estabelecimento.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyMap;
