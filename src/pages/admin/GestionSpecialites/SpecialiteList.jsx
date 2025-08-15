import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import SpecialiteForm from './SpecialiteForm';
import { fetchSpecialites, createSpecialite, updateSpecialite, deleteSpecialite } from '../../../api/specialitesApi';

const SpecialiteList = () => {
  const [specialites, setSpecialites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSpecialite, setSelectedSpecialite] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [specialiteToDelete, setSpecialiteToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // items par page
  const [totalPages, setTotalPages] = useState(1);

  const showAlert = (variant, message) => {
    setAlert({ variant, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const loadData = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await fetchSpecialites(pageNum, limit);
      const withActive = response.data.map(item => ({ ...item, active: item.statut ?? false }));
      setSpecialites(withActive);
      setPage(response.page ?? 1);
      setTotalPages(response.totalPages ?? 1);
    } catch (error) {
      console.error('Erreur chargement spécialités:', error);
      showAlert('danger', 'Impossible de charger les spécialités');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (specialiteData) => {
    try {
      const payload = {
        nom: specialiteData.nom,
        description: specialiteData.description,
        statut: specialiteData.active,
      };

      let saved;
      if (specialiteData.id) {
        saved = await updateSpecialite(specialiteData.id, payload);
        setSpecialites(specialites.map(spec => spec.id === specialiteData.id ? { ...saved, active: saved.statut } : spec));
        showAlert('success', 'Spécialité modifiée avec succès');
      } else {
        saved = await createSpecialite(payload);
        setSpecialites([...specialites, { ...saved, active: saved.statut }]);
        showAlert('success', 'Spécialité ajoutée avec succès');
      }
    } catch (err) {
      console.error('Erreur sauvegarde spécialité:', err);
      showAlert('danger', 'Erreur lors de la sauvegarde');
    }
    setShowModal(false);
  };

  const handleDelete = async () => {
    try {
      await deleteSpecialite(specialiteToDelete);
      setSpecialites(specialites.filter(spec => spec.id !== specialiteToDelete));
      showAlert('info', 'Spécialité supprimée');
    } catch (err) {
      console.error('Erreur suppression spécialité:', err);
      showAlert('danger', 'Erreur lors de la suppression');
    }
    setShowDeleteModal(false);
  };

  const filteredSpecialites = specialites.filter(spec =>
    spec.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spec.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Spécialités Médicales</h2>
        <Button
          variant="primary"
          onClick={() => { setSelectedSpecialite(null); setShowModal(true); }}
          disabled={loading}
        >
          <FiPlus className="me-2" /> Ajouter
        </Button>
      </div>

      {alert && (
        <Alert variant={alert.variant} className="mb-4" onClose={() => setAlert(null)} dismissible>
          {alert.message}
        </Alert>
      )}

      <Form.Group className="mb-4">
        <Form.Control
          type="text"
          placeholder="Rechercher une spécialité..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Description</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSpecialites.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">Aucune spécialité trouvée</td>
                </tr>
              ) : (
                filteredSpecialites.map(spec => (
                  <tr key={spec.id}>
                    <td>{spec.nom}</td>
                    <td>{spec.description}</td>
                    <td><Badge bg={spec.active ? 'success' : 'secondary'}>{spec.active ? 'Active' : 'Inactive'}</Badge></td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2"
                        onClick={() => { setSelectedSpecialite(spec); setShowModal(true); }}>
                        <FiEdit />
                      </Button>
                      <Button variant="outline-danger" size="sm"
                        onClick={() => { setSpecialiteToDelete(spec.id); setShowDeleteModal(true); }}>
                        <FiTrash2 />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-3">
            <Button disabled={page <= 1} className="me-2" onClick={() => loadData(page - 1)}>Précédent</Button>
            <span className="align-self-center">Page {page} / {totalPages}</span>
            <Button disabled={page >= totalPages} className="ms-2" onClick={() => loadData(page + 1)}>Suivant</Button>
          </div>
        </>
      )}

      <SpecialiteForm
        show={showModal}
        onHide={() => setShowModal(false)}
        specialite={selectedSpecialite}
        onSave={handleSave}
      />

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>Êtes-vous sûr de vouloir supprimer cette spécialité ? Cette action est irréversible.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Annuler</Button>
          <Button variant="danger" onClick={handleDelete}>Supprimer</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SpecialiteList;                                                        