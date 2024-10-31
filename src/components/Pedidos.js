import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components-css/Pedidos.css';

// Componente para crear o editar un pedido
const CrearPedido = ({ onPedidoCreado, pedidoEditado, onCancelarEdicion, onGuardarEdicion }) => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [restaurantes, setRestaurantes] = useState([]);
  const [idHabitacion, setIdHabitacion] = useState('');
  const [idRestaurante, setIdRestaurante] = useState('');
  const [tipoPedido, setTipoPedido] = useState('');
  const [estado, setEstado] = useState('');
  const [fechaHora, setFechaHora] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [total, setTotal] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        const response = await fetch('https://apistart.onrender.com/api/habitaciones/all');
        const data = await response.json();
        if (response.ok) {
          setHabitaciones(data.habitaciones);
        }
      } catch (error) {
        console.error('Error al obtener habitaciones:', error);
      }
    };

    const fetchRestaurantes = async () => {
      try {
        const response = await fetch('https://apistart.onrender.com/api/restaurantes/all');
        const data = await response.json();
        if (response.ok) {
          setRestaurantes(data.restaurantes);
        }
      } catch (error) {
        console.error('Error al obtener restaurantes:', error);
      }
    };

    fetchHabitaciones();
    fetchRestaurantes();

    if (pedidoEditado) {
      setIdHabitacion(pedidoEditado.ID_HABITACION || '');
      setIdRestaurante(pedidoEditado.ID_RESTAURANTE || '');
      setTipoPedido(pedidoEditado.TIPO_PEDIDO || '');
      setEstado(pedidoEditado.ESTADO || '');
      setFechaHora(pedidoEditado.FECHA_HORA || '');
      setDescripcion(pedidoEditado.DESCRIPCION || '');
      setTotal(pedidoEditado.TOTAL || '');
    } else {
      setIdHabitacion('');
      setIdRestaurante('');
      setTipoPedido('');
      setEstado('');
      setFechaHora('');
      setDescripcion('');
      setTotal('');
    }
  }, [pedidoEditado]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevoPedido = {
      ID_HABITACION: parseInt(idHabitacion, 10) || null,
      ID_RESTAURANTE: parseInt(idRestaurante, 10) || null,
      TIPO_PEDIDO: tipoPedido,
      ESTADO: estado,
      FECHA_HORA: fechaHora,
      DESCRIPCION: descripcion,
      TOTAL: parseFloat(total) || 0,
    };

    if (pedidoEditado) {
      onGuardarEdicion({ ...pedidoEditado, ...nuevoPedido });
    } else {
      try {
        const response = await fetch('https://apistart.onrender.com/api/pedidos/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoPedido),
        });
        const data = await response.json();
        if (response.ok) {
          setMensaje('Pedido creado con éxito');
          setError(false);
          setIdHabitacion('');
          setIdRestaurante('');
          setTipoPedido('');
          setEstado('');
          setFechaHora('');
          setDescripcion('');
          setTotal('');
          onPedidoCreado(data.pedido);
        } else {
          setMensaje(`Error: ${data.message || 'Ocurrió un error inesperado'}`);
          setError(true);
        }
      } catch (error) {
        setMensaje('Error al crear el pedido');
        setError(true);
      }
    }
  };

  return (
    <div className="container my-4">
      <h2>{pedidoEditado ? 'Editar Pedido' : 'Crear Nuevo Pedido'}</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Habitación:</label>
          <select className="form-control" value={idHabitacion} onChange={(e) => setIdHabitacion(e.target.value)} required>
            <option value="">Selecciona una habitación</option>
            {habitaciones.map((habitacion) => (
              <option key={habitacion.ID_HABITACION} value={habitacion.ID_HABITACION}>
                {habitacion.TIPO_HABITACION}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Restaurante:</label>
          <select className="form-control" value={idRestaurante} onChange={(e) => setIdRestaurante(e.target.value)} required>
            <option value="">Selecciona un restaurante</option>
            {restaurantes.map((restaurante) => (
              <option key={restaurante.ID_RESTAURANTE} value={restaurante.ID_RESTAURANTE}>
                {restaurante.NOMBRE}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Tipo de Pedido:</label>
          <input type="text" className="form-control" value={tipoPedido} onChange={(e) => setTipoPedido(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Estado:</label>
          <select className="form-control" value={estado} onChange={(e) => setEstado(e.target.value)} required>
            <option value="">Selecciona un estado</option>
            <option value="Disponible">Disponible</option>
            <option value="Ocupado">Ocupado</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Reservado">Reservado</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha y Hora:</label>
          <input type="datetime-local" className="form-control" value={fechaHora} onChange={(e) => setFechaHora(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción:</label>
          <input type="text" className="form-control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Total:</label>
          <input type="number" step="0.01" className="form-control" value={total} onChange={(e) => setTotal(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">{pedidoEditado ? 'Guardar Cambios' : 'Crear Pedido'}</button>
        {pedidoEditado && <button type="button" className="btn btn-secondary ms-2" onClick={onCancelarEdicion}>Cancelar</button>}
      </form>
      {mensaje && <div className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'}`} role="alert">{mensaje}</div>}
    </div>
  );
};

// Componente para mostrar la lista de pedidos
const MostrarPedidos = ({ pedidos, onEliminarPedido, onEditarPedido }) => {
  return (
    <div className="container my-4">
      <h2>Lista de Pedidos</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Habitación</th>
            <th>Restaurante</th>
            <th>Tipo de Pedido</th>
            <th>Estado</th>
            <th>Fecha y Hora</th>
            <th>Descripción</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.length > 0 ? (
            pedidos.map((pedido) => (
              <tr key={pedido.ID_PEDIDO}>
                <td>{pedido.ID_PEDIDO}</td>
                <td>{pedido.ID_HABITACION}</td>
                <td>{pedido.ID_RESTAURANTE}</td>
                <td>{pedido.TIPO_PEDIDO}</td>
                <td>{pedido.ESTADO}</td>
                <td>{pedido.FECHA_HORA}</td>
                <td>{pedido.DESCRIPCION}</td>
                <td>{pedido.TOTAL}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => onEditarPedido(pedido)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onEliminarPedido(pedido.ID_PEDIDO)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No hay pedidos registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Componente principal que muestra la creación y lista de pedidos
const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoEditado, setPedidoEditado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  const obtenerPedidos = async () => {
    try {
      const response = await fetch('https://apistart.onrender.com/api/pedidos/all');
      const data = await response.json();
      if (response.ok) {
        setPedidos(data.pedidos);
        setMensaje('Pedidos obtenidos con éxito');
        setError(false);
      } else {
        setMensaje('Error al obtener los pedidos');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error en la comunicación con la API');
      setError(true);
    }
  };

  useEffect(() => {
    obtenerPedidos();
  }, []);

  const agregarPedido = (nuevoPedido) => {
    setPedidos((prevPedidos) => [...prevPedidos, nuevoPedido]);
  };

  const eliminarPedido = async (id) => {
    try {
      const response = await fetch(`https://apistart.onrender.com/api/pedidos/delete/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setPedidos((prevPedidos) => prevPedidos.filter((pedido) => pedido.ID_PEDIDO !== id));
        setMensaje('Pedido eliminado con éxito');
        setError(false);
      } else {
        setMensaje('Error al eliminar el pedido');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error al comunicarse con la API');
      setError(true);
    }
  };

  const iniciarEdicionPedido = (pedido) => {
    setPedidoEditado(pedido);
  };

  const cancelarEdicion = () => {
    setPedidoEditado(null);
  };

  const guardarEdicionPedido = async (pedidoActualizado) => {
    try {
      const response = await fetch(`https://apistart.onrender.com/api/pedidos/update/${pedidoActualizado.ID_PEDIDO}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoActualizado),
      });
      if (response.ok) {
        const pedidosActualizados = pedidos.map((pedido) =>
          pedido.ID_PEDIDO === pedidoActualizado.ID_PEDIDO ? pedidoActualizado : pedido
        );
        setPedidos(pedidosActualizados);
        setPedidoEditado(null);
        setMensaje('Pedido editado con éxito');
        setError(false);
      } else {
        setMensaje('Error al editar el pedido');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error al comunicarse con la API');
      setError(true);
    }
  };

  return (
    <div>
      <CrearPedido
        onPedidoCreado={agregarPedido}
        pedidoEditado={pedidoEditado}
        onCancelarEdicion={cancelarEdicion}
        onGuardarEdicion={guardarEdicionPedido}
      />
      <MostrarPedidos pedidos={pedidos} onEliminarPedido={eliminarPedido} onEditarPedido={iniciarEdicionPedido} />
      {mensaje && (
        <div className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'}`} role="alert">
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default Pedidos;
