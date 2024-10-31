import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components-css/Habitaciones.css';

// Componente para crear o editar una habitación
const CrearHabitacion = ({ onHabitacionCreada, habitacionEditada, onCancelarEdicion, onGuardarEdicion }) => {
  const [servicios, setServicios] = useState([]);
  const [idServicio, setIdServicio] = useState('');
  const [numHabitacion, setNumHabitacion] = useState('');
  const [tipoHabitacion, setTipoHabitacion] = useState('');
  const [numeroCamas, setNumeroCamas] = useState('');
  const [tipoDeCama, setTipoDeCama] = useState('');
  const [estado, setEstado] = useState('');
  const [precio, setPrecio] = useState('');
  const [descuento, setDescuento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await fetch('https://apistart.onrender.com/api/servicios/all');
        const data = await response.json();
        if (response.ok) {
          setServicios(data.servicios);
        }
      } catch (error) {
        console.error('Error al obtener servicios:', error);
      }
    };

    fetchServicios();

    if (habitacionEditada) {
      setIdServicio(habitacionEditada.ID_SERVICIO || '');
      setNumHabitacion(habitacionEditada.NUM_HABITACION || '');
      setTipoHabitacion(habitacionEditada.TIPO_HABITACION || '');
      setNumeroCamas(habitacionEditada.NUMERO_CAMAS || '');
      setTipoDeCama(habitacionEditada.TIPO_DE_CAMA || '');
      setEstado(habitacionEditada.ESTADO || '');
      setPrecio(habitacionEditada.PRECIO || '');
      setDescuento(habitacionEditada.DESCUENTO || '');
      setDescripcion(habitacionEditada.DESCRIPCION || '');
    } else {
      setIdServicio('');
      setNumHabitacion('');
      setTipoHabitacion('');
      setNumeroCamas('');
      setTipoDeCama('');
      setEstado('');
      setPrecio('');
      setDescuento('');
      setDescripcion('');
    }
  }, [habitacionEditada]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevaHabitacion = {
      ID_SERVICIO: parseInt(idServicio, 10) || null,
      NUM_HABITACION: numHabitacion,
      TIPO_HABITACION: tipoHabitacion,
      NUMERO_CAMAS: numeroCamas,
      TIPO_DE_CAMA: tipoDeCama,
      ESTADO: estado,
      PRECIO: parseFloat(precio) || 0,
      DESCUENTO: parseFloat(descuento) || 0,
      DESCRIPCION: descripcion
    };

    if (habitacionEditada) {
      onGuardarEdicion({ ...habitacionEditada, ...nuevaHabitacion });
    } else {
      try {
        const response = await fetch('https://apistart.onrender.com/api/habitaciones/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevaHabitacion),
        });
        const data = await response.json();
        if (response.ok) {
          setMensaje('Habitación creada con éxito');
          setError(false);
          setIdServicio('');
          setNumHabitacion('');
          setTipoHabitacion('');
          setNumeroCamas('');
          setTipoDeCama('');
          setEstado('');
          setPrecio('');
          setDescuento('');
          setDescripcion('');
          onHabitacionCreada(data.habitacion);
        } else {
          setMensaje(`Error: ${data.message || 'Ocurrió un error inesperado'}`);
          setError(true);
        }
      } catch (error) {
        setMensaje('Error al crear la habitación');
        setError(true);
      }
    }
  };

  return (
    <div className="container my-4">
      <h2>{habitacionEditada ? 'Editar Habitación' : 'Crear Nueva Habitación'}</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Servicio:</label>
          <select
            className="form-control"
            value={idServicio}
            onChange={(e) => setIdServicio(e.target.value)}
            required
          >
            <option value="">Selecciona un servicio</option>
            {servicios.map((servicio) => (
              <option key={servicio.ID_SERVICIO} value={servicio.ID_SERVICIO}>
                {servicio.TIPO_SERVICIO}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Número de Habitación:</label>
          <input type="text" className="form-control" value={numHabitacion} onChange={(e) => setNumHabitacion(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Tipo de Habitación:</label>
          <input type="text" className="form-control" value={tipoHabitacion} onChange={(e) => setTipoHabitacion(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Número de Camas:</label>
          <input type="number" className="form-control" value={numeroCamas} onChange={(e) => setNumeroCamas(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Tipo de Cama:</label>
          <input type="text" className="form-control" value={tipoDeCama} onChange={(e) => setTipoDeCama(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Estado:</label>
          <input type="text" className="form-control" value={estado} onChange={(e) => setEstado(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Precio:</label>
          <input type="number" step="0.01" className="form-control" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Descuento:</label>
          <input type="number" step="0.01" className="form-control" value={descuento} onChange={(e) => setDescuento(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción:</label>
          <input type="text" className="form-control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">{habitacionEditada ? 'Guardar Cambios' : 'Crear Habitación'}</button>
        {habitacionEditada && <button type="button" className="btn btn-secondary ms-2" onClick={onCancelarEdicion}>Cancelar</button>}
      </form>
      {mensaje && <div className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'}`} role="alert">{mensaje}</div>}
    </div>
  );
};

// Componente para mostrar la lista de habitaciones
const MostrarHabitaciones = ({ habitaciones, onEliminarHabitacion, onEditarHabitacion }) => {
  return (
    <div className="container my-4">
      <h2>Lista de Habitaciones</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>ID Habitación</th>
            <th>Servicio</th>
            <th>Número</th>
            <th>Tipo</th>
            <th>Camas</th>
            <th>Tipo de Cama</th>
            <th>Estado</th>
            <th>Precio</th>
            <th>Descuento</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {habitaciones.length > 0 ? (
            habitaciones.map((habitacion) => (
              <tr key={habitacion.ID_HABITACION}>
                <td>{habitacion.ID_HABITACION}</td>
                <td>{habitacion.ID_SERVICIO}</td>
                <td>{habitacion.NUM_HABITACION}</td>
                <td>{habitacion.TIPO_HABITACION}</td>
                <td>{habitacion.NUMERO_CAMAS}</td>
                <td>{habitacion.TIPO_DE_CAMA}</td>
                <td>{habitacion.ESTADO}</td>
                <td>{habitacion.PRECIO}</td>
                <td>{habitacion.DESCUENTO}</td>
                <td>{habitacion.DESCRIPCION}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => onEditarHabitacion(habitacion)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onEliminarHabitacion(habitacion.ID_HABITACION)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11">No hay habitaciones registradas</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Componente principal que muestra la creación y lista de habitaciones
const Habitaciones = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [habitacionEditada, setHabitacionEditada] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  const obtenerHabitaciones = async () => {
    try {
      const response = await fetch('https://apistart.onrender.com/api/habitaciones/all');
      const data = await response.json();
      if (response.ok) {
        setHabitaciones(data.habitaciones);
        setMensaje('Habitaciones obtenidas con éxito');
        setError(false);
      } else {
        setMensaje('Error al obtener las habitaciones');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error en la comunicación con la API');
      setError(true);
    }
  };

  useEffect(() => {
    obtenerHabitaciones();
  }, []);

  const agregarHabitacion = (nuevaHabitacion) => {
    setHabitaciones((prevHabitaciones) => [...prevHabitaciones, nuevaHabitacion]);
  };

  const eliminarHabitacion = async (id) => {
    try {
      const response = await fetch(`https://apistart.onrender.com/api/habitaciones/delete/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setHabitaciones((prevHabitaciones) => prevHabitaciones.filter((habitacion) => habitacion.ID_HABITACION !== id));
        setMensaje('Habitación eliminada con éxito');
        setError(false);
      } else {
        setMensaje('Error al eliminar la habitación');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error al comunicarse con la API');
      setError(true);
    }
  };

  const iniciarEdicionHabitacion = (habitacion) => {
    setHabitacionEditada(habitacion);
  };

  const cancelarEdicion = () => {
    setHabitacionEditada(null);
  };

  const guardarEdicionHabitacion = async (habitacionActualizada) => {
    try {
      const response = await fetch(`https://apistart.onrender.com/api/habitaciones/update/${habitacionActualizada.ID_HABITACION}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habitacionActualizada),
      });
      if (response.ok) {
        const habitacionesActualizadas = habitaciones.map((habitacion) =>
          habitacion.ID_HABITACION === habitacionActualizada.ID_HABITACION ? habitacionActualizada : habitacion
        );
        setHabitaciones(habitacionesActualizadas);
        setHabitacionEditada(null);
        setMensaje('Habitación editada con éxito');
        setError(false);
      } else {
        setMensaje('Error al editar la habitación');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error al comunicarse con la API');
      setError(true);
    }
  };

  return (
    <div>
      <CrearHabitacion
        onHabitacionCreada={agregarHabitacion}
        habitacionEditada={habitacionEditada}
        onCancelarEdicion={cancelarEdicion}
        onGuardarEdicion={guardarEdicionHabitacion}
      />
      <MostrarHabitaciones habitaciones={habitaciones} onEliminarHabitacion={eliminarHabitacion} onEditarHabitacion={iniciarEdicionHabitacion} />
      {mensaje && (
        <div className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'}`} role="alert">
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default Habitaciones;
