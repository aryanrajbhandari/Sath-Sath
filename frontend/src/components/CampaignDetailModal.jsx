import { useState } from 'react';
import { makeDonation } from '../services/api';

const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

function formatAmount(value) {
  const n = parseFloat(value) || 0;
  return `Rs ${n.toLocaleString()}`;
}

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('en-NP', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function CampaignDetailModal({ campaign, user, onClose, onDonated }) {
  const raised  = parseFloat(campaign.raised_amount) || 0;
  const target  = parseFloat(campaign.target_amount) || 1;
  const pct     = Math.min(100, Math.round((raised / target) * 100));
  const remaining = Math.max(0, target - raised);

  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount]     = useState('');
  const [donorName, setDonorName]           = useState(user?.username || '');
  const [message, setMessage]               = useState('');
  const [submitting, setSubmitting]         = useState(false);
  const [error, setError]                   = useState('');
  const [success, setSuccess]               = useState(false);

  const finalAmount = (selectedAmount ?? parseFloat(customAmount)) || 0;

  const handlePreset = (amt) => {
    setSelectedAmount(amt);
    setCustomAmount('');
    setError('');
  };

  const handleCustom = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
    setError('');
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    setError('');

    if (!donorName.trim()) { setError('Please enter your name.'); return; }
    if (!finalAmount || finalAmount <= 0) { setError('Please choose or enter a donation amount.'); return; }
    if (finalAmount > remaining) {
      setError(`Donation exceeds remaining target. Only Rs ${remaining.toLocaleString()} left to raise.`);
      return;
    }

    setSubmitting(true);
    try {
      await makeDonation({
        campaign: campaign.id,
        donor_name: donorName.trim(),
        amount: finalAmount,
        message: message.trim(),
      });
      setSuccess(true);
      onDonated({ campaignId: campaign.id, amount: finalAmount });
    } catch (err) {
      const msg =
        err?.data?.amount?.[0] ||
        err?.data?.non_field_errors?.[0] ||
        err?.data?.detail ||
        'Donation failed. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const donations = campaign.donations || [];

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Campaign Details"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box detail-modal-container">
        <button className="modal-close detail-modal-close" onClick={onClose} aria-label="Close dialog">
          ✕
        </button>

        <div className="detail-modal-layout">
          {/* Left Column: Story & Details */}
          <div className="detail-modal-left">
            {campaign.image_url ? (
              <div className="detail-modal-img-wrap">
                <img src={campaign.image_url} alt={campaign.title} className="detail-modal-img" />
              </div>
            ) : (
              <div className="detail-compact-banner" aria-hidden="true">
                <span className="detail-compact-emoji">💛</span>
                <span className="detail-compact-tag">Verified Fundraiser</span>
              </div>
            )}

            <div className="detail-story-content">
              <div className="detail-modal-meta">
                {campaign.category && (
                  <span className="campaign-card-category" style={{ position: 'static' }}>
                    {campaign.category}
                  </span>
                )}
                <span
                  className={`campaign-card-status ${campaign.is_active ? 'active' : 'closed'}`}
                  style={{ position: 'static' }}
                >
                  {campaign.is_active ? 'Active' : 'Goal Reached'}
                </span>
                {campaign.creator && (
                  <span className="detail-creator-text">👤 by {campaign.creator}</span>
                )}
              </div>

              <h1 className="detail-modal-title">{campaign.title}</h1>
              <p className="detail-modal-desc">{campaign.description}</p>
            </div>

            {/* Donors list */}
            <div className="detail-donors-section">
              <p className="donors-title">
                🙏 Recent Donors ({donations.length})
              </p>
              {donations.length === 0 ? (
                <div className="donors-empty">Be the first to donate to this campaign!</div>
              ) : (
                <div className="donors-list">
                  {[...donations].reverse().slice(0, 8).map((d, i) => (
                    <div key={i} className="donor-item">
                      <div className="donor-avatar">
                        {(d.donor_name || 'A').slice(0, 1).toUpperCase()}
                      </div>
                      <div className="donor-info">
                        <p className="donor-name">{d.donor_name || 'Anonymous'}</p>
                        {d.message && <p className="donor-message">"{d.message}"</p>}
                      </div>
                      <div className="donor-amount-wrap">
                        <p className="donor-amount">Rs {parseFloat(d.amount).toLocaleString()}</p>
                        <p className="donor-date">{formatDate(d.donated_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Financial Progress & Donation Action Card */}
          <div className="detail-modal-right">
            <div className="detail-action-card">
              {/* Progress summary */}
              <div className="detail-progress-card">
                <div className="detail-progress-amounts">
                  <div>
                    <span className="detail-raised">{formatAmount(raised)}</span>
                    <span className="detail-target"> of {formatAmount(target)}</span>
                  </div>
                  <span className="detail-pct-badge">{pct}%</span>
                </div>

                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                </div>

                <div className="detail-progress-stats">
                  <span className="detail-stat"><strong>{donations.length}</strong> donors</span>
                  <span className="detail-stat"><strong>{formatAmount(remaining)}</strong> left</span>
                </div>
              </div>

              {/* Donation Form or Success */}
              {campaign.is_active && !success && (
                <form className="donation-form" onSubmit={handleDonate} noValidate>
                  <h3 className="donation-form-title">♥ Choose Amount to Donate</h3>

                  {/* Preset amounts */}
                  <div className="donation-amounts">
                    {PRESET_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        className={`donation-amount-btn${selectedAmount === amt ? ' selected' : ''}`}
                        onClick={() => handlePreset(amt)}
                        id={`preset-${amt}`}
                      >
                        Rs {amt.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <div className="form-row" style={{ gap: 10 }}>
                    <div className="form-group" style={{ marginBottom: 10 }}>
                      <label className="form-label" htmlFor="custom-amount">Custom Amount (Rs)</label>
                      <input
                        id="custom-amount"
                        className="form-input"
                        type="number"
                        min="1"
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={handleCustom}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 10 }}>
                      <label className="form-label" htmlFor="donor-name">Your Name</label>
                      <input
                        id="donor-name"
                        className="form-input"
                        type="text"
                        placeholder="e.g. Sunita Sharma"
                        value={donorName}
                        onChange={(e) => { setDonorName(e.target.value); setError(''); }}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 12 }}>
                    <label className="form-label" htmlFor="donor-message">Message (optional)</label>
                    <input
                      id="donor-message"
                      className="form-input"
                      placeholder="Words of encouragement…"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  {error && <p className="form-error" style={{ marginBottom: 10 }} role="alert">⚠️ {error}</p>}

                  <button
                    type="submit"
                    className="btn btn-teal btn-lg"
                    disabled={submitting}
                    id="submit-donation-btn"
                    style={{ width: '100%' }}
                  >
                    {submitting
                      ? <><span className="btn-spinner" /> Processing…</>
                      : `♥ Donate ${finalAmount > 0 ? `Rs ${finalAmount.toLocaleString()}` : ''}`}
                  </button>

                  <div className="detail-secure-notice">
                    <span>🔒</span> Verified & Secure Fund Transfer via Sath-Sath
                  </div>
                </form>
              )}

              {/* Success state */}
              {success && (
                <div style={{ textAlign: 'center', padding: '24px 12px', animation: 'slideUp 0.3s ease' }}>
                  <div style={{ fontSize: 48, marginBottom: 10 }}>🎉</div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800, color: 'var(--navy)', marginBottom: 6 }}>
                    Thank you for your support!
                  </h3>
                  <p style={{ color: 'var(--gray-500)', fontSize: 14, lineHeight: 1.6 }}>
                    Your contribution of <strong style={{ color: 'var(--teal)' }}>Rs {finalAmount.toLocaleString()}</strong> has been recorded.
                    Together we make an impact. 🙏
                  </p>
                  <button className="btn btn-primary btn-sm" onClick={onClose} style={{ marginTop: 16 }}>
                    Continue Exploring
                  </button>
                </div>
              )}

              {!campaign.is_active && !success && (
                <div style={{ textAlign: 'center', padding: '24px 16px', background: 'var(--gray-100)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🎯</div>
                  <h4 style={{ color: 'var(--navy)', fontWeight: 700, marginBottom: 4 }}>Campaign Completed</h4>
                  <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>This campaign has reached its fundraising goal.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
