import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Combined imports
import { getCampaignsById, deleteCampaign } from "../api/campaigns"; // Fixed import name
import { makeDonation } from "../api/donations";

const CampaignDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [campaign, setCampaigns] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [donorName, setDonorName] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [donationStatus, setDonationStatus] = useState('');

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const data = await getCampaignsById(id);
                setCampaigns(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load campaign details.');
            } finally {
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [id]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this campaign?");
        if (!confirmDelete) return;

        try {
            await deleteCampaign(id);
            alert("Campaign deleted successfully.");
            navigate('/'); // Redirect to home page
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete. Only the campaign creator can delete this campaign.");
        }
    };

    const handleDonationSubmit = async (e) => {
        e.preventDefault();
        setDonationStatus('Processing...');

        try {
            const donationData = {
                campaign: id,
                donor_name: donorName,
                amount: amount,
                message: message
            };
            await makeDonation(donationData);

            setDonationStatus('Donation successful! Thank you.');
            setDonorName('');
            setAmount('');
            setMessage('');

            setCampaigns({
                ...campaign,
                raised_amount: parseFloat(campaign.raised_amount) + parseFloat(amount)
            });
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.amount) {
                setDonationStatus(err.response.data.amount[0]);
            } else {
                setDonationStatus('Failed to process donation. Please check your inputs.');
            }
        }
    };

    if (loading) return <h2>Loading campaign...</h2>;
    if (error) return <h2 style={{ color: 'red' }}>{error}</h2>;
    if (!campaign) return <h2>Campaign not found.</h2>;

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h1>{campaign.title}</h1>
            <p style={{ fontSize: '1.2rem', color: '#555' }}>{campaign.description}</p>
            <p><strong>Created by:</strong> {campaign.creator || 'Anonymous'}</p>

            <div style={{ backgroundColor: '#f4f4f4', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
                <h2>Progress</h2>
                <p><strong>Target:</strong> Rs {campaign.target_amount}</p>
                <p><strong>Raised:</strong> Rs {campaign.raised_amount}</p>
            </div>

            {/* --- DELETE BUTTON --- */}
            <div style={{ marginTop: '15px' }}>
                <button 
                    onClick={handleDelete}
                    style={{ backgroundColor: '#dc3545', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Delete Campaign
                </button>
            </div>

            {/* --- DONATION FORM --- */}
            <div style={{ border: '2px solid #ccc', padding: '20px', borderRadius: '8px', marginTop: '30px' }}>
                <h3>Make a Donation</h3>
                
                {donationStatus && (
                    <p style={{ 
                        color: donationStatus.includes('successful') ? 'green' : 'red', 
                        fontWeight: 'bold' 
                    }}>
                        {donationStatus}
                    </p>
                )}

                <form onSubmit={handleDonationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label>Name: </label><br/>
                        <input 
                            type="text" 
                            value={donorName} 
                            onChange={(e) => setDonorName(e.target.value)} 
                            required 
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>
                    <div>
                        <label>Amount (Rs): </label><br/>
                        <input 
                            type="number" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            required 
                            min="1" 
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>
                    <div>
                        <label>Message (Optional): </label><br/>
                        <textarea 
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)} 
                            style={{ width: '100%', padding: '8px', minHeight: '60px' }}
                        />
                    </div>
                    <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Donate Now
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CampaignDetail;