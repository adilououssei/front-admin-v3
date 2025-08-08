import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';

const UserForm = ({ show, onHide, user, onSave }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    role: 'patient',
    specialty: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        role: user.role || 'patient',
        specialty: user.specialty || '',
        status: user.status || 'active'
      });
    } else {
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        role: 'patient',
        specialty: '',
        status: 'active'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = 'Nom requis';
    if (!formData.prenom) newErrors.prenom = 'Prénom requis';
    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (formData.role === 'doctor' && !formData.specialty) {
      newErrors.specialty = 'Spécialité requise';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        id: user?.id
      });
    }
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
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  isInvalid={!!errors.prenom}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.prenom}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  isInvalid={!!errors.nom}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.nom}
                </Form.Control.Feedback>
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
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
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
            </Col>
            <Col md={6}>
              {formData.role === 'doctor' && (
                <Form.Group className="mb-3">
                  <Form.Label>Spécialité</Form.Label>
                  <Form.Control
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    isInvalid={!!errors.specialty}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.specialty}
                  </Form.Control.Feedback>
                </Form.Group>
              )}
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Statut</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                label="Actif"
                name="status"
                value="active"
                checked={formData.status === 'active'}
                onChange={handleChange}
              />
              <Form.Check
                inline
                type="radio"
                label="Inactif"
                name="status"
                value="inactive"
                checked={formData.status === 'inactive'}
                onChange={handleChange}
              />
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Annuler
          </Button>
          <Button variant="primary" type="submit">
            Enregistrer
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UserForm;