import { useState } from 'react';
import logoImg from '../assets/logo.jpg';
import { loginUser, registerUser, getCurrentUser } from '../services/api';

export default function AuthModal({ onClose, onAuthenticated }) {
  const [tab, setTab]           = useState('login'); // 'login' | 'register'
  const [form, setForm]         = useState({ username: '', email: '', phone: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => { const n = { ...err }; delete n[field]; return n; });
    setApiError('');
  };

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Username is required.';
    if (!form.password)        e.password = 'Password is required.';
    if (tab === 'register') {
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
        e.email = 'A valid email is required.';
      if (!form.phone.trim() || form.phone.length < 10)
        e.phone = 'Enter a valid phone number (min. 10 digits).';
      if (form.password.length < 8)
        e.password = 'Password must be at least 8 characters.';
    }
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      if (tab === 'login') {
        await loginUser({ username: form.username, password: form.password });
        const me = await getCurrentUser();
        setSuccess(true);
        setTimeout(() => { onAuthenticated(me); onClose(); }, 1200);
      } else {
        await registerUser({
          username: form.username,
          email:    form.email,
          phone:    form.phone,
          password: form.password,
        });
        // Auto-login after register
        await loginUser({ username: form.username, password: form.password });
        const me = await getCurrentUser();
        setSuccess(true);
        setTimeout(() => { onAuthenticated(me); onClose(); }, 1200);
      }
    } catch (err) {
      const data = err?.data || {};
      setApiError(
        data.detail ||
        data.username?.[0] ||
        data.email?.[0] ||
        data.non_field_errors?.[0] ||
        (tab === 'login' ? 'Invalid username or password.' : 'Registration failed. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={tab === 'login' ? 'Login' : 'Register'}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box modal-box-sm">
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        {/* Header */}
        <div className="auth-modal-header">
          <img src={logoImg} alt="Sath-Sath" className="auth-modal-logo" />
          <h2>{tab === 'login' ? 'Welcome Back' : 'Join Sath-Sath'}</h2>
          <p>{tab === 'login' ? 'Sign in to your account' : 'Create your account to start making an impact'}</p>
        </div>

        {/* Tabs */}
        <div className="auth-tabs" role="tablist">
          <button
            role="tab"
            className={`auth-tab${tab === 'login' ? ' active' : ''}`}
            onClick={() => { setTab('login'); setErrors({}); setApiError(''); }}
            aria-selected={tab === 'login'}
            id="auth-tab-login"
          >
            Login
          </button>
          <button
            role="tab"
            className={`auth-tab${tab === 'register' ? ' active' : ''}`}
            onClick={() => { setTab('register'); setErrors({}); setApiError(''); }}
            aria-selected={tab === 'register'}
            id="auth-tab-register"
          >
            Register
          </button>
        </div>

        {/* Form body */}
        <div className="auth-tab-body">
          {success ? (
            <div className="auth-success">
              <div className="auth-success-icon">🎉</div>
              <h3>
                {tab === 'login' ? `Welcome back, ${form.username}!` : `Welcome, ${form.username}!`}
              </h3>
              <p>{tab === 'login' ? 'You are now signed in.' : 'Your account has been created.'}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="auth-username">Username</label>
                <input
                  id="auth-username"
                  className="form-input"
                  type="text"
                  placeholder="e.g. ramesh123"
                  value={form.username}
                  onChange={handleChange('username')}
                  autoComplete="username"
                />
                {errors.username && <p className="form-error">{errors.username}</p>}
              </div>

              {tab === 'register' && (
                <>
                  <div className="form-group">
                    <label className="form-label" htmlFor="auth-email">Email</label>
                    <input
                      id="auth-email"
                      className="form-input"
                      type="email"
                      placeholder="ramesh@example.com"
                      value={form.email}
                      onChange={handleChange('email')}
                      autoComplete="email"
                    />
                    {errors.email && <p className="form-error">{errors.email}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="auth-phone">Phone Number</label>
                    <input
                      id="auth-phone"
                      className="form-input"
                      type="tel"
                      placeholder="9841000000"
                      value={form.phone}
                      onChange={handleChange('phone')}
                      autoComplete="tel"
                    />
                    {errors.phone && <p className="form-error">{errors.phone}</p>}
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="auth-password">Password</label>
                <input
                  id="auth-password"
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange('password')}
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                />
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>

              {apiError && (
                <div
                  role="alert"
                  style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: 'var(--danger)', marginBottom: 14 }}
                >
                  ⚠️ {apiError}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
                id="auth-submit-btn"
                style={{ width: '100%' }}
              >
                {loading
                  ? <><span className="btn-spinner" /> Please wait…</>
                  : tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>

              <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--gray-400)', marginTop: 16 }}>
                {tab === 'login' ? (
                  <>Don&apos;t have an account?{' '}
                    <button type="button" onClick={() => setTab('register')} style={{ background: 'none', border: 'none', color: 'var(--teal)', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                      Register here
                    </button></>
                ) : (
                  <>Already have an account?{' '}
                    <button type="button" onClick={() => setTab('login')} style={{ background: 'none', border: 'none', color: 'var(--teal)', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                      Sign in
                    </button></>
                )}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
