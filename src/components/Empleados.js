import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components-css/Empleados.css';

// Componente para crear o editar un empleado
const CrearEmpleado = ({ onEmpleadoCreado, empleadoEditado, onCancelarEdicion, onGuardarEdicion }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [idUsuario, setIdUsuario] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cui, setCui] = useState('');
  const [nit, setNit] = useState('');
  const [rolAdministrativo, setRolAdministrativo] = useState('');
  const [fechaContrato, setFechaContrato] = useState('');
  const [estado, setEstado] = useState('');
  const [turno, setTurno] = useState('');
  const [salario, setSalario] = useState('');
  const [genero, setGenero] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [fechaDespido, setFechaDespido] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
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

    if (empleadoEditado) {
      setIdUsuario(empleadoEditado.ID_USUARIO || '');
      setNombre(empleadoEditado.NOMBRE || '');
      setApellido(empleadoEditado.APELLIDO || '');
      setCorreo(empleadoEditado.CORREO || '');
      setTelefono(empleadoEditado.TELEFONO || '');
      setCui(empleadoEditado.CUI || '');
      setNit(empleadoEditado.NIT || '');
      setRolAdministrativo(empleadoEditado.ROL_ADMINISTRATIVO || '');
      setFechaContrato(empleadoEditado.FECHA_CONTRATO || '');
      setEstado(empleadoEditado.ESTADO || '');
      setTurno(empleadoEditado.TURNO || '');
      setSalario(empleadoEditado.SALARIO || '');
      setGenero(empleadoEditado.GENERO || '');
      setDepartamento(empleadoEditado.DEPARTAMENTO || '');
      setFechaDespido(empleadoEditado.FECHA_DESPIDO || '');
    } else {
      resetForm();
    }
  }, [empleadoEditado]);

  const resetForm = () => {
    setIdUsuario('');
    setNombre('');
    setApellido('');
    setCorreo('');
    setTelefono('');
    setCui('');
    setNit('');
    setRolAdministrativo('');
    setFechaContrato('');
    setEstado('');
    setTurno('');
    setSalario('');
    setGenero('');
    setDepartamento('');
    setFechaDespido('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevoEmpleado = {
      ID_USUARIO: parseInt(idUsuario, 10) || null,
      CUI: cui,
      NIT: nit,
      NOMBRE: nombre,
      APELLIDO: apellido,
      CORREO: correo,
      TELEFONO: telefono,
      ROL_ADMINISTRATIVO: rolAdministrativo,
      FECHA_CONTRATO: fechaContrato || null,
      ESTADO: estado,
      TURNO: turno,
      SALARIO: parseFloat(salario) || null,
      GENERO: genero,
      DEPARTAMENTO: departamento,
      FECHA_DESPIDO: fechaDespido || null,
    };

    if (empleadoEditado) {
      onGuardarEdicion({ ...empleadoEditado, ...nuevoEmpleado });
    } else {
      try {
        const response = await fetch('https://apistart.onrender.com/api/empleados/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoEmpleado),
        });

        const data = await response.json();

        if (response.ok) {
          setMensaje('Empleado creado con éxito');
          setError(false);
          onEmpleadoCreado(data.empleado);
          resetForm();
        } else {
          setMensaje(`Error: ${data.message || 'Ocurrió un error inesperado'}`);
          setError(true);
        }
      } catch (error) {
        setMensaje('Error al crear el empleado');
        setError(true);
      }
    }
  };

  return (
    <div className="container my-4">
      <h2>{empleadoEditado ? 'Editar Empleado' : 'Crear Nuevo Empleado'}</h2>
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
          <label className="form-label">NIT:</label>
          <input type="text" className="form-control" value={nit} onChange={(e) => setNit(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Rol Administrativo:</label>
          <select className="form-control" value={rolAdministrativo} onChange={(e) => setRolAdministrativo(e.target.value)} required>
            <option value="">Selecciona un rol</option>
            <option value="Recepcionista">Recepcionista</option>
            <option value="Gerente">Gerente</option>
            <option value="Limpieza">Limpieza</option>
            <option value="Mantenimiento">Mantenimiento</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha de Contrato:</label>
          <input type="date" className="form-control" value={fechaContrato} onChange={(e) => setFechaContrato(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Estado:</label>
          <select className="form-control" value={estado} onChange={(e) => setEstado(e.target.value)} required>
            <option value="">Selecciona un estado</option>
            <option value="Activo">Activo</option>
            <option value="No Activo">No Activo</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Turno:</label>
          <input type="text" className="form-control" value={turno} onChange={(e) => setTurno(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Salario:</label>
          <input type="number" className="form-control" value={salario} onChange={(e) => setSalario(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Género:</label>
          <select className="form-control" value={genero} onChange={(e) => setGenero(e.target.value)} required>
            <option value="">Selecciona un género</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Departamento:</label>
          <input type="text" className="form-control" value={departamento} onChange={(e) => setDepartamento(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha de Despido:</label>
          <input type="date" className="form-control" value={fechaDespido} onChange={(e) => setFechaDespido(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">{empleadoEditado ? 'Guardar Cambios' : 'Crear Empleado'}</button>
        {empleadoEditado && (
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

// Componente para mostrar la lista de empleados
const MostrarEmpleados = ({ empleados, onEliminarEmpleado, onEditarEmpleado }) => {
  return (
    <div className="container my-4">
      <h2>Lista de Empleados</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>ID Empleado</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Rol Administrativo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.length > 0 ? (
            empleados.map((empleado) => (
              <tr key={empleado.ID_EMPLEADO}>
                <td>{empleado.ID_EMPLEADO}</td>
                <td>{empleado.NOMBRE}</td>
                <td>{empleado.APELLIDO}</td>
                <td>{empleado.CORREO}</td>
                <td>{empleado.ROL_ADMINISTRATIVO}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => onEditarEmpleado(empleado)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onEliminarEmpleado(empleado.ID_EMPLEADO)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No hay empleados registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Componente principal que muestra la creación y lista de empleados
const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [empleadoEditado, setEmpleadoEditado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  const obtenerEmpleados = async () => {
    try {
      const response = await fetch('https://apistart.onrender.com/api/empleados/all');
      const data = await response.json();
      if (response.ok) {
        setEmpleados(data.empleados);
        setMensaje('Empleados obtenidos con éxito');
        setError(false);
      } else {
        setMensaje('Error al obtener los empleados');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error en la comunicación con la API');
      setError(true);
    }
  };

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  const agregarEmpleado = (nuevoEmpleado) => {
    setEmpleados((prevEmpleados) => [...prevEmpleados, nuevoEmpleado]);
  };

  const eliminarEmpleado = async (id) => {
    try {
      const response = await fetch(`https://apistart.onrender.com/api/empleados/delete/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setEmpleados((prevEmpleados) => prevEmpleados.filter((empleado) => empleado.ID_EMPLEADO !== id));
        setMensaje('Empleado eliminado con éxito');
        setError(false);
      } else {
        setMensaje('Error al eliminar el empleado');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error al comunicarse con la API');
      setError(true);
    }
  };

  const iniciarEdicionEmpleado = (empleado) => {
    setEmpleadoEditado(empleado);
  };

  const cancelarEdicion = () => {
    setEmpleadoEditado(null);
  };

  const guardarEdicionEmpleado = async (empleadoActualizado) => {
    try {
      const response = await fetch(`https://apistart.onrender.com/api/empleados/update/${empleadoActualizado.ID_EMPLEADO}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empleadoActualizado),
      });
      if (response.ok) {
        const empleadosActualizados = empleados.map((empleado) =>
          empleado.ID_EMPLEADO === empleadoActualizado.ID_EMPLEADO ? empleadoActualizado : empleado
        );
        setEmpleados(empleadosActualizados);
        setEmpleadoEditado(null);
        setMensaje('Empleado editado con éxito');
        setError(false);
      } else {
        setMensaje('Error al editar el empleado');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error al comunicarse con la API');
      setError(true);
    }
  };

  return (
    <div>
      <CrearEmpleado
        onEmpleadoCreado={agregarEmpleado}
        empleadoEditado={empleadoEditado}
        onCancelarEdicion={cancelarEdicion}
        onGuardarEdicion={guardarEdicionEmpleado}
      />
      <MostrarEmpleados empleados={empleados} onEliminarEmpleado={eliminarEmpleado} onEditarEmpleado={iniciarEdicionEmpleado} />
      {mensaje && (
        <div className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'}`} role="alert">
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default Empleados;
