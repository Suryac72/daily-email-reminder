import React from 'react';
import { SnackbarProvider } from 'notistack';
import ReminderForm from './components/ReminderForm';
import './App.css'

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <ReminderForm />
    </SnackbarProvider>
  );
}

export default App;
