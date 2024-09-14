import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import './App.css';

function App() {
  const location = useLocation();

  useEffect(() => {
    const setTitle = (path) => {
      switch (path) {
        case '/login':
          document.title = 'MedFlow | Login';
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
      <Route path="/login" element={<Login />} />
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