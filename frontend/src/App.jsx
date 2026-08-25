import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CampaignDetail from './pages/CampaignDetail';
import Dashboard from './pages/Dashboard';
import CreateCampaign from './pages/CreateCampaign';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const token = localStorage.getItem('access_token');

  return (
    <BrowserRouter>
      {/* Simple Navigation Bar */}
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
        <Link to="/create-campaign" style={{ marginRight: '15px' }}>+ Create Campaign</Link>
        <Link to="/dashboard" style={{ marginRight: '15px' }}>Dashboard</Link>
        
        {!token ? (
          <>
            <Link to="/login" style={{ marginRight: '15px' }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : null}
      </nav>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/campaign/:id" element={<CampaignDetail />} />

        {/* Protected Routes (Requires Login) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;