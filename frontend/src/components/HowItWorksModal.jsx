export default function HowItWorksModal({ onClose, onStartCampaign, onLogin }) {
  const steps = [
    {
      num: '1',
      emoji: '📝',
      title: 'Create Your Campaign',
      desc: 'Sign up, share your story, set a fundraising goal, and add a photo. It takes less than 5 minutes to go live.',
    },
    {
      num: '2',
      emoji: '📣',
      title: 'Share With Your Community',
      desc: 'Spread the word through family, friends, social media, and local networks. Every share brings you closer to your goal.',
    },
    {
      num: '3',
      emoji: '💛',
      title: 'Receive Donations Securely',
      desc: 'Anyone can donate — with or without an account. Sath-Sath processes funds transparently and donors can leave messages of support.',
    },
    {
      num: '4',
      emoji: '🎯',
      title: 'Reach Your Goal & Make an Impact',
      desc: 'Once your target is reached, the campaign is automatically marked complete. Your success story inspires more changemakers.',
    },
  ];

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="How It Works"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box modal-box-md">
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="hiw-modal-header">
          <h2>💡 How Sath-Sath Works</h2>
          <p>Raise funds quickly, securely, and transparently — in four simple steps</p>
        </div>

        <div className="hiw-body">
          <div className="hiw-steps">
            {steps.map((step) => (
              <div key={step.num} className="hiw-step">
                <div className="hiw-step-num">{step.emoji}</div>
                <div className="hiw-step-content">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ borderTop: '1px solid var(--gray-200)', marginTop: 32, paddingTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              className="btn btn-teal btn-lg"
              onClick={() => { onClose(); onStartCampaign(); }}
              id="hiw-start-campaign"
              style={{ flex: 1 }}
            >
              ✦ Start a Campaign
            </button>
            <button
              className="btn btn-outline-navy btn-lg"
              onClick={() => { onClose(); onLogin(); }}
              id="hiw-login"
              style={{ flex: 1 }}
            >
              Login / Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
