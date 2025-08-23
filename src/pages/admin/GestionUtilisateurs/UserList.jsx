import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Spinner, Alert, Pagination } from 'react-bootstrap';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import UserForm from './UserForm';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../../api/usersApi';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch {
        setAlert({ variant: 'danger', message: 'Erreur lors du chargement des utilisateurs' });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSave = async (userData) => {
    try {
      if (userData.id) {
        await updateUser(userData.id, userData);
        setUsers(users.map(u => u.id === userData.id ? { ...u, ...userData } : u));
        setAlert({ variant: 'success', message: 'Utilisateur mis à jour' });
      } else {
        const newUser = await createUser(userData);
        setUsers([...users, { ...userData, id: newUser.id }]);
        setAlert({ variant: 'success', message: 'Utilisateur ajouté' });
      }
      setShowModal(false);
    } catch {
      setAlert({ variant: 'danger', message: 'Erreur lors de la sauvegarde' });
    }
    setTimeout(() => setAlert(null), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirmer la suppression ?')) {
      try {
        await deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
        setAlert({ variant: 'info', message: 'Utilisateur supprimé' });
      } catch {
        setAlert({ variant: 'danger', message: 'Erreur lors de la suppression' });
      }
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  // Pagination helpers
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between mb-4 align-items-center">
        <h2>Gestion des utilisateurs</h2>
        <Button variant="primary" onClick={handleAddUser}>
          <FiPlus className="me-2" /> Ajouter
        </Button>
      </div>

      {alert && <Alert variant={alert.variant}>{alert.message}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Téléphone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length === 0 && <tr><td colSpan="5" className="text-center">Aucun utilisateur</td></tr>}
          {currentUsers.map(user => (
            <tr key={user.id}>
              <td>{user.prenom} {user.nom}</td>
              <td>{user.email}</td>
              <td>
                <Badge bg={
                  user.roles?.includes('ROLE_ADMIN') ? 'danger' :
                  user.roles?.includes('ROLE_DOCTEUR') ? 'info' :
                  'secondary'
                }>
                  {user.roles?.includes('ROLE_ADMIN') ? 'Administrateur' :
                   user.roles?.includes('ROLE_DOCTEUR') ? 'Médecin' :
                   'Patient'}
                </Badge>
              </td>
              <td>{user.telephone || '-'}</td>
              <td>
                <Button variant="outline-primary" size="sm" onClick={() => handleEdit(user)} className="me-2">
                  <FiEdit />
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(user.id)}>
                  <FiTrash2 />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          {[...Array(totalPages)].map((_, idx) => (
            <Pagination.Item
              key={idx + 1}
              active={currentPage === idx + 1}
              onClick={() => handlePageChange(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

      <UserForm
        show={showModal}
        onHide={() => setShowModal(false)}
        user={selectedUser}
        onSave={handleSave}
      />
    </div>
  );
};

export default UserList;
