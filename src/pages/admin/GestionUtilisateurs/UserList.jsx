// src/components/admin/users/UserList.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Form, InputGroup, Pagination, Spinner, Alert } from 'react-bootstrap';
import { FiEdit, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import UserForm from './UserForm';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../../api/usersApi';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch {
        setAlert({ variant: 'danger', message: 'Erreur lors du chargement des utilisateurs' });
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleSave = async (userData) => {
    try {
      if (userData.id) {
        await updateUser(userData.id, userData);
        setUsers(users.map(u => u.id === userData.id ? userData : u));
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
    if (window.confirm('Confirmer la suppression de cet utilisateur ?')) {
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

  // Filtrer les utilisateurs selon recherche
  const filteredUsers = users.filter(user =>
    `${user.docteur?.prenom || user.patient?.prenom || ''} ${user.docteur?.nom || user.patient?.nom || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between mb-4 align-items-center">
        <h2>Gestion des Utilisateurs</h2>
        <Button variant="primary" onClick={handleAddUser}>
          <FiPlus className="me-2" />
          Ajouter un utilisateur
        </Button>
      </div>

      {alert && (
        <Alert variant={alert.variant} onClose={() => setAlert(null)} dismissible>
          {alert.message}
        </Alert>
      )}

      <div className="mb-4" style={{ maxWidth: '400px' }}>
        <InputGroup>
          <Form.Control
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <InputGroup.Text>
            <FiSearch />
          </InputGroup.Text>
        </InputGroup>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Dernière connexion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">Aucun utilisateur trouvé</td>
                </tr>
              )}
              {currentUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.docteur ? `${user.docteur.prenom} ${user.docteur.nom}` :
                    user.patient ? `${user.patient.prenom} ${user.patient.nom}` : '-'}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={
                      user.roles?.includes('ROLE_ADMIN') ? 'danger' :
                        user.docteur ? 'info' :
                          'secondary'
                    }>
                      {user.roles?.includes('ROLE_ADMIN') ? 'Administrateur' :
                        user.docteur ? 'Médecin' : 'Patient'}
                    </Badge>

                    {user.docteur?.specialites && user.docteur.specialites.length > 0 &&
                      ` (${user.docteur.specialites.map(s => s.nom).join(', ')})`
                    }
                  </td>
                  <td>
                    <Badge bg={user.status === 'active' ? 'success' : 'warning'}>
                      {user.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </td>
                  <td>{user.lastLogin || '-'}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(user)}
                    >
                      <FiEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      <FiTrash2 />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {filteredUsers.length > usersPerPage && (
            <Pagination>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <Pagination.Item
                  key={idx + 1}
                  active={idx + 1 === currentPage}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </>
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
