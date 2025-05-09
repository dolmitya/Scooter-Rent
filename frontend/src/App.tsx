import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import AddBalance from './pages/AddBalance';
import TripHistory from './pages/TripHistory';
import RentScooter from './pages/RentScooter';
import EndTrip from './pages/EndTrip';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <Routes>
              <Route path="/login" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/add-balance" element={
                <ProtectedRoute>
                  <AddBalance />
                </ProtectedRoute>
              } />
              <Route path="/trips" element={
                <ProtectedRoute>
                  <TripHistory />
                </ProtectedRoute>
              } />
              <Route path="/rent" element={
                <ProtectedRoute>
                  <RentScooter />
                </ProtectedRoute>
              } />
              <Route path="/end-trip" element={
                <ProtectedRoute>
                  <EndTrip />
                </ProtectedRoute>
              } />
              <Route path="/admin-panel" element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </TripProvider>
    </AuthProvider>
  );
}

export default App;