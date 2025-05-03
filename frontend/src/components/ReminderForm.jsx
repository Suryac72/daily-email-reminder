import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Paper, Stack
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import MessageIcon from '@mui/icons-material/Message';
import { useSnackbar } from 'notistack';

function ReminderForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      });
      
      console.log(response);
      if (response.ok) {
        enqueueSnackbar('Email reminder scheduled successfully! ✅', { variant: 'success' });
        setEmail('');
        setMessage('');
      } else {
        enqueueSnackbar('Failed to schedule reminder ❌', { variant: 'error' });
      }
    } catch (err) {
      console.log(err);
      enqueueSnackbar('Something went wrong 😓', { variant: 'error' });
    }
  };

  return (
    <Paper elevation={4} sx={{ p: 4, width: 800, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Daily Email Reminder
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Recipient Email"
            type="email"
            value={email}
            required
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: <EmailIcon sx={{ mr: 1 }} />,
            }}
          />

          <TextField
            label="Reminder Message"
            value={message}
            required
            fullWidth
            multiline
            minRows={3}
            onChange={(e) => setMessage(e.target.value)}
            InputProps={{
              startAdornment: <MessageIcon sx={{ mr: 1 }} />,
            }}
          />

          <Button variant="contained" color="primary" type="submit">
            Set Reminder
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}

export default ReminderForm;
