import React from 'react';
import { Card, Badge, Button, ListGroup } from 'react-bootstrap';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

const UserDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = state?.user || {
    id: 1,
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@example.com',
    role: 'patient',
    status: 'active',
    lastLogin: '2023-11-15'
  };

  return (
    <div className="p-4">
      <Button 
        variant="outline-secondary" 
        className="mb-3"
        onClick={() => navigate(-1)}
      >
        <FiArrowLeft className="me-2" />
        Retour
      </Button>

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Détails de l'utilisateur</h4>
          <Badge bg={user.status === 'active' ? 'success' : 'warning'}>
            {user.status === 'active' ? 'Actif' : 'Inactif'}
          </Badge>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Nom complet:</strong> {user.prenom} {user.nom}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Email:</strong> {user.email}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Rôle:</strong> 
                  <Badge bg={
                    user.role === 'admin' ? 'danger' :
                    user.role === 'doctor' ? 'info' : 'secondary'
                  } className="ms-2">
                    {user.role === 'admin' ? 'Administrateur' :
                     user.role === 'doctor' ? 'Médecin' : 'Patient'}
                  </Badge>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={6}>
              <ListGroup variant="flush">
                {user.role === 'doctor' && (
                  <ListGroup.Item>
                    <strong>Spécialité:</strong> {user.specialty}
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <strong>Dernière connexion:</strong> {user.lastLogin}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Date de création:</strong> {user.createdAt || '2023-01-01'}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-end">
          <Button 
            variant="primary"
            onClick={() => navigate('/admin/utilisateurs/edit', { state: { user } })}
          >
            Modifier
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default UserDetails;