import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header'; // ⬅️
import Dashboard from './pages/admin/Dashboard';
import GestionHopitaux from './pages/admin/GestionHopitaux';
import GestionMedecins from './pages/admin/GestionMedecins';
import GestionRendezVous from './pages/doctor/GestionRendezVous';
import ConsultationsEnLigne from './pages/doctor/ConsultationsEnLigne';
import Profile from './pages/shared/Profile';
import Login from './pages/Login';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userRole, setUserRole] = React.useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false); // ⬅️ Nouveau

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
  };

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
                  </>
                )}
                {userRole === 'doctor' && (
                  <>
                    <Route path="/" element={<GestionRendezVous />} />
                    <Route path="/consultations-en-ligne" element={<ConsultationsEnLigne />} />
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
