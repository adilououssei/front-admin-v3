// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Spinner } from 'react-bootstrap';

// Si tu préfères Bootstrap Icons via CDN, ajoute dans ton index.html :
// <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" />

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [latestHospitals, setLatestHospitals] = useState([]);
  const [latestDoctors, setLatestDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simule un fetch API avec un délai
  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      // Données dynamiques (à remplacer par fetch axios réel)
      setStats([
        { title: 'Hôpitaux enregistrés', value: 24, iconClass: 'bi-hospital', color: 'primary' },
        { title: 'Médecins actifs', value: 156, iconClass: 'bi-person-badge', color: 'success' },
        { title: 'Rendez-vous aujourd\'hui', value: 87, iconClass: 'bi-calendar-day', color: 'warning' },
        { title: 'Consultations en ligne', value: 32, iconClass: 'bi-laptop', color: 'info' },
      ]);

      setLatestHospitals([
        { id: 1, nom: 'Hôpital Central' },
        { id: 2, nom: 'Clinique Saint-Louis' },
        { id: 3, nom: 'Polyclinique Les Cocotiers' },
      ]);

      setLatestDoctors([
        { id: 1, nom: 'Koffi', prenom: 'Mensah' },
        { id: 2, nom: 'Ama', prenom: 'Adjoua' },
        { id: 3, nom: 'Jean', prenom: 'Dupont' },
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
      <h2 className="my-4 text-primary fw-bold">Tableau de bord</h2>

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
                  <i className={`bi ${iconClass}`} />
                </div>
                <Card.Title className="fw-bold fs-3">{value}</Card.Title>
                <Card.Text className="text-muted">{title}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Derniers ajouts */}
      <Row>
        <Col md={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="fw-bold d-flex align-items-center">
              <i className="bi bi-hospital me-2 text-primary" style={{ fontSize: '1.3rem' }}></i>
              Derniers hôpitaux ajoutés
            </Card.Header>
            <Card.Body>
              <ListGroup>
                {latestHospitals.length > 0 ? (
                  latestHospitals.map(hospital => (
                    <ListGroup.Item key={hospital.id} className="d-flex align-items-center">
                      <i className="bi bi-hospital me-3 text-primary" style={{ fontSize: '1.2rem' }}></i>
                      {hospital.nom}
                    </ListGroup.Item>
                  ))
                ) : (
                  <p className="text-muted">Aucun hôpital enregistré récemment</p>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="fw-bold d-flex align-items-center">
              <i className="bi bi-person-badge me-2 text-success" style={{ fontSize: '1.3rem' }}></i>
              Derniers médecins inscrits
            </Card.Header>
            <Card.Body>
              <ListGroup>
                {latestDoctors.length > 0 ? (
                  latestDoctors.map(doctor => (
                    <ListGroup.Item key={doctor.id} className="d-flex align-items-center">
                      <i className="bi bi-person-badge me-3 text-success" style={{ fontSize: '1.2rem' }}></i>
                      Dr. {doctor.nom} {doctor.prenom}
                    </ListGroup.Item>
                  ))
                ) : (
                  <p className="text-muted">Aucun médecin inscrit récemment</p>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
