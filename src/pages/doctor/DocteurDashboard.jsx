// src/pages/doctor/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Spinner } from 'react-bootstrap';

// Assure-toi d'avoir importé Font Awesome CSS globalement (dans index.html ou via npm)

const DoctorDashboard = () => {
  const [stats, setStats] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      // Données simulées — à remplacer par tes appels API
      setStats([
        { title: 'Rendez-vous aujourd\'hui', value: 12, iconClass: 'fa-calendar-check', color: 'primary' },
        { title: 'Patients suivis', value: 85, iconClass: 'fa-users', color: 'success' },
        { title: 'Consultations en ligne', value: 5, iconClass: 'fa-laptop-medical', color: 'info' },
        { title: 'Messages non lus', value: 3, iconClass: 'fa-envelope', color: 'warning' },
      ]);

      setUpcomingAppointments([
        { id: 1, patient: 'Mme A. Kouassi', date: '2025-08-07', time: '10:00' },
        { id: 2, patient: 'M. B. Traoré', date: '2025-08-07', time: '11:30' },
        { id: 3, patient: 'Mme C. Diallo', date: '2025-08-07', time: '14:00' },
      ]);

      setPatientsList([
        { id: 1, nom: 'Kouassi', prenom: 'Awa' },
        { id: 2, nom: 'Traoré', prenom: 'Boubacar' },
        { id: 3, nom: 'Diallo', prenom: 'Coumba' },
        { id: 4, nom: 'Koné', prenom: 'Moussa' },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement du tableau de bord...</p>
      </Container>
    );
  }

  return (
    <Container fluid>
      <h2 className="my-4 text-primary fw-bold">Tableau de bord Docteur</h2>

      {/* Statistiques */}
      <Row className="mb-4">
        {stats.map(({ title, value, iconClass, color }, idx) => (
          <Col md={3} key={idx}>
            <Card className={`text-center shadow-sm border border-${color}`} style={{ borderWidth: '2px' }}>
              <Card.Body>
                <div
                  className={`rounded-circle bg-${color} text-white d-inline-flex align-items-center justify-content-center mb-3`}
                  style={{ width: '60px', height: '60px', fontSize: '1.8rem' }}
                >
                  <i className={`fas ${iconClass}`} />
                </div>
                <Card.Title className="fw-bold fs-3">{value}</Card.Title>
                <Card.Text className="text-muted">{title}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Prochains rendez-vous */}
      <Row>
        <Col md={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="fw-bold d-flex align-items-center">
              <i className="fas fa-calendar-check me-2 text-primary" style={{ fontSize: '1.3rem' }}></i>
              Prochains rendez-vous
            </Card.Header>
            <Card.Body>
              <ListGroup>
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map(app => (
                    <ListGroup.Item key={app.id} className="d-flex justify-content-between align-items-center">
                      <span><i className="fas fa-user me-2 text-primary"></i>{app.patient}</span>
                      <small className="text-muted">{app.date} à {app.time}</small>
                    </ListGroup.Item>
                  ))
                ) : (
                  <p className="text-muted">Aucun rendez-vous prévu</p>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Liste des patients suivis */}
        <Col md={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="fw-bold d-flex align-items-center">
              <i className="fas fa-users me-2 text-success" style={{ fontSize: '1.3rem' }}></i>
              Patients suivis
            </Card.Header>
            <Card.Body>
              <ListGroup>
                {patientsList.length > 0 ? (
                  patientsList.map(patient => (
                    <ListGroup.Item key={patient.id} className="d-flex align-items-center">
                      <i className="fas fa-user me-2 text-success" style={{ fontSize: '1.2rem' }}></i>
                      {patient.nom} {patient.prenom}
                    </ListGroup.Item>
                  ))
                ) : (
                  <p className="text-muted">Aucun patient enregistré</p>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorDashboard;
