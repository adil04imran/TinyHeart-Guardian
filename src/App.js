import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from './context/ThemeContext';
import Navigation from './components/Navigation';

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const PatientForm = React.lazy(() => import('./components/PatientForm'));
const PatientHistory = React.lazy(() => import('./components/PatientHistory'));

// Loading component for lazy loading
const Loading = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="80vh"
  >
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navigation />
            <Box component="main" sx={{ 
              flexGrow: 1,
              pt: { xs: 8, sm: 10 },
              px: { xs: 2, sm: 3 },
              pb: 2,
              backgroundColor: 'background.default',
              minHeight: '100vh'
            }}>
              <Container maxWidth="xl">
                <React.Suspense fallback={<Loading />}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/predict" element={<PatientForm />} />
                    <Route path="/history" element={<PatientHistory />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </React.Suspense>
              </Container>
            </Box>
          </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;