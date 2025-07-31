// src/pages/admin/Dashboard.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Dashboard = () => {
  // Données factices pour la démo
  const stats = [
    { title: 'Hôpitaux enregistrés', value: '24', icon: '🏥' },
    { title: 'Médecins actifs', value: '156', icon: '👨‍⚕️' },
    { title: 'Rendez-vous aujourd\'hui', value: '87', icon: '📅' },
    { title: 'Consultations en ligne', value: '32', icon: '💻' },
  ];

  return (
    <Container fluid>
      <h2 className="my-4">Tableau de bord</h2>
      
      <Row className="mb-4">
        {stats.map((stat, index) => (
          <Col md={3} key={index}>
            <Card className="text-center">
              <Card.Body>
                <h1>{stat.icon}</h1>
                <Card.Title>{stat.value}</Card.Title>
                <Card.Text>{stat.title}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>Derniers hôpitaux ajoutés</Card.Header>
            <Card.Body>
              {/* Liste des hôpitaux */}
              <ul className="list-group">
                <li className="list-group-item">Hôpital Central</li>
                <li className="list-group-item">Clinique Saint-Louis</li>
                <li className="list-group-item">Polyclinique Les Cocotiers</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>Derniers médecins inscrits</Card.Header>
            <Card.Body>
              {/* Liste des médecins */}
              <ul className="list-group">
                <li className="list-group-item">Dr. Koffi Mensah</li>
                <li className="list-group-item">Dr. Ama Adjoua</li>
                <li className="list-group-item">Dr. Jean Dupont</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;