// src/components/Login.js

import React, { useState } from 'react';

import '../components-css/Login.css'; // Importación del archivo CSS
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Llamada a la API para autenticación
      const response = await fetch('https://apistart.onrender.com/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: username, contraseña: password }),
      });

      const data = await response.json();

      if (data.success) {
        onLogin(data.role); // Pasa el rol recibido al método onLogin
      } else {
        setError(data.message); // Mostrar mensaje de error
      }
    } catch (err) {
      setError('Error de conexión al servidor');
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
