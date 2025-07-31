// src/pages/admin/GestionHopitaux.js
import React, { useState } from 'react';
import { Container, Table, Button, Form, Modal } from 'react-bootstrap';

const GestionHopitaux = () => {
  const [hospitals, setHospitals] = useState([
    { id: 1, name: 'Hôpital Central', address: 'Av. principale, Lomé', phone: '22 21 21 21' },
    { id: 2, name: 'Clinique Saint-Louis', address: 'Rue des Cocotiers', phone: '22 22 22 22' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newHospital, setNewHospital] = useState({ name: '', address: '', phone: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHospital({ ...newHospital, [name]: value });
  };

  const handleAddHospital = () => {
    setHospitals([...hospitals, { ...newHospital, id: hospitals.length + 1 }]);
    setNewHospital({ name: '', address: '', phone: '' });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setHospitals(hospitals.filter(hospital => hospital.id !== id));
  };

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des hôpitaux</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Ajouter un hôpital
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Adresse</th>
            <th>Téléphone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hospitals.map((hospital) => (
            <tr key={hospital.id}>
              <td>{hospital.id}</td>
              <td>{hospital.name}</td>
              <td>{hospital.address}</td>
              <td>{hospital.phone}</td>
              <td>
                <Button variant="info" size="sm" className="me-2">Modifier</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(hospital.id)}>Supprimer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un nouvel hôpital</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newHospital.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Adresse</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={newHospital.address}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={newHospital.phone}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleAddHospital}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GestionHopitaux;