// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/admin/Dashboard';
import GestionHopitaux from './pages/admin/GestionHopitaux';
import GestionMedecins from './pages/admin/GestionMedecins';
import GestionRendezVous from './pages/doctor/GestionRendezVous';
import ConsultationsEnLigne from './pages/doctor/ConsultationsEnLigne';
import Profile from './pages/shared/Profile';
import Login from './pages/Login';
import './App.css';
import UserList from './pages/admin/GestionUtilisateurs/UserList';
import UserDetails from './pages/admin/GestionUtilisateurs/UserDetails';
import SpecialiteList from './pages/admin/GestionSpecialites/SpecialiteList';
import DisponibiliteCalendar from './pages/doctor/GestionDisponibilite/DisponibiliteCalendar';
import DocteurDashboard from './pages/doctor/DocteurDashboard';
import api from './services/Api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userRole, setUserRole] = React.useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // supprime le token
    setIsLoggedIn(false);
    setUserRole('');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/api/me')
        .then(res => {
          const role = res.data.roles.includes('ROLE_ADMIN') ? 'admin' : 'doctor';
          setUserRole(role);
          setIsLoggedIn(true);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          setUserRole('');
        });
    }
  }, []);

  return (
    <Router>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="app-container d-flex">
          <Sidebar role={userRole} collapsed={sidebarCollapsed} onLogout={handleLogout} />
          <div className="flex-grow-1">
            <Header
              user={{ nom: 'Dr. Adilou' }}
              onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
              onLogout={handleLogout}
            />
            <div className="main-content p-4">
              <Routes>
                {userRole === 'admin' && (
                  <>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/gestion-hopitaux" element={<GestionHopitaux />} />
                    <Route path="/gestion-medecins" element={<GestionMedecins />} />
                    <Route path="/utilisateurs" element={<UserList />} />
                    <Route path="/utilisateurs/:id" element={<UserDetails />} />
                    <Route path="/gestion-specialites" element={<SpecialiteList />} />
                  </>
                )}
                {userRole === 'doctor' && (
                  <>
                    <Route path="/" element={<DocteurDashboard />} />
                    <Route path="/mes-rendezVous" element={<GestionRendezVous />} />
                    <Route path="/consultations-en-ligne" element={<ConsultationsEnLigne />} />
                    <Route path="/gestion-disponibilites" element={<DisponibiliteCalendar />} />
                  </>
                )}
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
