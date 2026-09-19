import logoImg from '../assets/logo.jpg';

export default function Footer({ onHowItWorks, onLogin, onStartCampaign }) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" aria-label="Site footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo-wrap">
              <img src={logoImg} alt="Sath-Sath" className="footer-logo" />
              <span className="footer-brand-name">Sath<span>-Sath</span></span>
            </div>
            <p className="footer-desc">
              Nepal&apos;s crowdfunding platform connecting changemakers with donors
              to raise funds quickly, securely, and transparently.
            </p>
          </div>

          {/* Platform */}
          <div className="footer-col">
            <h4>Platform</h4>
            <ul className="footer-links">
              <li>
                <button
                  onClick={() => document.getElementById('campaigns')?.scrollIntoView({ behavior: 'smooth' })}
                  id="footer-explore"
                >
                  Explore Campaigns
                </button>
              </li>
              <li>
                <button onClick={onStartCampaign} id="footer-start">Start a Campaign</button>
              </li>
              <li>
                <button onClick={onHowItWorks} id="footer-how-it-works">How It Works</button>
              </li>
              <li>
                <button onClick={onLogin} id="footer-login">Login / Sign Up</button>
              </li>
            </ul>
          </div>

          {/* Causes */}
          <div className="footer-col">
            <h4>Causes</h4>
            <ul className="footer-links">
              {['Medical', 'Emergency', 'Education', 'Community Welfare'].map((cat) => (
                <li key={cat}>
                  <a href="#campaigns" onClick={(e) => { e.preventDefault(); document.getElementById('campaigns')?.scrollIntoView({ behavior: 'smooth' }); }}>
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="footer-col">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><a href="#">Trust &amp; Safety</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <span>© {year} Sath-Sath Crowdfunding Platform. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
