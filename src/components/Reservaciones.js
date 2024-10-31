import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components-css/Reservaciones.css';

// Componente para crear o editar una reservación
const CrearReservacion = ({ onReservacionCreada, reservacionEditada, onCancelarEdicion, onGuardarEdicion }) => {
    const [idCliente, setIdCliente] = useState('');
    const [tipoCliente, setTipoCliente] = useState('');
    const [fechaReserva, setFechaReserva] = useState('');
    const [horaReserva, setHoraReserva] = useState('');
    const [diasReserva, setDiasReserva] = useState('');
    const [estadoCancelacion, setEstadoCancelacion] = useState('');
    const [total, setTotal] = useState('');
    const [comentario, setComentario] = useState('');
    const [clientes, setClientes] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState(false);

    // Cargar clientes para seleccionar en la reservación
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await fetch('https://apistart.onrender.com/api/clientes/all');
                const data = await response.json();
                if (response.ok) setClientes(data.clientes);
            } catch (error) {
                console.error('Error al obtener clientes:', error);
            }
        };

        fetchClientes();

        // Inicializar campos en caso de edición
        if (reservacionEditada) {
            setIdCliente(reservacionEditada.ID_CLIENTE);
            setTipoCliente(reservacionEditada.TIPO_CLIENTE || '');
            setFechaReserva(reservacionEditada.FECHA_RESERVA || '');
            setHoraReserva(reservacionEditada.HORA_RESERVA || '');
            setDiasReserva(reservacionEditada.DIAS_RESERVA || '');
            setEstadoCancelacion(reservacionEditada.ESTADO_CANCELACION || '');
            setTotal(reservacionEditada.TOTAL || '');
            setComentario(reservacionEditada.COMENTARIO || '');
        } else {
            setIdCliente('');
            setTipoCliente('');
            setFechaReserva('');
            setHoraReserva('');
            setDiasReserva('');
            setEstadoCancelacion('');
            setTotal('');
            setComentario('');
        }
    }, [reservacionEditada]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nuevaReservacion = {
            ID_CLIENTE: parseInt(idCliente, 10),
            TIPO_CLIENTE: tipoCliente,
            FECHA_RESERVA: fechaReserva,
            HORA_RESERVA: horaReserva,
            DIAS_RESERVA: parseInt(diasReserva, 10),
            ESTADO_CANCELACION: estadoCancelacion,
            TOTAL: parseFloat(total),
            COMENTARIO: comentario
        };

        if (reservacionEditada) {
            onGuardarEdicion({ ...reservacionEditada, ...nuevaReservacion });
        } else {
            try {
                const response = await fetch('https://apistart.onrender.com/api/reservaciones/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nuevaReservacion),
                });
                const data = await response.json();
                if (response.ok) {
                    setMensaje('Reservación creada con éxito');
                    setError(false);
                    onReservacionCreada(data.reservacion);
                    // Limpiar formulario
                    setIdCliente('');
                    setTipoCliente('');
                    setFechaReserva('');
                    setHoraReserva('');
                    setDiasReserva('');
                    setEstadoCancelacion('');
                    setTotal('');
                    setComentario('');
                } else {
                    setMensaje(`Error: ${data.message || 'Ocurrió un error inesperado'}`);
                    setError(true);
                }
            } catch (error) {
                setMensaje('Error al crear la reservación');
                setError(true);
            }
        }
    };

    return (
        <div className="container my-4">
            <h2>{reservacionEditada ? 'Editar Reservación' : 'Crear Nueva Reservación'}</h2>
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label className="form-label">Cliente:</label>
                    <select
                        className="form-control"
                        value={idCliente}
                        onChange={(e) => setIdCliente(e.target.value)}
                        required
                    >
                        <option value="">Selecciona un cliente</option>
                        {clientes.map((cliente) => (
                            <option key={cliente.ID_CLIENTE} value={cliente.ID_CLIENTE}>
                                {cliente.NOMBRE} {cliente.APELLIDO}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Tipo de Cliente:</label>
                    <select
                        className="form-control"
                        value={tipoCliente}
                        onChange={(e) => setTipoCliente(e.target.value)}
                        required
                    >
                        <option value="">Selecciona un tipo de cliente</option>
                        <option value="Turista">Turista</option>
                        <option value="Ejecutivo">Ejecutivo</option>
                        <option value="Corporativo">Corporativo</option>
                        <option value="Grupal">Grupal</option>
                        <option value="Otros">Otros</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Fecha de Reserva:</label>
                    <input type="date" className="form-control" value={fechaReserva} onChange={(e) => setFechaReserva(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Hora de Reserva:</label>
                    <input type="time" className="form-control" value={horaReserva} onChange={(e) => setHoraReserva(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Días de Reserva:</label>
                    <input type="number" className="form-control" value={diasReserva} onChange={(e) => setDiasReserva(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Estado de Cancelación:</label>
                    <select
                        className="form-control"
                        value={estadoCancelacion}
                        onChange={(e) => setEstadoCancelacion(e.target.value)}
                        required
                    >
                        <option value="">Selecciona el estado de la cancelación</option>
                        <option value="Confirmada">Confirmada</option>
                        <option value="Cancelada">Cancelada</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="No Show">No Show</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Total:</label>
                    <input type="number" className="form-control" value={total} onChange={(e) => setTotal(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Comentario:</label>
                    <input type="text" className="form-control" value={comentario} onChange={(e) => setComentario(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">{reservacionEditada ? 'Guardar Cambios' : 'Crear Reservación'}</button>
                {reservacionEditada && <button type="button" className="btn btn-secondary ms-2" onClick={onCancelarEdicion}>Cancelar</button>}
            </form>
            {mensaje && <div className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'}`} role="alert">{mensaje}</div>}
        </div>
    );
};

// Componente para mostrar la lista de reservaciones
const MostrarReservaciones = ({ reservaciones, onEliminarReservacion, onEditarReservacion }) => {
    return (
        <div className="container my-4">
            <h2>Lista de Reservaciones</h2>
            <table className="table table-striped mt-3">
                <thead>
                    <tr>
                        <th>ID Cliente</th>
                        <th>Tipo de Cliente</th>
                        <th>Fecha de Reserva</th>
                        <th>Hora de Reserva</th>
                        <th>Días de Reserva</th>
                        <th>Estado de Cancelación</th>
                        <th>Total</th>
                        <th>Comentario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {reservaciones.length > 0 ? (
                        reservaciones.map((reservacion) => (
                            <tr key={reservacion.ID_RESERVACION}>
                                <td>{reservacion.ID_CLIENTE}</td>
                                <td>{reservacion.TIPO_CLIENTE}</td>
                                <td>{reservacion.FECHA_RESERVA}</td>
                                <td>{reservacion.HORA_RESERVA}</td>
                                <td>{reservacion.DIAS_RESERVA}</td>
                                <td>{reservacion.ESTADO_CANCELACION}</td>
                                <td>{reservacion.TOTAL}</td>
                                <td>{reservacion.COMENTARIO}</td>
                                <td>
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => onEditarReservacion(reservacion)}>Editar</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => onEliminarReservacion(reservacion.ID_RESERVACION)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9">No hay reservaciones registradas</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

// Componente principal que muestra creación y lista de reservaciones
const Reservaciones = () => {
    const [reservaciones, setReservaciones] = useState([]);
    const [reservacionEditada, setReservacionEditada] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState(false);

    const obtenerReservaciones = async () => {
        try {
            const response = await fetch('https://apistart.onrender.com/api/reservaciones/all');
            const data = await response.json();
            if (response.ok) {
                setReservaciones(data.reservaciones);
            } else {
                setMensaje('Error al obtener las reservaciones');
                setError(true);
            }
        } catch (error) {
            setMensaje('Error en la comunicación con la API');
            setError(true);
        }
    };

    useEffect(() => {
        obtenerReservaciones();
    }, []);

    const agregarReservacion = (nuevaReservacion) => {
        setReservaciones((prevReservaciones) => [...prevReservaciones, nuevaReservacion]);
    };

    const eliminarReservacion = async (id) => {
        try {
            const response = await fetch(`https://apistart.onrender.com/api/reservaciones/delete/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setReservaciones(reservaciones.filter((reservacion) => reservacion.ID_RESERVACION !== id));
                setMensaje('Reservación eliminada con éxito');
                setError(false);
            } else {
                setMensaje('Error al eliminar la reservación');
                setError(true);
            }
        } catch (error) {
            setMensaje('Error al comunicarse con la API');
            setError(true);
        }
    };

    const iniciarEdicionReservacion = (reservacion) => {
        setReservacionEditada(reservacion);
    };

    const cancelarEdicion = () => {
        setReservacionEditada(null);
    };

    const guardarEdicionReservacion = (reservacionActualizada) => {
        const reservacionesActualizadas = reservaciones.map((reservacion) =>
            reservacion.ID_RESERVACION === reservacionActualizada.ID_RESERVACION ? reservacionActualizada : reservacion
        );
        setReservaciones(reservacionesActualizadas);
        setReservacionEditada(null);
        setMensaje('Reservación editada con éxito');
        setError(false);
    };

    return (
        <div>
            <CrearReservacion
                onReservacionCreada={agregarReservacion}
                reservacionEditada={reservacionEditada}
                onCancelarEdicion={cancelarEdicion}
                onGuardarEdicion={guardarEdicionReservacion}
            />
            <MostrarReservaciones reservaciones={reservaciones} onEliminarReservacion={eliminarReservacion} onEditarReservacion={iniciarEdicionReservacion} />
            {mensaje && (
                <div className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'}`} role="alert">
                    {mensaje}
                </div>
            )}
        </div>
    );
};

export default Reservaciones;
