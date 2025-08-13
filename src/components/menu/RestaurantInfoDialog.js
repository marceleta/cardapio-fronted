'use client';

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tabs, Tab, Box, Typography, IconButton, Link as MuiLink } from '@mui/material';
import { Close as CloseIcon, Instagram, Phone, WhatsApp, LocationOn } from '@mui/icons-material';
import { restaurantInfo, operatingHours, paymentMethods } from '../../lib/mockData'; // Added import

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function RestaurantInfoDialog({ open, onClose }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {restaurantInfo.name}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ height: '400px', overflowY: 'auto' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="restaurant info tabs" variant="fullWidth">
            <Tab label="Sobre" {...a11yProps(0)} />
            <Tab label="Horário" {...a11yProps(1)} />
            <Tab label="Pagamento" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <img src={restaurantInfo.logo} alt="Restaurant Logo" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }} />
            
            <MuiLink href={restaurantInfo.instagram} target="_blank" rel="noopener" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Instagram /> {restaurantInfo.instagram.split('/').pop()}
            </MuiLink>
            <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Phone /> {restaurantInfo.phone}
            </Typography>
            <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <WhatsApp /> {restaurantInfo.whatsapp}
            </Typography>
            <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOn /> {restaurantInfo.address}
            </Typography>
          </Box>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Box>
            {operatingHours.map((item, index) => (
              <Typography key={index} sx={{ display: 'flex', justifyContent: 'space-between', my: 0.5 }}>
                <Typography component="span" fontWeight="bold">{item.day}:</Typography>
                <Typography component="span">{item.hours}</Typography>
              </Typography>
            ))}
          </Box>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Box>
            {paymentMethods.map((method, index) => (
              <Typography key={index} sx={{ my: 0.5 }}>
                - {method}
              </Typography>
            ))}
          </Box>
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}
