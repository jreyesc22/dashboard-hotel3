
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';

import Home from './components/Home';
import Usuario from './components/Usuarios';
import Clientes from './components/Clientes';
import Reservaciones from './components/Reservaciones';
import Habitaciones from './components/Habitaciones';
import Servicios from './components/Servicios';
import Facturacion from './components/DetalleFacturacion';
import Pagos from './components/Pagos';
import Pedidos from './components/Pedidos';
import Restaurante from './components/Restaurante';
import Reportes from './components/Reporte';
import Empleados from './components/Empleados';

//import Login from './components/Login'; // Agrega el componente de Login


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false); // Cambia el estado para cerrar sesión
  };

  return (
    <Router>
      {isAuthenticated ? (
        <>
          <Navbar onLogout={handleLogout} />
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/usuarios" element={<Usuario />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/reservaciones" element={<Reservaciones />} />
            <Route path="/habitaciones" element={<Habitaciones />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/facturacion" element={<Facturacion />} />
            <Route path="/pagos" element={<Pagos />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/restaurante" element={<Restaurante />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/empleados" element={<Empleados />} />
          </Routes>
        </>
      ) : (
       // <Login onLogin={handleLogin} />
      )}
    </Router>
  );
}
export default App;
