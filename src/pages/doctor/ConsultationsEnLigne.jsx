import React, { useState, useEffect } from 'react';
import { Container, Card, ListGroup, Button, Form, Modal, Badge, Alert, Spinner } from 'react-bootstrap';

const translateStatusForDisplay = (statut) => {
  switch (statut) {
    case 'confirmé': return 'confirmé';
    case 'annulé': return 'annulé';
    case 'en_attente':
    case 'en attente': return 'en attente';
    case 'terminé': return 'terminé';
    default: return statut;
  }
};

const ConsultationsEnLigne = () => {
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [prescription, setPrescription] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/consultations/online', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur de chargement');
        }

        const data = await response.json();
        console.log("Données reçues:", data); // Debug

        if (!Array.isArray(data)) throw new Error('Format de données invalide');

        const formattedData = data.map(c => {
          const patient = c.patient ? `${c.patient.prenom} ${c.patient.nom}` : 'Patient inconnu';
          const dateStr = c.rendezVous?.dateConsultationAt;
          const timeStr = c.rendezVous?.heureConsultation;

          const date = dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A';
          const time = timeStr ? new Date(`1970-01-01T${timeStr}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';

          return {
            id: c.id,
            patient,
            date,
            time,
            symptoms: c.symptoms || 'Non spécifié',
            statut: c.statut || c.rendezVous?.statut || 'inconnu',
            prescription: c.prescription || '',
            rendezVousId: c.rendezVous?.id
          };
        });

        setConsultations(formattedData);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  const handleStartConsultation = (consultation) => {
    setSelectedConsultation(consultation);
    setPrescription(consultation.prescription || '');
    setShowModal(true);
  };

  const handleCompleteConsultation = async () => {
    const token = localStorage.getItem('token');
    if (!token || !selectedConsultation) return;

    try {
      const res = await fetch(`http://localhost:8000/api/consultations/${selectedConsultation.id}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ prescription }),
      });

      if (!res.ok) throw new Error('Erreur lors de la mise à jour');

      setConsultations(prev =>
        prev.map(c => c.id === selectedConsultation.id
          ? { ...c, statut: 'terminé', prescription }
          : c
        )
      );

      setShowModal(false);
      setSelectedConsultation(null);
      setPrescription('');
    } catch (err) {
      console.error('Erreur mise à jour consultation:', err);
      alert("Erreur lors de la mise à jour. Veuillez réessayer.");
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement des consultations...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid>
      <h2 className="my-4">Consultations en ligne</h2>

      <Card>
        <Card.Header>Liste des consultations en ligne</Card.Header>
        <ListGroup variant="flush">
          {consultations.length === 0 && (
            <ListGroup.Item>
              <em>Aucune consultation en ligne disponible.</em>
            </ListGroup.Item>
          )}
          {consultations.map(consultation => (
            <ListGroup.Item key={consultation.id}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">{consultation.patient}</h5>
                  <p className="mb-1">Date: {consultation.dateConsul} à {consultation.heureConsul}</p>
                  <p className="mb-1">Symptômes: {consultation.symptoms}</p>
                  <Badge bg={
                    consultation.statut === 'en_attente' ? 'warning' :
                    consultation.statut === 'terminé' ? 'success' :
                    consultation.statut === 'confirmé' ? 'primary' :
                    'info'
                  }>
                    {translateStatusForDisplay(consultation.statut)}
                  </Badge>
                </div>
                {consultation.statut === 'confirmé' && (
                  <Button variant="primary" onClick={() => handleStartConsultation(consultation)}>
                    Commencer
                  </Button>
                )}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Consultation en ligne avec {selectedConsultation?.patient}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Détails :</h5>
          <p><strong>Date :</strong> {selectedConsultation?.dateConsul} à {selectedConsultation?.timeConsul}</p>
          <p><strong>Symptômes :</strong> {selectedConsultation?.symptoms}</p>

          <div className="mb-4 p-3 bg-light rounded">
            <h6>Vidéoconférence</h6>
            <iframe
              src={`https://meet.jit.si/${selectedConsultation?.id}-consultation`}
              allow="camera; microphone; fullscreen; display-capture"
              style={{ width: '100%', height: '400px', border: 'none' }}
              title="Consultation Vidéo"
            />
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Prescription médicale</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              placeholder="Entrez la prescription ici..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Fermer</Button>
          <Button variant="primary" onClick={handleCompleteConsultation}>Terminer la consultation</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ConsultationsEnLigne;
