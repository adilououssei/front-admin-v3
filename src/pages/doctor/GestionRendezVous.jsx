// src/pages/doctor/GestionRendezVous.jsx
import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Card, Modal, Form } from 'react-bootstrap';
import api from '../../services/Api';

const GestionRendezVous = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/api/mes-rendezvous-docteur');
        setAppointments(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des rendez-vous", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Traduire les statuts frontend en statuts backend
      const backendStatus = newStatus === 'confirmé' ? 'accepté' : 'refusé';
      const route = backendStatus === 'accepté' ? 'accept' : 'refuse';

      await api.patch(`/api/docteur/${id}/${route}`);

      // Mettre à jour localement avec le statut affiché (confirmé / annulé)
      setAppointments((prev) =>
        prev.map(appt => appt.id === id ? { ...appt, statut: newStatus } : appt)
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut", error);
    }
  };


  const showAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetail(true);
  };

  const handleReschedule = async () => {
    if (!selectedAppointment || !newDate || !newTime) return;

    try {
      await api.patch(`/api/docteur/${selectedAppointment.id}/reschedule`, {
        date: newDate.trim(),
        heure: newTime.trim(),
      });

      setAppointments((prev) =>
        prev.map(appt =>
          appt.id === selectedAppointment.id
            ? {
              ...appt,
              dateConsultationAt: newDate,
              heureConsultation: newTime,
            }
            : appt
        )
      );

      setShowEditModal(false);
    } catch (error) {
      console.error("Erreur lors de la reprogrammation", error);
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'en_ligne':
        return <Badge bg="info">En ligne</Badge>;
      case 'a_domicile':
        return <Badge bg="warning">A domicile</Badge>;
      case 'a_hopital':
        return <Badge bg="primary">A l'hôpital</Badge>;
      default:
        return <Badge bg="secondary">Autre</Badge>;
    }
  };

  if (loading) return <p>Chargement des rendez-vous...</p>;

  return (
    <Container fluid>
      <h2 className="my-4">Gestion des rendez-vous</h2>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Date/Heure</th>
            <th>Type</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.patient?.nom} {appointment.patient?.prenom}</td>
              <td>{appointment.dateConsultationAt} à {appointment.heureConsultation}</td>
              <td>{getTypeBadge(appointment.typeConsultation)}</td>
              <td>
                <Badge bg={
                  appointment.statut === 'confirmé' ? 'success' :
                    appointment.statut === 'annulé' ? 'danger' : 'warning'
                }>
                  {appointment.statut}
                </Badge>
              </td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => showAppointmentDetails(appointment)}
                >
                  Détails
                </Button>

                {['en_attente', 'en attente'].includes(appointment.statut?.toLowerCase()) && (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() => handleStatusChange(appointment.id, 'confirmé')}
                    >
                      Confirmer
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleStatusChange(appointment.id, 'annulé')}
                    >
                      Annuler
                    </Button>
                  </>
                )}

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setNewDate(appointment.dateConsultationAt);
                    setNewTime(
                      appointment.heureConsultation
                        ? new Date(appointment.heureConsultation).toISOString().substring(11, 16)
                        : ''
                    );
                    setShowEditModal(true);
                  }}
                >
                  Repro.
                </Button>

              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showDetail} onHide={() => setShowDetail(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails du rendez-vous</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <Card>
              <Card.Body>
                <Card.Title>{selectedAppointment.patient?.nom} {selectedAppointment.patient?.prenom}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {selectedAppointment.dateConsultationAt} à {selectedAppointment.heureConsultation}
                </Card.Subtitle>

                <div className="mb-3">
                  <strong>Type: </strong>
                  {getTypeBadge(selectedAppointment.typeConsultation)}
                </div>

                <div className="mb-3">
                  <strong>Statut: </strong>
                  <Badge bg={
                    selectedAppointment.statut === 'confirmé' ? 'success' :
                      selectedAppointment.statut === 'annulé' ? 'danger' : 'warning'
                  }>
                    {selectedAppointment.statut}
                  </Badge>
                </div>

                <div className="mb-3">
                  <strong>Symptômes:</strong>
                  <p>{selectedAppointment.description}</p>
                </div>

                {selectedAppointment.typeConsultation === 'a_domicile' && (
                  <div className="mb-3">
                    <strong>Adresse de visite:</strong>
                    <p>{selectedAppointment.address}</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetail(false)}>Fermer</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reprogrammer le rendez-vous</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nouvelle date</Form.Label>
              <Form.Control
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nouvelle heure</Form.Label>
              <Form.Control
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleReschedule}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GestionRendezVous;
