import heroImg from '../assets/Hero.jpg';

export default function Hero({ campaigns, onStartCampaign, onExplore }) {
  const totalRaised = campaigns.reduce(
    (sum, c) => sum + parseFloat(c.raised_amount || 0), 0
  );
  const totalLives = campaigns.reduce(
    (sum, c) => sum + (c.donations?.length || 0), 0
  ) + campaigns.length * 3;

  const formatCurrency = (n) =>
    n >= 1_000_000
      ? `Rs ${(n / 1_000_000).toFixed(1)}M`
      : n >= 1_000
      ? `Rs ${(n / 1_000).toFixed(0)}K`
      : `Rs ${n}`;

  return (
    <section className="hero" aria-label="Hero banner">
      {/* Hero.jpg from src/assets — applied as inline background so Vite bundles the hash */}
      <div
        className="hero-bg"
        role="img"
        aria-label="Diverse community standing together"
        style={{ backgroundImage: `url(${heroImg})` }}
      />

      <div className="hero-content">
        {/* Left: Text */}
        <div className="hero-left">
          <div className="hero-badge">
            <span className="hero-badge-dot" aria-hidden="true" />
            Nepal&apos;s Crowdfunding Platform
          </div>

          <h1 className="hero-title">
            Sath-Sath: <span className="accent">Raise Together,</span>
            <br />Stand Together
          </h1>

          <p className="hero-subtitle">
            Sath-Sath connects passionate changemakers with donors to raise
            funds quickly, securely, and transparently — one campaign at a time.
          </p>

          <div className="hero-ctas">
            <button
              className="btn btn-teal btn-lg"
              onClick={onStartCampaign}
              id="hero-start-campaign"
            >
              ✦ Start a Campaign
            </button>
            <button
              className="btn btn-outline btn-lg"
              onClick={onExplore}
              id="hero-explore"
            >
              Explore Campaigns →
            </button>
          </div>
        </div>

        {/* Right: Stats Card */}
        <div className="hero-stats" aria-label="Platform statistics">
          <div className="hero-stat">
            <div className="hero-stat-label">Total Lives Impacted</div>
            <div className="hero-stat-value" aria-label={`${totalLives} lives`}>
              {totalLives.toLocaleString()} Lives
            </div>
            <div className="hero-stat-sub">and counting every day</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-label">Amount Raised</div>
            <div className="hero-stat-value" aria-label={`${formatCurrency(totalRaised)} raised`}>
              {formatCurrency(totalRaised)}
            </div>
            <div className="hero-stat-sub">across {campaigns.length} campaigns</div>
          </div>
        </div>
      </div>
    </section>
  );
}
