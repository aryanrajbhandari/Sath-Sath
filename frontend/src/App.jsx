import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import our new pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CampaignDetail from './pages/CampaignDetail';

function App() {
  return (
    <BrowserRouter>
      {/* 
        A basic navigation menu so we can click around.
        Later, we will move this into a separate Navbar component!
      */}
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
        <a href="/" style={{ marginRight: '15px' }}>Home</a>
        <a href="/login" style={{ marginRight: '15px' }}>Login</a>
        <a href="/register">Register</a>
      </nav>

      {/* The Routes act as a switch, rendering the correct component based on the URL */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* The :id is a dynamic parameter so we can load specific campaigns later */}
        <Route path="/campaign/:id" element={<CampaignDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;