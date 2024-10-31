import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components-css/DetalleFacturacion.css';

// Componente para crear o editar un detalle de facturación
const CrearDetalle = ({ onDetalleCreado, detalleEditado, onCancelarEdicion, onGuardarEdicion }) => {
  const [facturas, setFacturas] = useState([]);
  const [idFactura, setIdFactura] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precioUnitario, setPrecioUnitario] = useState('');
  const [subtotal, setSubtotal] = useState('');
  const [totalItem, setTotalItem] = useState('');
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

    if (detalleEditado) {
      setIdFactura(detalleEditado.ID_FACTURA || '');
      setDescripcion(detalleEditado.DESCRIPCION || '');
      setCantidad(detalleEditado.CANTIDAD || '');
      setPrecioUnitario(detalleEditado.PRECIO_UNITARIO || '');
      setSubtotal(detalleEditado.SUBTOTAL || '');
      setTotalItem(detalleEditado.TOTAL_ITEM || '');
    } else {
      setIdFactura('');
      setDescripcion('');
      setCantidad('');
      setPrecioUnitario('');
      setSubtotal('');
      setTotalItem('');
    }
  }, [detalleEditado]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevoDetalle = {
      ID_FACTURA: parseInt(idFactura, 10) || null,
      DESCRIPCION: descripcion,
      CANTIDAD: parseInt(cantidad, 10) || 0,
      PRECIO_UNITARIO: parseFloat(precioUnitario) || 0,
      SUBTOTAL: parseFloat(subtotal) || 0,
      TOTAL_ITEM: parseFloat(totalItem) || 0
    };

    if (detalleEditado) {
      onGuardarEdicion({ ...detalleEditado, ...nuevoDetalle });
    } else {
      try {
        const response = await fetch('https://apistart.onrender.com/api/detalleFacturacion/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoDetalle),
        });
        const data = await response.json();
        if (response.ok) {
          setMensaje('Detalle de facturación creado con éxito');
          setError(false);
          setIdFactura('');
          setDescripcion('');
          setCantidad('');
          setPrecioUnitario('');
          setSubtotal('');
          setTotalItem('');
          onDetalleCreado(data.detalle);
        } else {
          setMensaje(`Error: ${data.message || 'Ocurrió un error inesperado'}`);
          setError(true);
        }
      } catch (error) {
        setMensaje('Error al crear el detalle de facturación');
        setError(true);
      }
    }
  };

  return (
    <div className="container my-4">
      <h2>{detalleEditado ? 'Editar Detalle de Facturación' : 'Crear Nuevo Detalle de Facturación'}</h2>
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
          <label className="form-label">Descripción:</label>
          <input
            type="text"
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            maxLength="100"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Cantidad:</label>
          <input
            type="number"
            className="form-control"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Precio Unitario:</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={precioUnitario}
            onChange={(e) => setPrecioUnitario(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Subtotal:</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={subtotal}
            onChange={(e) => setSubtotal(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Total Item:</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={totalItem}
            onChange={(e) => setTotalItem(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">{detalleEditado ? 'Guardar Cambios' : 'Crear Detalle'}</button>
        {detalleEditado && <button type="button" className="btn btn-secondary ms-2" onClick={onCancelarEdicion}>Cancelar</button>}
      </form>
      {mensaje && <div className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'}`} role="alert">{mensaje}</div>}
    </div>
  );
};

// Componente para mostrar la lista de detalles de facturación
const MostrarDetalles = ({ detalles, onEliminarDetalle, onEditarDetalle }) => {
  return (
    <div className="container my-4">
      <h2>Lista de Detalles de Facturación</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>ID Detalle</th>
            <th>Factura</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
            <th>Total Item</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {detalles.length > 0 ? (
            detalles.map((detalle) => (
              <tr key={detalle.ID_DETALLE}>
                <td>{detalle.ID_DETALLE}</td>
                <td>{detalle.ID_FACTURA}</td>
                <td>{detalle.DESCRIPCION}</td>
                <td>{detalle.CANTIDAD}</td>
                <td>{detalle.PRECIO_UNITARIO}</td>
                <td>{detalle.SUBTOTAL}</td>
                <td>{detalle.TOTAL_ITEM}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => onEditarDetalle(detalle)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onEliminarDetalle(detalle.ID_DETALLE)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No hay detalles de facturación registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Componente principal que muestra la creación y lista de detalles de facturación
const DetalleFacturacion = () => {
  const [detalles, setDetalles] = useState([]);
  const [detalleEditado, setDetalleEditado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  const obtenerDetalles = async () => {
    try {
      const response = await fetch('https://apistart.onrender.com/api/detalleFacturacion/all');
      const data = await response.json();
      if (response.ok) {
        setDetalles(data.detalles);
        setMensaje('Detalles obtenidos con éxito');
        setError(false);
      } else {
        setMensaje('Error al obtener los detalles');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error en la comunicación con la API');
      setError(true);
    }
  };

  useEffect(() => {
    obtenerDetalles();
  }, []);

  const agregarDetalle = (nuevoDetalle) => {
    setDetalles((prevDetalles) => [...prevDetalles, nuevoDetalle]);
  };

  const eliminarDetalle = async (id) => {
    try {
      const response = await fetch(`https://apistart.onrender.com/api/detalleFacturacion/delete/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setDetalles((prevDetalles) => prevDetalles.filter((detalle) => detalle.ID_DETALLE !== id));
        setMensaje('Detalle eliminado con éxito');
        setError(false);
      } else {
        setMensaje('Error al eliminar el detalle');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error al comunicarse con la API');
      setError(true);
    }
  };

  const iniciarEdicionDetalle = (detalle) => {
    setDetalleEditado(detalle);
  };

  const cancelarEdicion = () => {
    setDetalleEditado(null);
  };

  const guardarEdicionDetalle = async (detalleActualizado) => {
    try {
      const response = await fetch(`https://apistart.onrender.com/api/detalleFacturacion/update/${detalleActualizado.ID_DETALLE}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(detalleActualizado),
      });
      if (response.ok) {
        const detallesActualizados = detalles.map((detalle) =>
          detalle.ID_DETALLE === detalleActualizado.ID_DETALLE ? detalleActualizado : detalle
        );
        setDetalles(detallesActualizados);
        setDetalleEditado(null);
        setMensaje('Detalle editado con éxito');
        setError(false);
      } else {
        setMensaje('Error al editar el detalle');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error al comunicarse con la API');
      setError(true);
    }
  };

  return (
    <div>
      <CrearDetalle
        onDetalleCreado={agregarDetalle}
        detalleEditado={detalleEditado}
        onCancelarEdicion={cancelarEdicion}
        onGuardarEdicion={guardarEdicionDetalle}
      />
      <MostrarDetalles detalles={detalles} onEliminarDetalle={eliminarDetalle} onEditarDetalle={iniciarEdicionDetalle} />
      {mensaje && (
        <div className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'}`} role="alert">
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default DetalleFacturacion;
