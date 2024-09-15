import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import HomePage from './pages/HomePage/homePage';
import ExamsRequest from './pages/ExamsRequest/examsRequest';

import './App.css';

function App() {
  const location = useLocation();

  useEffect(() => {
    const setTitle = (path) => {
      switch (path) {
        case '/':
          document.title = 'MedFlow | Login';
        case '/solicitacao-de-exames':
          document.title = 'MedFlow | Solicitações de Exames';
          break;
        default:
          document.title = 'MedFlow | Gestão de Solicitações';
      }
    };

    // Chama a função para definir o título
    setTitle(location.pathname);
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/solicitacao-de-exames" element={<ExamsRequest />} />
    </Routes>
  );
}

export default function RootApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}