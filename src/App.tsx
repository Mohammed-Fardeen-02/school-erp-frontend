import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '@/app/providers';
import { AppRouter } from '@/app/router';
import { ErrorBoundary } from '@/components/feedback/error-boundary';

export const App: React.FC = () => {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <AppProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </AppProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

export default App;
