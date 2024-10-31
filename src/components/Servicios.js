import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components-css/Servicios.css';

// Componente para crear o editar un servicio
const CrearServicio = ({ onServicioCreado, servicioEditado, onCancelarEdicion, onGuardarEdicion }) => {
  const [tipoServicio, setTipoServicio] = useState('');
  const [duracion, setDuracion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaHora, setFechaHora] = useState('');
  const [precio, setPrecio] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  // Si servicioEditado cambia, actualizamos el formulario con sus datos
  useEffect(() => {
    if (servicioEditado) {
      setTipoServicio(servicioEditado.TIPO_SERVICIO);
      setDuracion(servicioEditado.DURACION || '');
      setDescripcion(servicioEditado.DESCRIPCION || '');
      setFechaHora(servicioEditado.FECHA_HORA ? new Date(servicioEditado.FECHA_HORA).toISOString().slice(0, 16) : '');
      setPrecio(servicioEditado.PRECIO);
    } else {
      setTipoServicio('');
      setDuracion('');
      setDescripcion('');
      setFechaHora('');
      setPrecio('');
    }
  }, [servicioEditado]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevoServicio = {
      TIPO_SERVICIO: tipoServicio,
      DURACION: duracion,
      DESCRIPCION: descripcion,
      FECHA_HORA: fechaHora ? new Date(fechaHora).toISOString() : null,
      PRECIO: parseFloat(precio),
    };

    if (servicioEditado) {
      onGuardarEdicion({ ...servicioEditado, ...nuevoServicio });
    } else {
      try {
        const response = await fetch('https://apistart.onrender.com/api/servicios/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoServicio),
        });
        const data = await response.json();
        if (response.ok) {
          setMensaje('Servicio creado con éxito');
          setError(false);
          setTipoServicio('');
          setDuracion('');
          setDescripcion('');
          setFechaHora('');
          setPrecio('');
          onServicioCreado(data.servicio);
        } else {
          setMensaje(`Error: ${data.message || 'Ocurrió un error inesperado'}`);
          setError(true);
        }
      } catch (error) {
        setMensaje('Error al crear el servicio');
        setError(true);
      }
    }
  };

  return (
    <div className="container my-4">
      <h2>{servicioEditado ? 'Editar Servicio' : 'Crear Nuevo Servicio'}</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Tipo de Servicio:</label>
          <input type="text" className="form-control" value={tipoServicio} onChange={(e) => setTipoServicio(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Duración:</label>
          <input type="text" className="form-control" value={duracion} onChange={(e) => setDuracion(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción:</label>
          <input type="text" className="form-control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha y Hora:</label>
          <input type="datetime-local" className="form-control" value={fechaHora} onChange={(e) => setFechaHora(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Precio:</label>
          <input type="number" step="0.01" className="form-control" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">{servicioEditado ? 'Guardar Cambios' : 'Crear Servicio'}</button>
        {servicioEditado && <button type="button" className="btn btn-secondary ms-2" onClick={onCancelarEdicion}>Cancelar</button>}
      </form>
      {mensaje && <div className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'}`} role="alert">{mensaje}</div>}
    </div>
  );
};

// Componente para mostrar la lista de servicios
const MostrarServicios = ({ servicios, onEliminarServicio, onEditarServicio }) => {
  return (
    <div className="container my-4">
      <h2>Lista de Servicios</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>ID Servicio</th>
            <th>Tipo</th>
            <th>Duración</th>
            <th>Descripción</th>
            <th>Fecha y Hora</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.length > 0 ? (
            servicios.map((servicio) => (
              <tr key={servicio.ID_SERVICIO}>
                <td>{servicio.ID_SERVICIO}</td>
                <td>{servicio.TIPO_SERVICIO}</td>
                <td>{servicio.DURACION}</td>
                <td>{servicio.DESCRIPCION}</td>
                <td>{servicio.FECHA_HORA || 'No registrado'}</td>
                <td>{servicio.PRECIO}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => onEditarServicio(servicio)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onEliminarServicio(servicio.ID_SERVICIO)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No hay servicios registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Componente principal que muestra la creación y lista de servicios
const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [servicioEditado, setServicioEditado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  const obtenerServicios = async () => {
    try {
      const response = await fetch('https://apistart.onrender.com/api/servicios/all');
      const data = await response.json();
      if (response.ok) {
        setServicios(data.servicios);
        setMensaje('Servicios obtenidos con éxito');
        setError(false);
      } else {
        setMensaje('Error al obtener los servicios');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error en la comunicación con la API');
      setError(true);
    }
  };

  useEffect(() => {
    obtenerServicios();
  }, []);

  const agregarServicio = (nuevoServicio) => {
    setServicios((prevServicios) => [...prevServicios, nuevoServicio]);
  };

  const eliminarServicio = async (id) => {
    try {
      const response = await fetch(`https://apistart.onrender.com/api/servicios/delete/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setServicios((prevServicios) => prevServicios.filter((servicio) => servicio.ID_SERVICIO !== id));
        setMensaje('Servicio eliminado con éxito');
        setError(false);
      } else {
        setMensaje('Error al eliminar el servicio');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error al comunicarse con la API');
      setError(true);
    }
  };

  const iniciarEdicionServicio = (servicio) => {
    setServicioEditado(servicio);
  };

  const cancelarEdicion = () => {
    setServicioEditado(null);
  };

  const guardarEdicionServicio = async (servicioActualizado) => {
    try {
      const response = await fetch(`https://apistart.onrender.com/api/servicios/update/${servicioActualizado.ID_SERVICIO}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(servicioActualizado),
      });
      if (response.ok) {
        const serviciosActualizados = servicios.map((servicio) =>
          servicio.ID_SERVICIO === servicioActualizado.ID_SERVICIO ? servicioActualizado : servicio
        );
        setServicios(serviciosActualizados);
        setServicioEditado(null);
        setMensaje('Servicio editado con éxito');
        setError(false);
      } else {
        setMensaje('Error al editar el servicio');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error al comunicarse con la API');
      setError(true);
    }
  };

  return (
    <div>
      <CrearServicio
        onServicioCreado={agregarServicio}
        servicioEditado={servicioEditado}
        onCancelarEdicion={cancelarEdicion}
        onGuardarEdicion={guardarEdicionServicio}
      />
      <MostrarServicios servicios={servicios} onEliminarServicio={eliminarServicio} onEditarServicio={iniciarEdicionServicio} />
      {mensaje && (
        <div className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'}`} role="alert">
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default Servicios;
