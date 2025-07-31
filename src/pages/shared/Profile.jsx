// src/pages/shared/Profile.jsx
import React, { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import api from '../../services/Api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/me');
        setUser({
          name: response.data.nom || 'Nom inconnu',
          email: response.data.email,
          phone: response.data.telephone || '',
          role: response.data.roles.includes('ROLE_ADMIN') ? 'admin' : 'doctor',
        });
      } catch (error) {
        console.error('Erreur lors du chargement du profil', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO : envoyer les modifications à une API de mise à jour du profil (si disponible)

    setSuccessMessage('Profil mis à jour avec succès!');
    setEditMode(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
        <p>Chargement du profil...</p>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2>Mon Profil</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Card>
        <Card.Body>
          {editMode ? (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nom complet</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Téléphone</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={user.phone}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={() => setEditMode(false)}>
                  Annuler
                </Button>
                <Button variant="primary" type="submit">
                  Enregistrer
                </Button>
              </div>
            </Form>
          ) : (
            <>
              <div className="mb-3">
                <h5>{user.name}</h5>
                <p className="text-muted mb-1">
                  Rôle: {user.role === 'admin' ? 'Administrateur' : 'Docteur'}
                </p>
              </div>

              <div className="mb-3">
                <strong>Email:</strong> {user.email}
              </div>

              <div className="mb-3">
                <strong>Téléphone:</strong> {user.phone}
              </div>

              <Button variant="primary" onClick={() => setEditMode(true)}>
                Modifier le profil
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
