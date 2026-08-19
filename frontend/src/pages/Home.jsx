import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCampaigns } from "../api/campaigns";

const Home = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect (() =>{
        const fetchIt = async() => {
            try {
                const data = await getCampaigns();
                setCampaigns(data.results || data);
            }catch (err){
                console.error(err);
                setError('Failed to load campaigns');
            }finally{
                setLoading(false);
            }
        };
        fetchIt();
    }, []);
    if (loading) return <h2>Loading campaigns...</h2>
    if (error) return <h2 style={{color: 'red'}}>{error}</h2>

    return (
        <div style={{ padding: '20px' }}>
      <h2>Active Campaigns</h2>
      
      {/* A simple CSS grid/flexbox to hold the cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        
        {/* .map() loops through the list and creates a card for every single campaign */}
        {campaigns.map((campaign) => (
          
          <div key={campaign.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', width: '250px' }}>
            <h3>{campaign.title}</h3>
            
            {/* Note: Update these field names if they are different in your Django models.py */}
            <p><strong>Target:</strong> Rs {campaign.target_amount}</p>
            <p><strong>Raised:</strong> Rs {campaign.raised_amount}</p>
            
            {/* React Router's Link creates a clickable connection to the specific Campaign Detail page */}
            <Link to={`/campaign/${campaign.id}`} style={{ color: 'blue', textDecoration: 'underline' }}>
              View Details
            </Link>
          </div>
          
        ))}
        
      </div>
    </div>
    );
};
export default Home;