import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components-css/Reporte.css';

const CrearReporte = ({ onReporteCreado, reporteEditado, onCancelarEdicion, onGuardarEdicion }) => {
    const [empleados, setEmpleados] = useState([]);
    const [idEmpleado, setIdEmpleado] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [fechaGenerado, setFechaGenerado] = useState('');
    const [detalle, setDetalle] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchEmpleados = async () => {
            try {
                const response = await fetch('https://apistart.onrender.com/api/empleados/all');
                const data = await response.json();
                if (response.ok) {
                    setEmpleados(data.empleados);
                }
            } catch (error) {
                console.error('Error al obtener empleados:', error);
            }
        };

        fetchEmpleados();

        if (reporteEditado) {
            setIdEmpleado(reporteEditado.ID_EMPLEADO || '');
            setDepartamento(reporteEditado.DEPARTAMENTO || '');
            setFechaGenerado(reporteEditado.FECHA_GENERADO || '');
            setDetalle(reporteEditado.DETALLE || '');
        } else {
            setIdEmpleado('');
            setDepartamento('');
            setFechaGenerado('');
            setDetalle('');
        }
    }, [reporteEditado]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nuevoReporte = {
            ID_EMPLEADO: parseInt(idEmpleado, 10) || null,
            DEPARTAMENTO: departamento,
            FECHA_GENERADO: fechaGenerado,
            DETALLE: detalle
        };

        try {
            let response;
            if (reporteEditado) {
                response = await fetch(`https://apistart.onrender.com/api/reportes/update/${reporteEditado.ID_REPORTE}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nuevoReporte),
                });
            } else {
                response = await fetch('https://apistart.onrender.com/api/reportes/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nuevoReporte),
                });
            }

            const data = await response.json();

            if (response.ok) {
                setMensaje(reporteEditado ? 'Reporte actualizado con éxito' : 'Reporte creado con éxito');
                setError(false);
                if (reporteEditado) {
                    onGuardarEdicion(data.reporte);
                } else {
                    onReporteCreado(data.reporte);
                }
            } else {
                setMensaje(`Error: ${data.message || 'Ocurrió un error inesperado'}`);
                setError(true);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            setMensaje('Error al procesar el reporte');
            setError(true);
        }
    };

    return (
        <div className="container my-4">
            <h2>{reporteEditado ? 'Editar Reporte' : 'Crear Nuevo Reporte'}</h2>
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label className="form-label">Empleado:</label>
                    <select
                        className="form-control"
                        value={idEmpleado}
                        onChange={(e) => setIdEmpleado(e.target.value)}
                        required
                    >
                        <option value="">Selecciona un empleado</option>
                        {empleados.map((empleado) => (
                            <option key={empleado.ID_EMPLEADO} value={empleado.ID_EMPLEADO}>
                                {empleado.NOMBRE} {empleado.APELLIDO}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Departamento:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={departamento}
                        onChange={(e) => setDepartamento(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Fecha Generado:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={fechaGenerado}
                        onChange={(e) => setFechaGenerado(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Detalle:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={detalle}
                        onChange={(e) => setDetalle(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    {reporteEditado ? 'Guardar Cambios' : 'Crear Reporte'}
                </button>
                {reporteEditado && (
                    <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={onCancelarEdicion}
                    >
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

const MostrarReportes = ({ reportes, onEliminarReporte, onEditarReporte }) => {
    return (
        <div className="container my-4">
            <h2>Lista de Reportes</h2>
            <table className="table table-striped mt-3">
                <thead>
                    <tr>
                        <th>ID Reporte</th>
                        <th>Empleado</th>
                        <th>Departamento</th>
                        <th>Fecha Generado</th>
                        <th>Detalle</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {reportes.length > 0 ? (
                        reportes.map((reporte) => (
                            <tr key={reporte.ID_REPORTE}>
                                <td>{reporte.ID_REPORTE}</td>
                                <td>{reporte.ID_EMPLEADO}</td>
                                <td>{reporte.DEPARTAMENTO}</td>
                                <td>{reporte.FECHA_GENERADO}</td>
                                <td>{reporte.DETALLE}</td>
                                <td>
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => onEditarReporte(reporte)}>Editar</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => onEliminarReporte(reporte.ID_REPORTE)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No hay reportes registrados</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const Reportes = () => {
    const [reportes, setReportes] = useState([]);
    const [reporteEditado, setReporteEditado] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState(false);

    const obtenerReportes = async () => {
        try {
            const response = await fetch('https://apistart.onrender.com/api/reportes/all');
            const data = await response.json();
            if (response.ok) {
                setReportes(data.reportes);
                setMensaje('Reportes obtenidos con éxito');
                setError(false);
            } else {
                setMensaje('Error al obtener los reportes');
                setError(true);
            }
        } catch (error) {
            setMensaje('Error en la comunicación con la API');
            setError(true);
        }
    };

    useEffect(() => {
        obtenerReportes();
    }, []);

    const agregarReporte = (nuevoReporte) => {
        setReportes((prevReportes) => [...prevReportes, nuevoReporte]);
    };

    const eliminarReporte = async (id) => {
        try {
            const response = await fetch(`https://apistart.onrender.com/api/reportes/delete/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setReportes((prevReportes) => prevReportes.filter((reporte) => reporte.ID_REPORTE !== id));
                setMensaje('Reporte eliminado con éxito');
                setError(false);
            } else {
                setMensaje('Error al eliminar el reporte');
                setError(true);
            }
        } catch (error) {
            setMensaje('Error al comunicarse con la API');
            setError(true);
        }
    };

    const iniciarEdicionReporte = (reporte) => {
        setReporteEditado(reporte);
    };

    const cancelarEdicion = () => {
        setReporteEditado(null);
    };

    const guardarEdicionReporte = async (reporteActualizado) => {
        try {
            const response = await fetch(`https://apistart.onrender.com/api/reportes/update/${reporteActualizado.ID_REPORTE}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reporteActualizado),
            });
            if (response.ok) {
                const reportesActualizados = reportes.map((reporte) =>
                    reporte.ID_REPORTE === reporteActualizado.ID_REPORTE ? reporteActualizado : reporte
                );
                setReportes(reportesActualizados);
                setReporteEditado(null);
                setMensaje('Reporte editado con éxito');
                setError(false);
            } else {
                setMensaje('Error al editar el reporte');
                setError(true);
            }
        } catch (error) {
            setMensaje('Error al comunicarse con la API');
            setError(true);
        }
    };

    return (
        <div>
            <CrearReporte
                onReporteCreado={agregarReporte}
                reporteEditado={reporteEditado}
                onCancelarEdicion={cancelarEdicion}
                onGuardarEdicion={guardarEdicionReporte}
            />
            <MostrarReportes reportes={reportes} onEliminarReporte={eliminarReporte} onEditarReporte={iniciarEdicionReporte} />
            {mensaje && (
                <div className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'}`} role="alert">
                    {mensaje}
                </div>
            )}
        </div>
    );
};

export default Reportes;
