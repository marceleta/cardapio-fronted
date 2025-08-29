'use client';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box,
  Chip,
  Paper,
  ButtonBase
} from '@mui/material';
import { 
  Add as AddIcon,
  LocalOffer as OfferIcon 
} from '@mui/icons-material';

export default function ProductCard({ item, onClick }) {
  // Detectar se o item está em promoção (exemplo de lógica)
  const isOnSale = item.originalPrice && item.originalPrice > item.price;
  const discount = isOnSale ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;

  return (
    <Card
      component={ButtonBase}
      onClick={onClick}
      sx={{
        width: '100%',
        minHeight: { xs: '320px', sm: '340px', md: '360px' }, // Altura mínima fixa
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
          borderColor: 'primary.main',
          '& .product-image': {
            transform: 'scale(1.05)'
          }
        },
        '&:active': {
          transform: 'translateY(-2px)',
          transition: 'all 0.1s ease'
        },
        '&:focus': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2
        }
      }}
    >
      {/* Container da imagem com overlay */}
      <Box 
        sx={{ 
          position: 'relative',
          width: '100%',
          height: { xs: '180px', sm: '200px', md: '220px' }, // Altura fixa da imagem
          overflow: 'hidden',
          backgroundColor: 'grey.100' // Cor de fundo caso a imagem não carregue
        }}
      >
        <CardMedia
          component="img"
          className="product-image"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover', // Garante que a imagem cubra toda a área
            objectPosition: 'center', // Centraliza a imagem
            transition: 'transform 0.3s ease'
          }}
          image={item.imageUrl}
          alt={item.name}
          loading="lazy"
        />

        {/* Badge de desconto */}
        {isOnSale && (
          <Paper
            elevation={2}
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              backgroundColor: 'error.main',
              color: 'error.contrastText',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <OfferIcon sx={{ fontSize: '1rem' }} />
            <Typography 
              variant="caption" 
              sx={{ 
                fontWeight: 600,
                fontSize: '0.75rem'
              }}
            >
              -{discount}%
            </Typography>
          </Paper>
        )}

        {/* Overlay com botão de adicionar */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
            p: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            '.MuiCard-root:hover &': {
              opacity: 1
            }
          }}
        >
          <Box
            sx={{
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}
          >
            <AddIcon sx={{ fontSize: '1.2rem' }} />
          </Box>
        </Box>
      </Box>

      {/* Conteúdo do card */}
      <CardContent 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          p: { xs: 2, sm: 2.5 },
          textAlign: 'left',
          minHeight: { xs: '140px', sm: '140px', md: '140px' }, // Altura mínima do conteúdo
          justifyContent: 'space-between' // Distribui o conteúdo uniformemente
        }}
      >
        {/* Nome do produto */}
        <Typography 
          component="h3" 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            lineHeight: 1.3,
            color: 'text.primary',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: { xs: '2.6rem', sm: '2.8rem' }, // Altura fixa para o título
            marginBottom: 1
          }}
        >
          {item.name}
        </Typography>

        {/* Descrição */}
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            fontSize: { xs: '0.85rem', sm: '0.9rem' },
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: '2.8rem', // Altura fixa para a descrição
            marginBottom: 1
          }}
        >
          {item.description}
        </Typography>

        {/* Preços */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mt: 'auto',
            pt: 0.5,
            height: '2rem' // Altura fixa para a área de preços
          }}
        >
          {/* Preço original com desconto */}
          {isOnSale && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.disabled',
                fontSize: '0.9rem',
                textDecoration: 'line-through'
              }}
            >
              R$ {item.originalPrice}
            </Typography>
          )}
          
          {/* Preço atual */}
          <Typography 
            variant="h6" 
            sx={{ 
              color: isOnSale ? 'error.main' : 'primary.main',
              fontWeight: 600,
              fontSize: { xs: '1.1rem', sm: '1.2rem' }
            }}
          >
            R$ {item.price}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

