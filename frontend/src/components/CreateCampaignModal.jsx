import { useState } from 'react';
import { createCampaign } from '../services/api';
import { CATEGORIES } from '../data/mockCampaigns';

const CAMPAIGN_CATEGORIES = CATEGORIES.filter((c) => c !== 'All');

export default function CreateCampaignModal({ user, onClose, onCreated, onLoginRequired }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    target_amount: '',
    image_url: '',
    category: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!user) {
    return (
      <div className="modal-overlay" role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal-box modal-box-sm">
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🔒</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800, color: 'var(--navy)', marginBottom: 10 }}>
              Sign In Required
            </h2>
            <p style={{ color: 'var(--gray-500)', fontSize: 15, marginBottom: 24 }}>
              You need to be logged in to start a campaign.
            </p>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => { onClose(); onLoginRequired(); }}>
              Login / Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const validate = () => {
    const e = {};
    if (!form.title.trim())           e.title       = 'Campaign title is required.';
    if (!form.description.trim())     e.description = 'Description is required.';
    const amt = parseFloat(form.target_amount);
    if (!amt || amt <= 0)             e.target_amount = 'Enter a valid target amount greater than 0.';
    if (form.image_url && !/^https?:\/\/.+/.test(form.image_url))
                                      e.image_url   = 'Please enter a valid URL (starting with http:// or https://).';
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => { const next = { ...err }; delete next[field]; return next; });
    setApiError('');
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setSubmitting(true);
    try {
      const payload = {
        title:         form.title.trim(),
        description:   form.description.trim(),
        target_amount: parseFloat(form.target_amount),
        ...(form.image_url ? { image_url: form.image_url.trim() } : {}),
        ...(form.category   ? { category: form.category }         : {}),
      };
      const created = await createCampaign(payload);
      setSuccess(true);
      onCreated(created);
    } catch (err) {
      setApiError(
        err?.data?.detail ||
        err?.data?.title?.[0] ||
        err?.data?.non_field_errors?.[0] ||
        'Failed to create campaign. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="modal-overlay" role="dialog" aria-modal="true">
        <div className="modal-box modal-box-sm">
          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🚀</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800, color: 'var(--navy)', marginBottom: 10 }}>
              Campaign Launched!
            </h2>
            <p style={{ color: 'var(--gray-500)', fontSize: 15, marginBottom: 24 }}>
              Your campaign has been created successfully. Share it with friends and family to start raising funds!
            </p>
            <button className="btn btn-teal btn-lg" style={{ width: '100%' }} onClick={onClose}>
              Back to Campaigns
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Create Campaign" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box modal-box-md">
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="create-modal-header">
          <h2>🚀 Start Your Campaign</h2>
          <p>Share your story and start raising funds for your cause</p>
        </div>

        <form className="create-modal-body" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="campaign-title">Campaign Title *</label>
            <input
              id="campaign-title"
              className="form-input"
              type="text"
              placeholder="e.g. Help build a school library in Humla"
              value={form.title}
              onChange={handleChange('title')}
            />
            {errors.title && <p className="form-error">{errors.title}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="campaign-category">Category</label>
            <select
              id="campaign-category"
              className="form-input"
              value={form.category}
              onChange={handleChange('category')}
              style={{ appearance: 'auto' }}
            >
              <option value="">Select a category…</option>
              {CAMPAIGN_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="campaign-description">Your Story *</label>
            <textarea
              id="campaign-description"
              className="form-textarea"
              placeholder="Tell donors why this campaign matters, who it will help, and how funds will be used…"
              value={form.description}
              onChange={handleChange('description')}
              rows={5}
            />
            {errors.description && <p className="form-error">{errors.description}</p>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="campaign-target">Fundraising Goal (Rs) *</label>
              <input
                id="campaign-target"
                className="form-input"
                type="number"
                min="1"
                placeholder="e.g. 250000"
                value={form.target_amount}
                onChange={handleChange('target_amount')}
              />
              {errors.target_amount && <p className="form-error">{errors.target_amount}</p>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="campaign-image">Campaign Image URL</label>
              <input
                id="campaign-image"
                className="form-input"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={form.image_url}
                onChange={handleChange('image_url')}
              />
              {errors.image_url && <p className="form-error">{errors.image_url}</p>}
            </div>
          </div>

          {apiError && <p className="form-error" role="alert" style={{ marginBottom: 12 }}>⚠️ {apiError}</p>}

          <button
            type="submit"
            className="btn btn-teal btn-lg"
            disabled={submitting}
            id="create-campaign-submit"
            style={{ width: '100%' }}
          >
            {submitting
              ? <><span className="btn-spinner" /> Creating Campaign…</>
              : '🚀 Launch Campaign'}
          </button>
        </form>
      </div>
    </div>
  );
}
