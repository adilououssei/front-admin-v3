// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ role, collapsed, onLogout }) => {
  const menuAdmin = [
    { label: 'Dashboard', icon: 'fa fa-home', path: '/' },
    { label: 'Hôpitaux', icon: 'fa fa-hospital', path: '/gestion-hopitaux' },
    { label: 'Médecins', icon: 'fa fa-user-md', path: '/gestion-medecins' },
    { label: 'Utilisateurs', icon: 'fa fa-users', path: '/utilisateurs' },
    { label: 'Spécialités', icon: 'fa fa-stethoscope', path: '/gestion-specialites' },
  ];

  const menuDoctor = [
    { label: 'Dashboard', icon: 'fa fa-home', path: '/' },
    {
      label: 'Rendez-vous',
      icon: 'fa fa-calendar-check',
      path: '/mes-rendezVous',
    },
    {
      label: 'Consultations',
      icon: 'fa fa-stethoscope',
      path: '/consultations-en-ligne',
    },
    {
      label: 'Disponibilités',
      icon: 'fa fa-calendar',
      path: '/gestion-disponibilites',
    }
  ];

  const menu = role === 'admin' ? menuAdmin : menuDoctor;

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <ul>
        {menu.map((item, index) => (
          <li key={index}>
            <Link to={item.path} className="d-flex align-items-center">
              <i className={`${item.icon} fs-5`} style={{ fontSize: '1.2rem' }}></i>
              {!collapsed && <span className="ms-2">{item.label}</span>}
            </Link>
          </li>
        ))}
        <li>
          <button onClick={onLogout} className="btn btn-link text-danger mt-4">
            {collapsed ? (
              <i className="fa fa-power-off fa-2x"></i>
            ) : (
              <>
                <i className="fa fa-power-off me-2"></i> Déconnexion
              </>
            )}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
