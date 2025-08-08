// src/pages/admin/GestionMedecins.jsx
import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Form, Modal } from 'react-bootstrap';
import { getDoctors, createDoctor, deleteDoctor } from '../../api/doctorsApi';

const GestionMedecins = () => {
  const [doctors, setDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ nom: '', prenom: '', specialite: '', email: '' });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const data = await getDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Erreur chargement des docteurs:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor({ ...newDoctor, [name]: value });
  };

  const handleAddDoctor = async () => {
    try {
      await createDoctor(newDoctor);
      loadDoctors(); // recharge la liste
      setShowModal(false);
      setNewDoctor({ nom: '', prenom: '', specialite: '', email: '' });
    } catch (error) {
      console.error('Erreur création docteur:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoctor(id);
      loadDoctors();
    } catch (error) {
      console.error('Erreur suppression docteur:', error);
    }
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
            <th>Prénom</th>
            <th>Nom</th>
            <th>Spécialité</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.id}</td>
              <td>{doc.prenom}</td>
              <td>{doc.nom}</td>
              <td>{Array.isArray(doc.specialite) ? doc.specialite.map(s => s.nom).join(', ') : doc.specialite}</td>
              <td>{doc.user?.email}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleDelete(doc.id)}>Supprimer</Button>
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
              <Form.Label>Nom</Form.Label>
              <Form.Control type="text" name="nom" value={newDoctor.nom} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Prénom</Form.Label>
              <Form.Control type="text" name="prenom" value={newDoctor.prenom} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Spécialité</Form.Label>
              <Form.Control type="text" name="specialite" value={newDoctor.specialite} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={newDoctor.email} onChange={handleInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
          <Button variant="primary" onClick={handleAddDoctor}>Enregistrer</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GestionMedecins;
