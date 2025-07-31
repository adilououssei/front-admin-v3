// src/pages/admin/GestionMedecins.jsx
import React, { useState } from 'react';
import { Container, Table, Button, Form, Modal } from 'react-bootstrap';

const GestionMedecins = () => {
  const [doctors, setDoctors] = useState([
    { id: 1, name: 'Dr. Koffi Mensah', specialty: 'Cardiologie', phone: '22 11 11 11', email: 'k.mensah@hospital.tg' },
    { id: 2, name: 'Dr. Ama Adjoua', specialty: 'Pédiatrie', phone: '22 22 22 22', email: 'a.adjoua@hospital.tg' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: '', specialty: '', phone: '', email: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor({ ...newDoctor, [name]: value });
  };

  const handleAddDoctor = () => {
    setDoctors([...doctors, { ...newDoctor, id: doctors.length + 1 }]);
    setNewDoctor({ name: '', specialty: '', phone: '', email: '' });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setDoctors(doctors.filter(doctor => doctor.id !== id));
  };

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des médecins</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Ajouter un médecin
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Spécialité</th>
            <th>Téléphone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.id}>
              <td>{doctor.id}</td>
              <td>{doctor.name}</td>
              <td>{doctor.specialty}</td>
              <td>{doctor.phone}</td>
              <td>{doctor.email}</td>
              <td>
                <Button variant="info" size="sm" className="me-2">Modifier</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(doctor.id)}>Supprimer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un nouveau médecin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nom complet</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newDoctor.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Spécialité</Form.Label>
              <Form.Control
                type="text"
                name="specialty"
                value={newDoctor.specialty}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={newDoctor.phone}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newDoctor.email}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleAddDoctor}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GestionMedecins;