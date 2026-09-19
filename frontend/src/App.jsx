import { useState, useEffect, useCallback } from 'react';
import './App.css';

import Navbar               from './components/Navbar';
import Hero                 from './components/Hero';
import CampaignList         from './components/CampaignList';
import CampaignDetailModal  from './components/CampaignDetailModal';
import CreateCampaignModal  from './components/CreateCampaignModal';
import AuthModal            from './components/AuthModal';
import HowItWorksModal      from './components/HowItWorksModal';
import Footer               from './components/Footer';

import { fetchCampaigns, getCurrentUser, logoutUser } from './services/api';

// ── Simple Toast ───────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`} role="alert">
          <span className="toast-icon">
            {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
          </span>
          <span className="toast-message">{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  // ── Data state ──
  const [campaigns,      setCampaigns]      = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(false);

  // ── Filter state ──
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery,    setSearchQuery]     = useState('');

  // ── Auth state ──
  const [user,           setUser]           = useState(null);

  // ── Modal visibility ──
  const [modal, setModal] = useState(null); // null | 'auth' | 'create' | 'hiw' | 'detail'
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // ── Toast state ──
  const [toasts, setToasts] = useState([]);

  // ── Toast helper ──────────────────────────────────────────────────────────
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  // ── Load campaigns from backend ──────────────────────────────────────────
  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchCampaigns();
      setCampaigns(Array.isArray(data) ? data : []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCampaigns(); }, [loadCampaigns]);

  // ── Restore session on mount ──────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('sathsath_token');
    if (token) {
      getCurrentUser()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('sathsath_token');
        });
    }
  }, []);

  // ── Modal helpers ────────────────────────────────────────────────────────
  const openModal   = (name) => setModal(name);
  const closeModal  = ()     => { setModal(null); setSelectedCampaign(null); };

  const openDetail = (campaign) => {
    setSelectedCampaign(campaign);
    setModal('detail');
  };

  // ── Auth handlers ────────────────────────────────────────────────────────
  const handleAuthenticated = (me) => {
    setUser(me);
    addToast(`Welcome back, ${me.username}! 🎉`, 'success');
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    addToast('You have been signed out.', 'info');
  };

  // ── Donation completed ───────────────────────────────────────────────────
  const handleDonated = ({ campaignId, amount }) => {
    // Optimistic update: bump raised_amount locally
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== campaignId) return c;
        const newRaised = parseFloat(c.raised_amount) + amount;
        const isNowDone = newRaised >= parseFloat(c.target_amount);
        return { ...c, raised_amount: String(newRaised), is_active: !isNowDone };
      })
    );
    addToast(`Thank you! Rs ${amount.toLocaleString()} donated successfully. 🙏`, 'success');
    // Also refresh from server to get updated donors list
    loadCampaigns();
  };

  // ── Campaign created ──────────────────────────────────────────────────────
  const handleCreated = (newCampaign) => {
    setCampaigns((prev) => [newCampaign, ...prev]);
    addToast('Your campaign is live! Share it to start raising funds. 🚀', 'success');
    closeModal();
  };

  // ── Explore scroll helper ─────────────────────────────────────────────────
  const scrollToCampaigns = () => {
    document.getElementById('campaigns')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* ── Navigation ── */}
      <Navbar
        user={user}
        onLogin={() => openModal('auth')}
        onLogout={handleLogout}
        onStartCampaign={() => openModal('create')}
        onHowItWorks={() => openModal('hiw')}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />

      {/* ── Hero ── */}
      <Hero
        campaigns={campaigns}
        onStartCampaign={() => openModal('create')}
        onExplore={scrollToCampaigns}
      />

      {/* ── Campaign Grid ── */}
      <CampaignList
        campaigns={campaigns}
        loading={loading}
        error={error}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onViewDetails={openDetail}
      />

      {/* ── Footer ── */}
      <Footer
        onHowItWorks={() => openModal('hiw')}
        onLogin={() => openModal('auth')}
        onStartCampaign={() => openModal('create')}
      />

      {/* ══ MODALS ══ */}
      {modal === 'auth' && (
        <AuthModal
          onClose={closeModal}
          onAuthenticated={handleAuthenticated}
        />
      )}

      {modal === 'create' && (
        <CreateCampaignModal
          user={user}
          onClose={closeModal}
          onCreated={handleCreated}
          onLoginRequired={() => openModal('auth')}
        />
      )}

      {modal === 'hiw' && (
        <HowItWorksModal
          onClose={closeModal}
          onStartCampaign={() => openModal('create')}
          onLogin={() => openModal('auth')}
        />
      )}

      {modal === 'detail' && selectedCampaign && (
        <CampaignDetailModal
          campaign={selectedCampaign}
          user={user}
          onClose={closeModal}
          onDonated={handleDonated}
        />
      )}

      {/* ── Toasts ── */}
      <Toast toasts={toasts} />
    </>
  );
}
