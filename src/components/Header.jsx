// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/Api';
import { Modal, Button, Badge, Dropdown } from 'react-bootstrap';

export default function Header({ onToggleSidebar }) {
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchNotifications();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/api/me');
      setUser(response.data);
    } catch (error) {
      console.error('Erreur de chargement de l\'utilisateur:', error);
      setUser(null);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/api/mes-notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Erreur de chargement des notifications:', error);
    }
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Déterminer le rôle affiché
  const getRoleLabel = () => {
    if (!user?.roles) return '';
    if (user.roles.includes('ROLE_ADMIN')) return 'Administrateur';
    if (user.roles.includes('ROLE_DOCTEUR')) return 'Docteur';
    return '';
  };

  return (
    <header className="d-flex justify-content-between align-items-center p-3 bg-light border-bottom">
      {/* Sidebar Toggle + Logo */}
      <div className="d-flex align-items-center gap-3">
        <Button variant="light" onClick={onToggleSidebar} className="p-2">
          <i className="bi bi-list fs-0" style={{ fontSize: '2.5rem', color: "#0077B6" }}></i>
        </Button>

        <h1 className="m-0 logo d-flex align-items-center" style={{ color: "#0077B6" }}>
          <i className="bi bi-h-square me-3" style={{ fontSize: '2.5rem', color: "#0077B6" }}></i>
          MyHospital
        </h1>
      </div>

      {/* Notification + Profil */}
      <div className="d-flex align-items-center gap-3">
        {/* Notification */}
        <Button variant="light" onClick={handleShow} className="position-relative">
          <i className="bi bi-bell-fill fs-5"></i>
          {notifications.length > 0 && (
            <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
              {notifications.length}
            </Badge>
          )}
        </Button>

        {/* Profil */}
        <Dropdown align="end">
          <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center">
            <i className="bi bi-person-circle me-2 fs-5"></i>
            {user?.nom || 'Utilisateur'}
            {getRoleLabel() && (
              <Badge bg={getRoleLabel() === 'Administrateur' ? 'primary' : 'success'} className="ms-2">
                {getRoleLabel()}
              </Badge>
            )}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="/profile">Mon profil</Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>Déconnexion</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Modal Notifications */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {notifications.length === 0 ? (
            <p>Aucune notification.</p>
          ) : (
            <ul className="list-group">
              {notifications.map((notif, index) => (
                <li key={index} className="list-group-item">
                  {notif.message}
                </li>
              ))}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Fermer</Button>
        </Modal.Footer>
      </Modal>
    </header>
  );
}
