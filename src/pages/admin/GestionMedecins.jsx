// src/pages/admin/GestionMedecins.jsx
import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Form, Modal, Row, Col } from 'react-bootstrap';
import { FiTrash2, FiEdit } from 'react-icons/fi';
import { getDocteurs, createDocteur, updateDocteur, deleteDocteur } from '../../api/doctorsApi';
import { fetchSpecialites } from '../../api/specialitesApi';

const GestionMedecins = () => {
  const [docteurs, setDocteurs] = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editDocteurId, setEditDocteurId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [newDocteur, setNewDocteur] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
    specialiteId: ''
  });

  // Charger docteurs à chaque changement de page
  useEffect(() => {
    loadDocteurs(page);
  }, [page]);

  // Charger spécialités une seule fois
  useEffect(() => {
    loadSpecialites();
  }, []);

  const loadDocteurs = async (pageNumber = 1) => {
    try {
      const data = await getDocteurs(pageNumber);
      console.log('Docteurs API:', data.data); // Pour vérifier la structure
      setDocteurs(data.data || []);
      setPage(data.page || pageNumber);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Erreur chargement des docteurs:', error);
    }
  };

  const loadSpecialites = async () => {
    try {
      const response = await fetchSpecialites();
      setSpecialites(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erreur chargement des spécialités:', error);
      setSpecialites([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDocteur({ ...newDocteur, [name]: value });
  };

  const handleAddOrEditDocteur = async () => {
    try {
      if (isEditing) {
        await updateDocteur(editDocteurId, newDocteur);
      } else {
        await createDocteur(newDocteur);
      }
      loadDocteurs(page);
      setShowModal(false);
      setIsEditing(false);
      setEditDocteurId(null);
      setNewDocteur({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        telephone: '',
        specialiteId: ''
      });
    } catch (error) {
      console.error('Erreur sauvegarde docteur:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDocteur(id);
      loadDocteurs(page);
    } catch (error) {
      console.error('Erreur suppression docteur:', error);
    }
  };

  const handleEdit = (docteur) => {
    setIsEditing(true);
    setEditDocteurId(docteur.id);
    setNewDocteur({
      nom: docteur.nom || '',
      prenom: docteur.prenom || '',
      email: docteur.user?.email || '',
      password: '',
      telephone: docteur.telephone || '',
      specialiteId: docteur.specialites && docteur.specialites.length > 0 ? docteur.specialites[0].id : ''
    });
    setShowModal(true);
  };

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des médecins</h2>
        <Button variant="primary" onClick={() => { setIsEditing(false); setShowModal(true); }}>
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
          {docteurs.length > 0 ? (
            docteurs.map((doc, index) => (
              <tr key={doc.id ?? index}>
                <td>{doc.id}</td>
                <td>{doc.prenom}</td>
                <td>{doc.nom}</td>
                <td>
                  {doc.specialites && doc.specialites.length > 0
                    ? doc.specialites.map(s => s.nom).join(', ')
                    : '—'}
                </td>
                <td>{doc.user?.email || '—'}</td>
                <td className="d-flex gap-2">
                  <Button variant="warning" size="sm" onClick={() => handleEdit(doc)}>
                    <FiEdit />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(doc.id)}>
                    <FiTrash2 />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">Aucun médecin trouvé</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center my-3">
        <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>Précédent</Button>
        <span>Page {page} / {totalPages}</span>
        <Button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Suivant</Button>
      </div>

      {/* Modal ajout/modif docteur */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Modifier médecin' : 'Ajouter un nouveau médecin'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control type="text" name="nom" value={newDocteur.nom} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Prénom</Form.Label>
                  <Form.Control type="text" name="prenom" value={newDocteur.prenom} onChange={handleInputChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={newDocteur.email} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={newDocteur.password}
                    onChange={handleInputChange}
                    placeholder={isEditing ? 'Laisser vide pour ne pas changer' : ''}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control type="text" name="telephone" value={newDocteur.telephone} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Spécialité</Form.Label>
              <Form.Select name="specialiteId" value={newDocteur.specialiteId} onChange={handleInputChange}>
                <option value="">Sélectionner une spécialité</option>
                {specialites.map((spec) => (
                  <option key={spec.id} value={spec.id}>{spec.nom}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
          <Button variant="primary" onClick={handleAddOrEditDocteur}>
            {isEditing ? 'Mettre à jour' : 'Enregistrer'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GestionMedecins;
