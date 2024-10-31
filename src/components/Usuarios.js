import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components-css/Usuarios.css';


// Componente para crear o editar un usuario
const CrearUsuario = ({ onUsuarioCreado, usuarioEditado, onCancelarEdicion, onGuardarEdicion }) => {
  const [usuario, setUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [fechaUltimoAcceso, setFechaUltimoAcceso] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  // Si usuarioEditado cambia, actualizamos el formulario con sus datos
  useEffect(() => {
    if (usuarioEditado) {
      setUsuario(usuarioEditado.USUARIO);
      setCorreo(usuarioEditado.CORREO);
      setContraseña(''); // Contraseña no se muestra por seguridad, el usuario puede ingresarla nuevamente
      setFechaUltimoAcceso(usuarioEditado.FECHA_ULTIMO_ACCESO || '');
    } else {
      setUsuario('');
      setCorreo('');
      setContraseña('');
      setFechaUltimoAcceso('');
    }
  }, [usuarioEditado]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevoUsuario = {
      usuario: usuario,
      correo: correo,
      contraseña: contraseña,
      fecha_ultimo_acceso: fechaUltimoAcceso || null,
    };

    if (usuarioEditado) {
      // Guardar los cambios de edición
      onGuardarEdicion({ ...usuarioEditado, USUARIO: usuario, CORREO: correo, FECHA_ULTIMO_ACCESO: fechaUltimoAcceso });
    } else {
      // Crear un nuevo usuario
      try {
        const response = await fetch('https://apistart.onrender.com/api/usuarios/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoUsuario),
        });

        const data = await response.json();

        if (response.ok) {
          setMensaje('Usuario creado con éxito');
          setError(false);
          setUsuario('');
          setCorreo('');
          setContraseña('');
          setFechaUltimoAcceso('');
          onUsuarioCreado(data.usuario);
        } else {
          setMensaje(`Error: ${data.message}`);
          setError(true);
        }
      } catch (error) {
        setMensaje('Error al crear el usuario');
        setError(true);
      }
    }
  };

  return (
    <div className="container my-4">
      <h2>{usuarioEditado ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Usuario:</label>
          <input
            type="text"
            className="form-control"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo:</label>
          <input
            type="email"
            className="form-control"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña:</label>
          <input
            type="password"
            className="form-control"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required={!usuarioEditado}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha Último Acceso (Opcional):</label>
          <input
            type="date"
            className="form-control"
            value={fechaUltimoAcceso}
            onChange={(e) => setFechaUltimoAcceso(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {usuarioEditado ? 'Guardar Cambios' : 'Crear Usuario'}
        </button>
        {usuarioEditado && (
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

// Componente para mostrar la lista de usuarios
const MostrarUsuarios = ({ usuarios, onEliminarUsuario, onEditarUsuario }) => {
  return (
    <div className="container my-4">
      <h2>Lista de Usuarios</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>ID Usuario</th>
            <th>Usuario</th>
            <th>Correo</th>
            <th>Fecha Último Acceso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <tr key={usuario.ID_USUARIO}>
                <td>{usuario.ID_USUARIO}</td>
                <td>{usuario.USUARIO}</td>
                <td>{usuario.CORREO}</td>
                <td>{usuario.FECHA_ULTIMO_ACCESO || 'No registrado'}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => onEditarUsuario(usuario)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onEliminarUsuario(usuario.ID_USUARIO)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hay usuarios registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Componente principal que muestra la creación y lista de usuarios
const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditado, setUsuarioEditado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  const obtenerUsuarios = async () => {
    try {
      const response = await fetch('https://apistart.onrender.com/api/usuarios/all');
      const data = await response.json();

      if (response.ok) {
        setUsuarios(data.usuarios);
        setMensaje('Usuarios obtenidos con éxito');
        setError(false);
      } else {
        setMensaje('Error al obtener los usuarios');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error en la comunicación con la API');
      setError(true);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const agregarUsuario = (nuevoUsuario) => {
    setUsuarios((prevUsuarios) => [...prevUsuarios, nuevoUsuario]);
  };

  const eliminarUsuario = async (id) => {
    try {
      const response = await fetch(`https://apistart.onrender.com/api/usuarios/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsuarios((prevUsuarios) => prevUsuarios.filter((usuario) => usuario.ID_USUARIO !== id));
        setMensaje('Usuario eliminado con éxito');
        setError(false);
      } else {
        setMensaje('Error al eliminar el usuario');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error al comunicarse con la API');
      setError(true);
    }
  };

  const iniciarEdicionUsuario = (usuario) => {
    setUsuarioEditado(usuario);
  };

  const cancelarEdicion = () => {
    setUsuarioEditado(null);
  };

  const guardarEdicionUsuario = async (usuarioActualizado) => {
    try {
      const response = await fetch(`https://apistart.onrender.com/api/usuarios/update/${usuarioActualizado.ID_USUARIO}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioActualizado),
      });

      if (response.ok) {
        const usuariosActualizados = usuarios.map((usuario) =>
          usuario.ID_USUARIO === usuarioActualizado.ID_USUARIO ? usuarioActualizado : usuario
        );
        setUsuarios(usuariosActualizados);
        setUsuarioEditado(null);
        setMensaje('Usuario editado con éxito');
        setError(false);
      } else {
        setMensaje('Error al editar el usuario');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error al comunicarse con la API');
      setError(true);
    }
  };

  return (
    <div>
      <CrearUsuario
        onUsuarioCreado={agregarUsuario}
        usuarioEditado={usuarioEditado}
        onCancelarEdicion={cancelarEdicion}
        onGuardarEdicion={guardarEdicionUsuario}
      />
      <MostrarUsuarios usuarios={usuarios} onEliminarUsuario={eliminarUsuario} onEditarUsuario={iniciarEdicionUsuario} />
      {mensaje && (
        <div className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'}`} role="alert">
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default Usuarios;
