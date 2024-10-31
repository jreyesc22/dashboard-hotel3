import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
import Table from 'react-bootstrap/Table';

// Registra los componentes necesarios para gráficos
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);

const Home = () => {
  const [clientesCount, setClientesCount] = useState(0);
  const [reservasActivas, setReservasActivas] = useState(0);
  const [habitacionesDisponibles, setHabitacionesDisponibles] = useState(0);
  const [empleadosCount, setEmpleadosCount] = useState(0);
  const [facturasPendientes, setFacturasPendientes] = useState(0);
  const [ingresosMensuales, setIngresosMensuales] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [reservasPorEstado, setReservasPorEstado] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesRes = await fetch('https://apistart.onrender.com/api/clientes/count');
        const reservasRes = await fetch('https://apistart.onrender.com/api/reservaciones/activas');
        const habitacionesRes = await fetch('https://apistart.onrender.com/api/habitaciones/disponibles');
        const empleadosRes = await fetch('https://apistart.onrender.com/api/empleados/count');
        const facturasRes = await fetch('https://apistart.onrender.com/api/facturacion/pendientes');
        const ingresosMensualesRes = await fetch('https://apistart.onrender.com/api/facturacion/ingreso-mensual');
        const facturasAllRes = await fetch('https://apistart.onrender.com/api/facturacion/all');
        const reservasEstadoRes = await fetch('https://apistart.onrender.com/api/reservaciones/estado');

        setClientesCount((await clientesRes.json()).count || 0);
        setReservasActivas((await reservasRes.json()).count || 0);
        setHabitacionesDisponibles((await habitacionesRes.json()).count || 0);
        setEmpleadosCount((await empleadosRes.json()).count || 0);
        setFacturasPendientes((await facturasRes.json()).count || 0);

        const ingresosMensualesData = await ingresosMensualesRes.json();
        setIngresosMensuales(ingresosMensualesData);

        const facturasData = await facturasAllRes.json();
        setFacturas(facturasData.facturas);

        const reservasEstadoData = await reservasEstadoRes.json();
        setReservasPorEstado(reservasEstadoData);

      } catch (error) {
        console.error("Error fetching data", error);
        setMensaje("Error al obtener datos");
        setError(true);
      }
    };

    fetchData();
  }, []);

  // Configuración de los gráficos
  const ingresosMensualesLabels = ingresosMensuales.map(item => new Date(item.mes).toLocaleString('default', { month: 'long', year: 'numeric' }));
  const ingresosMensualesData = ingresosMensuales.map(item => item.total_ingresos);

  const lineData = {
    labels: ingresosMensualesLabels,
    datasets: [
      {
        label: 'Ingresos Mensuales',
        data: ingresosMensualesData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderDash: [5, 5],
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
        pointRadius: 6,
        pointHoverRadius: 10,
      }
    ]
  };

  const doughnutData = {
    labels: ['Facturas Pendientes', 'Facturas Pagadas'],
    datasets: [
      {
        data: [facturasPendientes, clientesCount - facturasPendientes],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
        hoverBackgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
      }
    ]
  };

  const reservasEstadoLabels = reservasPorEstado.map(estado => estado.ESTADO_CANCELACION);
  const reservasEstadoData = reservasPorEstado.map(estado => estado.cantidad);

  const barData = {
    labels: reservasEstadoLabels,
    datasets: [
      {
        label: 'Reservaciones por Estado',
        data: reservasEstadoData,
        backgroundColor: ['#4BC0C0', '#FF9F40', '#FF6384'],
      }
    ]
  };

  return (
    <div className="container my-4">
      <h2 className="text-center">Dashboard - Resumen General</h2>

      <div className="row mt-3">
        {[{
          title: 'Clientes Registrados',
          value: clientesCount,
        }, {
          title: 'Reservas Activas',
          value: reservasActivas,
        }, {
          title: 'Habitaciones Disponibles',
          value: habitacionesDisponibles,
        }, {
          title: 'Empleados Activos',
          value: empleadosCount,
        }, {
          title: 'Facturas Pendientes',
          value: facturasPendientes,
          extraClass: facturasPendientes > 10 ? 'text-danger' : '',
        }].map((item, index) => (
          <div className="col-md-4 mt-3" key={index}>
            <div className="card text-center shadow-sm border-0 rounded">
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className={`card-text ${item.extraClass || ''}`}>{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficas */}
      <div className="row mt-5">
        <div className="col-md-6 mb-4">
          <h4 className="text-center">Ingresos Mensuales</h4>
          <Line data={lineData} options={{ responsive: true }} />
        </div>
        <div className="col-md-6 mb-4">
          <h4 className="text-center">Distribución de Facturas</h4>
          <Doughnut data={doughnutData} options={{ responsive: true }} />
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-6 mx-auto">
          <h4 className="text-center">Reservaciones por Estado</h4>
          <Bar data={barData} options={{ responsive: true }} />
        </div>
      </div>

      <div className="mt-5">
        <h4 className="text-center">Transacciones Recientes</h4>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Fecha de Emisión</th>
              <th>Cliente</th>
              <th>Monto Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {facturas.slice(0, 5).map((factura, index) => (
              <tr key={index}>
                <td>{new Date(factura.FECHA_EMISION).toLocaleDateString()}</td>
                <td>{factura.NOMBRE_CLIENTE || 'N/A'}</td>
                <td>{factura.TOTAL}</td>
                <td>{factura.ESTADO}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {mensaje && (
        <div className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'} text-center`} role="alert">
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default Home;
