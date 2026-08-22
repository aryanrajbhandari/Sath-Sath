import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>My Dashboard</h1>
            <p>If you can see this, the Protected Route is working!</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;