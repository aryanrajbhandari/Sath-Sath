# Sath-Sath: Student Beginner API Guide

A simple, beginner-friendly guide to connecting the **React** frontend with the **Django** backend.

---

## 1. Quick Info

* **Backend Base URL:** `http://127.0.0.1:8000/api`
* **Data Format:** Everything is sent and received in **JSON**.
* **Header needed for all POST requests:**
  ```json
  "Content-Type": "application/json"
  ```
* **How Login Works (In 3 Simple Steps):**
  1. User enters username and password at `/api/auth/login/`.
  2. Backend returns an `access` token (a long string).
  3. Save it in browser: `localStorage.setItem('token', data.access)`.  
     For protected pages, send it in headers:
     ```javascript
     headers: {
       "Authorization": `Bearer ${localStorage.getItem('token')}`
     }
     ```

---

## 2. All APIs at a Glance

| Feature | Method | URL | Needs Login? | What it does |
|---|---|---|---|---|
| **Register** | `POST` | `/api/auth/register/` | No | Create a new user account |
| **Login** | `POST` | `/api/auth/login/` | No | Get login token |
| **My Profile** | `GET` | `/api/auth/me/` | **Yes** | Get logged-in user details |
| **All Campaigns** | `GET` | `/api/campaigns/` | No | Get list of all campaigns |
| **Single Campaign** | `GET` | `/api/campaigns/<id>/` | No | Get details + donations of 1 campaign |
| **Create Campaign**| `POST` | `/api/campaigns/` | **Yes** | Post a new fundraising campaign |
| **My Campaigns** | `GET` | `/api/campaigns/my_campaigns/` | **Yes** | Get campaigns created by logged-in user |
| **Make Donation** | `POST` | `/api/donations/` | Optional | Donate money to a campaign |
| **My Donations** | `GET` | `/api/donations/my_donations/` | **Yes** | Get donations made by logged-in user |

---

## 3. Endpoints in Detail

### 3.1 Register
* **URL:** `POST /api/auth/register/`
* **Send this JSON:**
```json
{
  "username": "ramesh123",
  "email": "ramesh@gmail.com",
  "phone": "9841000000",
  "password": "mypassword123"
}
```
* **Success (201):** `{"message": "User registered successfully"}`

---

### 3.2 Login
* **URL:** `POST /api/auth/login/`
* **Send this JSON:**
```json
{
  "username": "ramesh123",
  "password": "mypassword123"
}
```
* **Success (200):**
```json
{
  "access": "eyJhbGciOi...",
  "refresh": "eyJhbGciOi..."
}
```
> **Tip:** Save `access` into `localStorage`:
> ```javascript
> localStorage.setItem('token', responseData.access);
> ```

---

### 3.3 Get My Profile
* **URL:** `GET /api/auth/me/`
* **Header:** `Authorization: Bearer <your_token>`
* **Success (200):**
```json
{
  "id": "66b123...",
  "username": "ramesh123",
  "email": "ramesh@gmail.com",
  "phone": "9841000000"
}
```

---

### 3.4 Get All Campaigns (Home Page)
* **URL:** `GET /api/campaigns/`
* **Login needed:** No
* **Success (200):** Returns a list of campaigns:
```json
[
  {
    "id": "66b2a...",
    "title": "Help Build School Library",
    "description": "We need books and chairs for our village school.",
    "target_amount": "50000.00",
    "raised_amount": "12000.00",
    "image_url": "https://example.com/photo.jpg",
    "is_active": true,
    "creator": "ramesh123"
  }
]
```

---

### 3.5 Get One Campaign (Campaign Detail Page)
* **URL:** `GET /api/campaigns/<id>/` (Example: `/api/campaigns/66b2a.../`)
* **Login needed:** No
* **Success (200):** Returns the campaign plus its list of donations:
```json
{
  "id": "66b2a...",
  "title": "Help Build School Library",
  "description": "We need books and chairs for our village school.",
  "target_amount": "50000.00",
  "raised_amount": "12000.00",
  "image_url": "https://example.com/photo.jpg",
  "is_active": true,
  "creator": "ramesh123",
  "donations": [
    {
      "donor_name": "Sita",
      "amount": "1000.00",
      "message": "Good initiative!",
      "donated_at": "2026-08-20"
    }
  ]
}
```

---

### 3.6 Create a Campaign
* **URL:** `POST /api/campaigns/`
* **Login needed:** **Yes** (Header: `Authorization: Bearer <token>`)
* **Send this JSON:**
```json
{
  "title": "Winter Clothes for Kids",
  "description": "Distributing warm clothes to children in rural areas.",
  "target_amount": 25000,
  "image_url": "https://example.com/image.png"
}
```
* **Success (201):** Returns created campaign object.

---

### 3.7 Make a Donation
* **URL:** `POST /api/donations/`
* **Login needed:** **Optional** (If logged in, send `Authorization: Bearer <token>` to attach to user account; if not logged in, anyone can donate as guest!)
* **Send this JSON:**
```json
{
  "campaign": "66b2a...",
  "donor_name": "Aayush",
  "amount": 500,
  "message": "Best wishes!"
}
```
* **Important Rules:**
  1. `amount` must be greater than 0.
  2. You cannot donate more than the remaining target. If only Rs 1,000 is left, donating Rs 2,000 gives an error: `"This donation exceeds the target amount. only 1000.00 left to raise"`.
  3. When target is reached, backend automatically marks campaign as completed (`is_active: false`).

---

### 3.8 Dashboard APIs
* **Get My Campaigns:** `GET /api/campaigns/my_campaigns/` (Needs Login token)
* **Get My Donations:** `GET /api/donations/my_donations/` (Needs Login token)

---

## 4. Easy React Examples for Beginners

### Example A: How to Fetch and Show Campaigns (Home.jsx)
```jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    // 1. Call API when page loads
    axios.get('http://127.0.0.1:8000/api/campaigns/')
      .then((res) => {
        setCampaigns(res.data);
      })
      .catch((err) => {
        console.error('Error fetching campaigns:', err);
      });
  }, []);

  return (
    <div>
      <h1>All Campaigns</h1>
      {campaigns.map((c) => (
        <div key={c.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{c.title}</h3>
          <p>{c.description}</p>
          <p>Goal: Rs {c.target_amount} | Raised: Rs {c.raised_amount}</p>
        </div>
      ))}
    </div>
  );
}

export default Home;
```

---

### Example B: Simple Login Form (Login.jsx)
```jsx
import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
        username: username,
        password: password
      });

      // Save token to localStorage
      localStorage.setItem('token', res.data.access);
      alert('Login successful!');
    } catch (err) {
      alert('Invalid username or password');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input 
        placeholder="Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
```

---

### Example C: How to Call Protected APIs (Using Token)
When making a request that requires login (like creating a campaign or viewing dashboard):

```javascript
const token = localStorage.getItem('token');

axios.post('http://127.0.0.1:8000/api/campaigns/', {
  title: 'My New Campaign',
  description: 'Details here...',
  target_amount: 10000
}, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
.then(res => alert('Campaign Created!'))
.catch(err => alert('Failed to create campaign'));
```
