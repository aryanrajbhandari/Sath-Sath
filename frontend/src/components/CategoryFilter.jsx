import { CATEGORIES } from '../data/mockCampaigns';

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="category-filter-wrapper">
      <div className="category-filter" role="group" aria-label="Filter campaigns by category">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-pill${active === cat ? ' active' : ''}`}
            onClick={() => onChange(cat)}
            aria-pressed={active === cat}
            id={`category-pill-${cat.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
