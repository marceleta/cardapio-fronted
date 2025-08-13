'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  Alert
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

export default function AccountDialog({ open, onClose }) {
  const { user, login, logout } = useAuth();
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const success = login(whatsapp, password);
    if (!success) {
      setError('Whatsapp ou senha inválidos.');
    } else {
      setError('');
      onClose(); // Close dialog on successful login
    }
  };

  const handleLogout = () => {
    logout();
    onClose(); // Close dialog on logout
  };

  const handleClose = () => {
    setError('');
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        Minha Conta
        <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {user ? (
          <Box>
            <Typography variant="h6">{user.name}</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>{user.whatsapp}</Typography>
            <Typography variant="body2" color="text.secondary">{user.address}</Typography>
          </Box>
        ) : (
          <Box component="form" noValidate autoComplete="off">
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              autoFocus
              margin="dense"
              id="whatsapp"
              label="Whatsapp"
              type="tel"
              fullWidth
              variant="outlined"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
            <TextField
              margin="dense"
              id="password"
              label="Senha"
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {user ? (
          <Button onClick={handleLogout} color="primary">
            Sair
          </Button>
        ) : (
          <Button onClick={handleLogin} variant="contained" color="primary">
            Entrar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
