import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';

const UserForm = ({ show, onHide, user, onSave }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    role: 'patient',
    specialties: [],
    telephone: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.docteur?.prenom || user.patient?.prenom || '',
        prenom: user.docteur?.nom || user.patient?.nom || '',
        email: user.email || '',
        role: user.roles?.includes('ROLE_DOCTOR') ? 'doctor' :
              user.roles?.includes('ROLE_PATIENT') ? 'patient' : 'admin',
        specialties: user.docteur?.specialites?.map(s => s.id) || [],
        telephone: user.docteur?.telephone || user.patient?.telephone || '',
      });
    } else {
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        role: 'patient',
        specialties: [],
        telephone: '',
      });
    }
  }, [user]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave({ ...formData, id: user?.id });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{user ? 'Modifier' : 'Ajouter'} un utilisateur</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Prénom</Form.Label>
                <Form.Control
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rôle</Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Médecin</option>
              <option value="admin">Administrateur</option>
            </Form.Select>
          </Form.Group>

          {formData.role === 'doctor' && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Téléphone</Form.Label>
                <Form.Control
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Spécialités</Form.Label>
                <Form.Control
                  name="specialties"
                  value={formData.specialties}
                  onChange={handleChange}
                  placeholder="IDs des spécialités séparés par des virgules"
                />
              </Form.Group>
            </>
          )}

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Annuler</Button>
          <Button variant="primary" type="submit">Enregistrer</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UserForm;
