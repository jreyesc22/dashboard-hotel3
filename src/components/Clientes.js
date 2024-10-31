import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components-css/Clientes.css';

// Componente para crear o editar un cliente
const CrearCliente = ({ onClienteCreado, clienteEditado, onCancelarEdicion, onGuardarEdicion }) => {
  const [idUsuario, setIdUsuario] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cui, setCui] = useState('');
  const [pasaporte, setPasaporte] = useState('');
  const [nacionalidad, setNacionalidad] = useState('');
  const [direccion, setDireccion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    // Obtener lista de usuarios
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('https://apistart.onrender.com/api/usuarios/all');
        const data = await response.json();
        if (response.ok) {
          setUsuarios(data.usuarios);
        }
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    fetchUsuarios();

    if (clienteEditado) {
      setIdUsuario(clienteEditado.ID_USUARIO || '');
      setNombre(clienteEditado.NOMBRE || '');
      setApellido(clienteEditado.APELLIDO || '');
      setCorreo(clienteEditado.CORREO || '');
      setTelefono(clienteEditado.TELEFONO || '');
      setCui(clienteEditado.CUI || '');
      setPasaporte(clienteEditado.PASAPORTE || '');
      setNacionalidad(clienteEditado.NACIONALIDAD || '');
      setDireccion(clienteEditado.DIRECCION || '');
    } else {
      resetForm();
    }
  }, [clienteEditado]);

  const resetForm = () => {
    setIdUsuario('');
    setNombre('');
    setApellido('');
    setCorreo('');
    setTelefono('');
    setCui('');
    setPasaporte('');
    setNacionalidad('');
    setDireccion('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevoCliente = {
      ID_USUARIO: parseInt(idUsuario, 10) || null,
      CUI: cui,
      PASAPORTE: pasaporte,
      NOMBRE: nombre,
      APELLIDO: apellido,
      CORREO: correo,
      TELEFONO: telefono,
      NACIONALIDAD: nacionalidad,
      DIRECCION: direccion,
    };

    if (clienteEditado) {
      onGuardarEdicion({ ...clienteEditado, ...nuevoCliente });
    } else {
      try {
        const response = await fetch('https://apistart.onrender.com/api/clientes/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoCliente),
        });
        const data = await response.json();
        if (response.ok) {
          setMensaje('Cliente creado con éxito');
          setError(false);
          resetForm();
          onClienteCreado(data.cliente);
        } else {
          setMensaje(`Error: ${data.message || 'Ocurrió un error inesperado'}`);
          setError(true);
        }
      } catch (error) {
        setMensaje('Error al crear el cliente');
        setError(true);
      }
    }
  };

  return (
    <div className="container my-4">
      <h2>{clienteEditado ? 'Editar Cliente' : 'Crear Nuevo Cliente'}</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Usuario:</label>
          <select className="form-control" value={idUsuario} onChange={(e) => setIdUsuario(e.target.value)} required>
            <option value="">Selecciona un usuario</option>
            {usuarios.map((usuario) => (
              <option key={usuario.ID_USUARIO} value={usuario.ID_USUARIO}>
                {usuario.USUARIO}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Nombre:</label>
          <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Apellido:</label>
          <input type="text" className="form-control" value={apellido} onChange={(e) => setApellido(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo:</label>
          <input type="email" className="form-control" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono:</label>
          <input type="number" className="form-control" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">CUI:</label>
          <input type="text" className="form-control" value={cui} onChange={(e) => setCui(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Pasaporte:</label>
          <input type="text" className="form-control" value={pasaporte} onChange={(e) => setPasaporte(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Nacionalidad:</label>
          <input type="text" className="form-control" value={nacionalidad} onChange={(e) => setNacionalidad(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección:</label>
          <input type="text" className="form-control" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">
          {clienteEditado ? 'Guardar Cambios' : 'Crear Cliente'}
        </button>
        {clienteEditado && (
          <button type="button" className="btn btn-secondary ms-2" onClick={onCancelarEdicion}>
            Cancelar
          </button>
        )}
      </form>
      {mensaje && (
        <div className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'}`} role="alert">
          {mensaje}
        </div>
      )}
    </div>
  );
};

// Componente para mostrar la lista de clientes
const MostrarClientes = ({ clientes, onEliminarCliente, onEditarCliente }) => {
  return (
    <div className="container my-4">
      <h2>Lista de Clientes</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>ID Usuario</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>CUI</th>
            <th>Pasaporte</th>
            <th>Nacionalidad</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length > 0 ? (
            clientes.map((cliente) => (
              <tr key={cliente.ID_CLIENTE}>
                <td>{cliente.ID_USUARIO}</td>
                <td>{cliente.NOMBRE}</td>
                <td>{cliente.APELLIDO}</td>
                <td>{cliente.CORREO}</td>
                <td>{cliente.TELEFONO}</td>
                <td>{cliente.CUI}</td>
                <td>{cliente.PASAPORTE}</td>
                <td>{cliente.NACIONALIDAD}</td>
                <td>{cliente.DIRECCION}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => onEditarCliente(cliente)}>
                    Editar
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => onEliminarCliente(cliente.ID_CLIENTE)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No hay clientes registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Componente principal que muestra la creación y lista de clientes
const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteEditado, setClienteEditado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  const obtenerClientes = async () => {
    try {
      const response = await fetch('https://apistart.onrender.com/api/clientes/all');
      const data = await response.json();
      if (response.ok) {
        setClientes(data.clientes);
        setMensaje('Clientes obtenidos con éxito');
        setError(false);
      } else {
        setMensaje('Error al obtener los clientes');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error en la comunicación con la API');
      setError(true);
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  const agregarCliente = (nuevoCliente) => {
    setClientes((prevClientes) => [...prevClientes, nuevoCliente]);
  };

  const eliminarCliente = async (id) => {
    try {
      const response = await fetch(`https://apistart.onrender.com/api/clientes/delete/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setClientes((prevClientes) => prevClientes.filter((cliente) => cliente.ID_CLIENTE !== id));
        setMensaje('Cliente eliminado con éxito');
        setError(false);
      } else {
        setMensaje('Error al eliminar el cliente');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error al comunicarse con la API');
      setError(true);
    }
  };

  const iniciarEdicionCliente = (cliente) => {
    setClienteEditado(cliente);
  };

  const cancelarEdicion = () => {
    setClienteEditado(null);
  };

  const guardarEdicionCliente = (clienteActualizado) => {
    setClientes((prevClientes) =>
      prevClientes.map((cliente) => (cliente.ID_CLIENTE === clienteActualizado.ID_CLIENTE ? clienteActualizado : cliente))
    );
    setClienteEditado(null);
    setMensaje('Cliente editado con éxito');
    setError(false);
  };

  return (
    <div>
      <CrearCliente
        onClienteCreado={agregarCliente}
        clienteEditado={clienteEditado}
        onCancelarEdicion={cancelarEdicion}
        onGuardarEdicion={guardarEdicionCliente}
      />
      <MostrarClientes clientes={clientes} onEliminarCliente={eliminarCliente} onEditarCliente={iniciarEdicionCliente} />
      {mensaje && (
        <div className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'}`} role="alert">
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default Clientes;
