import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components-css/Pagos.css';

// Componente para crear o editar un pago
const CrearPago = ({ onPagoCreado, pagoEditado, onCancelarEdicion, onGuardarEdicion }) => {
  const [facturas, setFacturas] = useState([]);
  const [idFactura, setIdFactura] = useState('');
  const [fechaPago, setFechaPago] = useState('');
  const [monto, setMonto] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [estado, setEstado] = useState('');
  const [comentario, setComentario] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const response = await fetch('https://apistart.onrender.com/api/facturacion/all');
        const data = await response.json();
        if (response.ok) {
          setFacturas(data.facturas);
        }
      } catch (error) {
        console.error('Error al obtener facturas:', error);
      }
    };

    fetchFacturas();

    if (pagoEditado) {
      setIdFactura(pagoEditado.ID_FACTURA || '');
      setFechaPago(pagoEditado.FECHA_PAGO || '');
      setMonto(pagoEditado.MONTO || '');
      setMetodoPago(pagoEditado.METODO_PAGO || '');
      setEstado(pagoEditado.ESTADO || '');
      setComentario(pagoEditado.COMENTARIO || '');
    } else {
      setIdFactura('');
      setFechaPago('');
      setMonto('');
      setMetodoPago('');
      setEstado('');
      setComentario('');
    }
  }, [pagoEditado]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevoPago = {
      ID_FACTURA: parseInt(idFactura, 10) || null,
      FECHA_PAGO: fechaPago,
      MONTO: parseFloat(monto),
      METODO_PAGO: metodoPago,
      ESTADO: estado,
      COMENTARIO: comentario
    };

    if (pagoEditado) {
      onGuardarEdicion({ ...pagoEditado, ...nuevoPago });
    } else {
      try {
        const response = await fetch('https://apistart.onrender.com/api/pagos/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoPago),
        });
        const data = await response.json();
        if (response.ok) {
          setMensaje('Pago registrado con éxito');
          setError(false);
          setIdFactura('');
          setFechaPago('');
          setMonto('');
          setMetodoPago('');
          setEstado('');
          setComentario('');
          onPagoCreado(data.pago);
        } else {
          setMensaje(`Error: ${data.message || 'Ocurrió un error inesperado'}`);
          setError(true);
        }
      } catch (error) {
        setMensaje('Error al registrar el pago');
        setError(true);
      }
    }
  };

  return (
    <div className="container my-4">
      <h2>{pagoEditado ? 'Editar Pago' : 'Registrar Nuevo Pago'}</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Factura:</label>
          <select
            className="form-control"
            value={idFactura}
            onChange={(e) => setIdFactura(e.target.value)}
            required
          >
            <option value="">Selecciona una factura</option>
            {facturas.map((factura) => (
              <option key={factura.ID_FACTURA} value={factura.ID_FACTURA}>
                {factura.ID_FACTURA} - Total: {factura.TOTAL}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha de Pago:</label>
          <input type="date" className="form-control" value={fechaPago} onChange={(e) => setFechaPago(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Monto:</label>
          <input type="number" step="0.01" className="form-control" value={monto} onChange={(e) => setMonto(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Método de Pago:</label>
          <input type="text" className="form-control" value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Estado:</label>
          <input type="text" className="form-control" value={estado} onChange={(e) => setEstado(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Comentario:</label>
          <input type="text" className="form-control" value={comentario} onChange={(e) => setComentario(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">{pagoEditado ? 'Guardar Cambios' : 'Registrar Pago'}</button>
        {pagoEditado && <button type="button" className="btn btn-secondary ms-2" onClick={onCancelarEdicion}>Cancelar</button>}
      </form>
      {mensaje && <div className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'}`} role="alert">{mensaje}</div>}
    </div>
  );
};

// Componente para mostrar la lista de pagos
const MostrarPagos = ({ pagos, onEliminarPago, onEditarPago }) => {
  return (
    <div className="container my-4">
      <h2>Lista de Pagos</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>ID Pago</th>
            <th>Factura</th>
            <th>Fecha de Pago</th>
            <th>Monto</th>
            <th>Método de Pago</th>
            <th>Estado</th>
            <th>Comentario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pagos.length > 0 ? (
            pagos.map((pago) => (
              <tr key={pago.ID_PAGO}>
                <td>{pago.ID_PAGO}</td>
                <td>{pago.ID_FACTURA}</td>
                <td>{pago.FECHA_PAGO}</td>
                <td>{pago.MONTO}</td>
                <td>{pago.METODO_PAGO}</td>
                <td>{pago.ESTADO}</td>
                <td>{pago.COMENTARIO}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => onEditarPago(pago)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onEliminarPago(pago.ID_PAGO)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No hay pagos registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Componente principal que muestra la creación y lista de pagos
const Pagos = () => {
  const [pagos, setPagos] = useState([]);
  const [pagoEditado, setPagoEditado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  const obtenerPagos = async () => {
    try {
      const response = await fetch('https://apistart.onrender.com/api/pagos/all');
      const data = await response.json();
      if (response.ok) {
        setPagos(data.pagos);
        setMensaje('Pagos obtenidos con éxito');
        setError(false);
      } else {
        setMensaje('Error al obtener los pagos');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error en la comunicación con la API');
      setError(true);
    }
  };

  useEffect(() => {
    obtenerPagos();
  }, []);

  const agregarPago = (nuevoPago) => {
    setPagos((prevPagos) => [...prevPagos, nuevoPago]);
  };

  const eliminarPago = async (id) => {
    try {
      const response = await fetch(`https://apistart.onrender.com/api/pagos/delete/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setPagos((prevPagos) => prevPagos.filter((pago) => pago.ID_PAGO !== id));
        setMensaje('Pago eliminado con éxito');
        setError(false);
      } else {
        setMensaje('Error al eliminar el pago');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error al comunicarse con la API');
      setError(true);
    }
  };

  const iniciarEdicionPago = (pago) => {
    setPagoEditado(pago);
  };

  const cancelarEdicion = () => {
    setPagoEditado(null);
  };

  const guardarEdicionPago = async (pagoActualizado) => {
    try {
      const response = await fetch(`https://apistart.onrender.com/api/pagos/update/${pagoActualizado.ID_PAGO}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pagoActualizado),
      });
      if (response.ok) {
        const pagosActualizados = pagos.map((pago) =>
          pago.ID_PAGO === pagoActualizado.ID_PAGO ? pagoActualizado : pago
        );
        setPagos(pagosActualizados);
        setPagoEditado(null);
        setMensaje('Pago editado con éxito');
        setError(false);
      } else {
        setMensaje('Error al editar el pago');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error al comunicarse con la API');
      setError(true);
    }
  };

  return (
    <div>
      <CrearPago
        onPagoCreado={agregarPago}
        pagoEditado={pagoEditado}
        onCancelarEdicion={cancelarEdicion}
        onGuardarEdicion={guardarEdicionPago}
      />
      <MostrarPagos pagos={pagos} onEliminarPago={eliminarPago} onEditarPago={iniciarEdicionPago} />
      {mensaje && (
        <div className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'}`} role="alert">
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default Pagos;
