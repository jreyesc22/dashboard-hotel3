import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as FaIcons from 'react-icons/fa';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
    
  {
    title: 'Home',
    path: '/home',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text',
    roles: ['admin', 'recepcionista', 'cliente'] // Visible para todos
  },
  {
    title: 'Usuarios',
    path: '/usuarios',
    icon: <IoIcons.IoMdPerson />,
    cName: 'nav-text',
    roles: ['admin'] // Solo visible para admin
  },
  {
    title: 'Clientes',
    path: '/clientes',
    icon: <FaIcons.FaUserFriends />,
    cName: 'nav-text',
    roles: ['admin', 'recepcionista']
  },
  {
    title: 'Reservaciones',
    path: '/reservaciones',
    icon: <FaIcons.FaCalendarAlt />,
    cName: 'nav-text',
    roles: ['admin', 'recepcionista']
  },
  {
    title: 'Habitaciones',
    path: '/habitaciones',
    icon: <IoIcons.IoMdBed />,
    cName: 'nav-text',
    roles: ['admin', 'recepcionista']
  },
  {
    title: 'Servicios',
    path: '/servicios',
    icon: <FaIcons.FaConciergeBell />,
    cName: 'nav-text',
    roles: ['admin', 'recepcionista']
  },
  {
    title: 'Facturación',
    path: '/facturacion',
    icon: <FaIcons.FaFileInvoiceDollar />,
    cName: 'nav-text',
    roles: ['admin']
  },
  {
    title: 'Pagos',
    path: '/pagos',
    icon: <IoIcons.IoMdCash />,
    cName: 'nav-text',
    roles: ['admin', 'cliente']
  },
  {
    title: 'Pedidos',
    path: '/pedidos',
    icon: <FaIcons.FaClipboardList />,
    cName: 'nav-text',
    roles: ['admin', 'recepcionista']
  },
  {
    title: 'Restaurante',
    path: '/restaurante',
    icon: <FaIcons.FaUtensils />,
    cName: 'nav-text',
    roles: ['admin', 'recepcionista']
  },
  {
    title: 'Reportes',
    path: '/reportes',
    icon: <FaIcons.FaChartLine />,
    cName: 'nav-text',
    roles: ['admin']
  },
  {
    title: 'Empleados',
    path: '/empleados',
    icon: <FaIcons.FaUserTie />, // Puedes cambiar el icono según prefieras
    cName: 'nav-text',
    roles: ['admin', 'recepcionista'] // Solo visible para admin y recepcionista
  },
  {
    title: 'Cerrar Sesión',
    path: '#',
    icon: <AiIcons.AiOutlineLogout />,
    cName: 'nav-text',
    action: 'logout',
    roles: ['admin', 'recepcionista', 'cliente'] // Visible para todos
  }
];
