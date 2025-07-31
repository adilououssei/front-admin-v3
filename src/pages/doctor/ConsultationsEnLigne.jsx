// src/pages/doctor/ConsultationsEnLigne.js
import React, { useState } from 'react';
import { Container, Card, ListGroup, Button, Form, Modal } from 'react-bootstrap';
import { Badge } from 'react-bootstrap';


const ConsultationsEnLigne = () => {
  // Filtrer seulement les consultations en ligne
  const [consultations, setConsultations] = useState([
    { 
      id: 1, 
      patient: 'Koffi Adilou', 
      date: '2023-05-15', 
      time: '09:00',
      status: 'en attente', 
      symptoms: 'Fièvre, maux de tête',
      type: 'en_ligne'
    },
    { 
      id: 2, 
      patient: 'Ama Adjoua', 
      date: '2023-05-14', 
      time: '14:30',
      status: 'terminée', 
      symptoms: 'Douleurs abdominales',
      type: 'en_ligne'
    },
  ]);

  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [prescription, setPrescription] = useState('');

  const handleStartConsultation = (consultation) => {
    setSelectedConsultation(consultation);
    setShowModal(true);
  };

  const handleCompleteConsultation = () => {
    setConsultations(consultations.map(cons => 
      cons.id === selectedConsultation.id ? { ...cons, status: 'terminée' } : cons
    ));
    setShowModal(false);
    setSelectedConsultation(null);
    setPrescription('');
  };

  return (
    <Container fluid>
      <h2 className="my-4">Consultations en ligne</h2>
      
      <Card>
        <Card.Header>Liste des consultations en ligne</Card.Header>
        <ListGroup variant="flush">
          {consultations.map((consultation) => (
            <ListGroup.Item key={consultation.id}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>{consultation.patient}</h5>
                  <p className="mb-1">Date: {consultation.date} à {consultation.time}</p>
                  <p className="mb-1">Symptômes: {consultation.symptoms}</p>
                  <Badge bg={consultation.status === 'en attente' ? 'warning' : 'success'}>
                    {consultation.status}
                  </Badge>
                </div>
                {consultation.status === 'en attente' && (
                  <Button 
                    variant="primary"
                    onClick={() => handleStartConsultation(consultation)}
                  >
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
          <h5>Détails:</h5>
          <p><strong>Date:</strong> {selectedConsultation?.date} à {selectedConsultation?.time}</p>
          <p><strong>Symptômes:</strong> {selectedConsultation?.symptoms}</p>
          
          <div className="mb-4 p-3 bg-light rounded">
            <h6>Espace de consultation vidéo (intégration possible avec WebRTC)</h6>
            <div className="text-center p-4 border">
              [Interface de vidéoconférence serait intégrée ici]
            </div>
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
          <Button variant="primary" onClick={handleCompleteConsultation}>
            Terminer la consultation
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ConsultationsEnLigne;