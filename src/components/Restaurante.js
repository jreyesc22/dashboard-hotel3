import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components-css/Restaurante.css';

// Componente para crear o editar un restaurante
const CrearRestaurante = ({ onRestauranteCreado, restauranteEditado, onCancelarEdicion, onGuardarEdicion }) => {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (restauranteEditado) {
      setNombre(restauranteEditado.NOMBRE || '');
      setUbicacion(restauranteEditado.UBICACION || '');
      setDescripcion(restauranteEditado.DESCRIPCION || '');
    } else {
      setNombre('');
      setUbicacion('');
      setDescripcion('');
    }
  }, [restauranteEditado]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevoRestaurante = {
      NOMBRE: nombre,
      UBICACION: ubicacion,
      DESCRIPCION: descripcion,
    };

    if (restauranteEditado) {
      onGuardarEdicion({ ...restauranteEditado, ...nuevoRestaurante });
    } else {
      try {
        const response = await fetch('https://apistart.onrender.com/api/restaurantes/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoRestaurante),
        });
        const data = await response.json();
        if (response.ok) {
          setMensaje('Restaurante creado con éxito');
          setError(false);
          setNombre('');
          setUbicacion('');
          setDescripcion('');
          onRestauranteCreado(data.restaurante);
        } else {
          setMensaje(`Error: ${data.message || 'Ocurrió un error inesperado'}`);
          setError(true);
        }
      } catch (error) {
        setMensaje('Error al crear el restaurante');
        setError(true);
      }
    }
  };

  return (
    <div className="container my-4">
      <h2>{restauranteEditado ? 'Editar Restaurante' : 'Crear Nuevo Restaurante'}</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Nombre:</label>
          <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Ubicación:</label>
          <input type="text" className="form-control" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción:</label>
          <input type="text" className="form-control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">{restauranteEditado ? 'Guardar Cambios' : 'Crear Restaurante'}</button>
        {restauranteEditado && <button type="button" className="btn btn-secondary ms-2" onClick={onCancelarEdicion}>Cancelar</button>}
      </form>
      {mensaje && <div className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'}`} role="alert">{mensaje}</div>}
    </div>
  );
};

// Componente para mostrar la lista de restaurantes
const MostrarRestaurantes = ({ restaurantes, onEliminarRestaurante, onEditarRestaurante }) => {
  return (
    <div className="container my-4">
      <h2>Lista de Restaurantes</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>ID Restaurante</th>
            <th>Nombre</th>
            <th>Ubicación</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {restaurantes.length > 0 ? (
            restaurantes.map((restaurante) => (
              <tr key={restaurante.ID_RESTAURANTE}>
                <td>{restaurante.ID_RESTAURANTE}</td>
                <td>{restaurante.NOMBRE}</td>
                <td>{restaurante.UBICACION}</td>
                <td>{restaurante.DESCRIPCION}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => onEditarRestaurante(restaurante)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onEliminarRestaurante(restaurante.ID_RESTAURANTE)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hay restaurantes registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Componente principal que muestra la creación y lista de restaurantes
const Restaurante = () => {
  const [restaurantes, setRestaurantes] = useState([]);
  const [restauranteEditado, setRestauranteEditado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  const obtenerRestaurantes = async () => {
    try {
      const response = await fetch('https://apistart.onrender.com/api/restaurantes/all');
      const data = await response.json();
      if (response.ok) {
        setRestaurantes(data.restaurantes);
        setMensaje('Restaurantes obtenidos con éxito');
        setError(false);
      } else {
        setMensaje('Error al obtener los restaurantes');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error en la comunicación con la API');
      setError(true);
    }
  };

  useEffect(() => {
    obtenerRestaurantes();
  }, []);

  const agregarRestaurante = (nuevoRestaurante) => {
    setRestaurantes((prevRestaurantes) => [...prevRestaurantes, nuevoRestaurante]);
  };

  const eliminarRestaurante = async (id) => {
    try {
      const response = await fetch(`https://apistart.onrender.com/api/restaurantes/delete/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setRestaurantes((prevRestaurantes) => prevRestaurantes.filter((restaurante) => restaurante.ID_RESTAURANTE !== id));
        setMensaje('Restaurante eliminado con éxito');
        setError(false);
      } else {
        setMensaje('Error al eliminar el restaurante');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error al comunicarse con la API');
      setError(true);
    }
  };

  const iniciarEdicionRestaurante = (restaurante) => {
    setRestauranteEditado(restaurante);
  };

  const cancelarEdicion = () => {
    setRestauranteEditado(null);
  };

  const guardarEdicionRestaurante = async (restauranteActualizado) => {
    try {
      const response = await fetch(`https://apistart.onrender.com/api/restaurantes/update/${restauranteActualizado.ID_RESTAURANTE}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restauranteActualizado),
      });
      if (response.ok) {
        const restaurantesActualizados = restaurantes.map((restaurante) =>
          restaurante.ID_RESTAURANTE === restauranteActualizado.ID_RESTAURANTE ? restauranteActualizado : restaurante
        );
        setRestaurantes(restaurantesActualizados);
        setRestauranteEditado(null);
        setMensaje('Restaurante editado con éxito');
        setError(false);
      } else {
        setMensaje('Error al editar el restaurante');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error al comunicarse con la API');
      setError(true);
    }
  };

  return (
    <div>
      <CrearRestaurante
        onRestauranteCreado={agregarRestaurante}
        restauranteEditado={restauranteEditado}
        onCancelarEdicion={cancelarEdicion}
        onGuardarEdicion={guardarEdicionRestaurante}
      />
      <MostrarRestaurantes restaurantes={restaurantes} onEliminarRestaurante={eliminarRestaurante} onEditarRestaurante={iniciarEdicionRestaurante} />
      {mensaje && (
        <div className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'}`} role="alert">
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default Restaurante;
