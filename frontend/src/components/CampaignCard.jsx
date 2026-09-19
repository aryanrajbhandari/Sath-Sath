function formatAmount(value) {
  const n = parseFloat(value) || 0;
  if (n >= 1_000_000) return `Rs ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `Rs ${(n / 1_000).toFixed(0)}K`;
  return `Rs ${n.toLocaleString()}`;
}

// Category → emoji for placeholder
const CATEGORY_EMOJI = {
  Medical: '🏥',
  Emergency: '🚨',
  Education: '📚',
  'Community Welfare': '🤝',
};

export default function CampaignCard({ campaign, onViewDetails }) {
  const raised = parseFloat(campaign.raised_amount) || 0;
  const target = parseFloat(campaign.target_amount) || 1;
  const pct    = Math.min(100, Math.round((raised / target) * 100));
  const emoji  = CATEGORY_EMOJI[campaign.category] || '💛';

  return (
    <article
      className="campaign-card"
      aria-label={campaign.title}
      id={`campaign-card-${campaign.id}`}
      onClick={(e) => {
        if (!e.target.closest('button')) {
          onViewDetails(campaign);
        }
      }}
    >
      {/* Image */}
      <div className="campaign-card-img-wrap">
        {campaign.image_url ? (
          <img
            src={campaign.image_url}
            alt={campaign.title}
            className="campaign-card-img"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="campaign-card-img-placeholder"
          style={{ display: campaign.image_url ? 'none' : 'flex' }}
          aria-hidden="true"
        >
          {emoji}
        </div>
        {campaign.category && (
          <span className="campaign-card-category">{campaign.category}</span>
        )}
        <span className={`campaign-card-status ${campaign.is_active ? 'active' : 'closed'}`}>
          {campaign.is_active ? 'Active' : 'Goal Reached'}
        </span>
      </div>

      {/* Body */}
      <div className="campaign-card-body">
        <h2 className="campaign-card-title">{campaign.title}</h2>
        {campaign.creator && (
          <p className="campaign-card-creator">
            <span aria-hidden="true">👤</span>
            by {campaign.creator}
          </p>
        )}

        {/* Progress */}
        <div className="campaign-card-progress-wrap">
          <div className="campaign-card-amounts">
            <span className="campaign-card-raised" aria-label={`${formatAmount(raised)} raised`}>
              {formatAmount(raised)}
            </span>
            <span className="campaign-card-target">of {formatAmount(target)}</span>
          </div>
          <div className="progress-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="progress-pct">{pct}% funded</p>
        </div>
      </div>

      {/* Footer */}
      <div className="campaign-card-footer">
        <button
          className="btn btn-teal btn-sm"
          onClick={() => onViewDetails(campaign)}
          id={`btn-donate-${campaign.id}`}
        >
          ♥ Donate
        </button>
        <button
          className="btn btn-outline-navy btn-sm"
          onClick={() => onViewDetails(campaign)}
          id={`btn-details-${campaign.id}`}
        >
          View Details
        </button>
      </div>
    </article>
  );
}
