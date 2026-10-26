import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '@/app/providers';
import { AppRouter } from '@/app/router';

export const App: React.FC = () => {
  return (
    <React.StrictMode>
      <AppProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AppProvider>
    </React.StrictMode>
  );
};

export default App;
