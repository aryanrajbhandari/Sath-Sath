import CampaignCard from './CampaignCard';
import CategoryFilter from './CategoryFilter';

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-line skeleton-line-full" />
        <div className="skeleton skeleton-line skeleton-line-md" />
        <div className="skeleton skeleton-line skeleton-line-sm" style={{ marginTop: 16 }} />
        <div className="skeleton skeleton-line skeleton-line-full" style={{ height: 8, marginTop: 8 }} />
      </div>
    </div>
  );
}

export default function CampaignList({
  campaigns,
  loading,
  error,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onViewDetails,
}) {
  // Filter by category (skip if 'All' or campaigns don't have category field)
  const filtered = campaigns.filter((c) => {
    const matchCat  = activeCategory === 'All' || c.category === activeCategory;
    const matchSearch = !searchQuery ||
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.creator?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section className="campaigns-section" id="campaigns" aria-label="Campaigns">
      <div className="section-header">
        <div>
          <h2 className="section-title">Active Campaigns</h2>
          <p className="section-subtitle">
            {loading
              ? 'Loading campaigns…'
              : `${filtered.length} campaign${filtered.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
      </div>

      <CategoryFilter active={activeCategory} onChange={onCategoryChange} />

      {error && (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            background: '#fff5f5',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #fecaca',
            color: 'var(--danger)',
            marginBottom: 24,
          }}
          role="alert"
        >
          <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
          <p style={{ fontWeight: 600, marginBottom: 6 }}>Could not load campaigns</p>
          <p style={{ fontSize: 14, color: 'var(--gray-500)' }}>
            Make sure the backend server is running at{' '}
            <code style={{ background: 'var(--gray-100)', padding: '2px 6px', borderRadius: 4 }}>
              http://127.0.0.1:8000
            </code>
          </p>
        </div>
      )}

      <div className="campaigns-grid">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : filtered.length === 0 ? (
          <div className="campaigns-empty">
            <div className="campaigns-empty-icon">🔍</div>
            <h3>No campaigns found</h3>
            <p>
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search.`
                : activeCategory !== 'All'
                ? `No ${activeCategory} campaigns yet. Be the first to start one!`
                : 'No campaigns yet. Start the first one!'}
            </p>
          </div>
        ) : (
          filtered.map((c) => (
            <CampaignCard key={c.id} campaign={c} onViewDetails={onViewDetails} />
          ))
        )}
      </div>
    </section>
  );
}
