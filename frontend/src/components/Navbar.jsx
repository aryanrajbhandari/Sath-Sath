import { useState, useEffect, useRef } from 'react';
import logoImg from '../assets/logo.jpg';

export default function Navbar({
  user,
  onLogin,
  onLogout,
  onStartCampaign,
  onHowItWorks,
  onSearch,
  searchQuery,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const initials = user
    ? user.username.slice(0, 2).toUpperCase()
    : '';

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Brand */}
        <a className="navbar-brand" href="/" aria-label="Sath-Sath Home">
          <img src={logoImg} alt="Sath-Sath logo" className="navbar-logo" />
          <span className="navbar-brand-text">
            Sath<span>-Sath</span>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <ul className="navbar-nav">
          <li>
            <button onClick={() => handleScroll('campaigns')} id="nav-explore">
              Explore
            </button>
          </li>
          <li>
            <button onClick={onHowItWorks} id="nav-how-it-works">
              How It Works
            </button>
          </li>
          {user && (
            <li>
              <button onClick={() => handleScroll('campaigns')} id="nav-my-campaigns">
                My Campaigns
              </button>
            </li>
          )}
        </ul>

        {/* Desktop Search Bar */}
        <div className="navbar-search" role="search">
          <svg
            className="navbar-search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            placeholder="Search campaigns…"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            aria-label="Search campaigns"
            id="navbar-search-input"
          />
        </div>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          <button
            className="btn btn-primary btn-sm"
            onClick={onStartCampaign}
            id="navbar-start-campaign"
          >
            ✦ Start a Campaign
          </button>

          {user ? (
            <div style={{ position: 'relative' }} ref={userMenuRef}>
              <button
                className="navbar-user-badge"
                onClick={() => setUserMenuOpen((o) => !o)}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                id="navbar-user-menu-toggle"
              >
                <div className="navbar-user-avatar">{initials}</div>
                <span className="navbar-user-name">{user.username}</span>
              </button>
              {userMenuOpen && (
                <div className="navbar-dropdown-menu">
                  <div className="navbar-dropdown-header">
                    Signed in as <strong>{user.username}</strong>
                  </div>
                  <button
                    className="navbar-dropdown-item danger"
                    onClick={() => { onLogout(); setUserMenuOpen(false); }}
                    id="navbar-logout-btn"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="btn btn-outline-navy btn-sm"
              onClick={onLogin}
              id="navbar-login-btn"
            >
              Login / Sign In
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className={`navbar-hamburger${menuOpen ? ' active' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          id="navbar-hamburger-btn"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </div>

      {/* Mobile Navigation Drawer & Backdrop */}
      {menuOpen && (
        <div
          className="navbar-mobile-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className={`navbar-mobile-drawer${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <div className="navbar-mobile-content">
          {/* Mobile Search */}
          <div className="navbar-mobile-search">
            <svg
              className="navbar-search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              placeholder="Search campaigns…"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              aria-label="Search campaigns"
              id="navbar-mobile-search-input"
            />
          </div>

          {/* Mobile Links */}
          <ul className="navbar-mobile-links">
            <li>
              <button
                onClick={() => handleScroll('campaigns')}
                className="navbar-mobile-link"
              >
                <span>🔍</span> Explore Campaigns
              </button>
            </li>
            <li>
              <button
                onClick={() => { onHowItWorks(); setMenuOpen(false); }}
                className="navbar-mobile-link"
              >
                <span>💡</span> How It Works
              </button>
            </li>
            {user && (
              <li>
                <button
                  onClick={() => handleScroll('campaigns')}
                  className="navbar-mobile-link"
                >
                  <span>📋</span> My Campaigns
                </button>
              </li>
            )}
          </ul>

          {/* Mobile Primary Action */}
          <div className="navbar-mobile-actions">
            <button
              className="btn btn-teal btn-lg"
              style={{ width: '100%' }}
              onClick={() => { onStartCampaign(); setMenuOpen(false); }}
              id="navbar-mobile-start-campaign"
            >
              ✦ Start a Campaign
            </button>

            {user ? (
              <div className="navbar-mobile-user-card">
                <div className="navbar-user-avatar" style={{ width: 36, height: 36, fontSize: 14 }}>
                  {initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Signed in as</div>
                  <strong style={{ fontSize: 14, color: 'var(--navy)', wordBreak: 'break-word' }}>
                    {user.username}
                  </strong>
                </div>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => { onLogout(); setMenuOpen(false); }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                className="btn btn-outline-navy btn-lg"
                style={{ width: '100%' }}
                onClick={() => { onLogin(); setMenuOpen(false); }}
                id="navbar-mobile-login-btn"
              >
                Login / Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
