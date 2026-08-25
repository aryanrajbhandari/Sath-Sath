import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCampaign } from '../api/campaigns';

const CreateCampaign = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Pack the data to match your Django model fields
      const campaignData = {
        title: title,
        description: description,
        target_amount: targetAmount,
      };

      // 2. Call the backend API
      const newCampaign = await createCampaign(campaignData);
      console.log('Campaign created successfully:', newCampaign);

      // 3. Redirect user to home page or detail page
      navigate('/');
    } catch (err) {
      console.error('Failed to create campaign:', err);
      if (err.response && err.response.data) {
        // Show error message returned by Django validation
        setError(JSON.stringify(err.response.data));
      } else {
        setError('Failed to create campaign. Please check your inputs.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h2>Create a New Campaign</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label><strong>Campaign Title:</strong></label><br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="e.g. Help Build a Community Library"
          />
        </div>

        <div>
          <label><strong>Target Amount (Rs):</strong></label><br />
          <input
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
            min="1"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="e.g. 50000"
          />
        </div>

        <div>
          <label><strong>Description:</strong></label><br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="5"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="Explain why you are raising funds..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating...' : 'Publish Campaign'}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;