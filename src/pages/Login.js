import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

function Login() {
  const [user, setUser] = useState({ username: '', password: '' });
  const { setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post('http://localhost:5000/auth/login', user);
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);

      const details = await axios.get(`http://localhost:5000/auth/${res.data.role}/me`, {
        headers: {
          Authorization: `Bearer ${res.data.accessToken}`,
        },
      });

      setUserData(details.data);
      navigate(res.data.role === 'student' ? '/student' : '/admin');
    } catch {
      alert('Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Username" onChange={(e) => setUser({ ...user, username: e.target.value })} />
      <input type="password" placeholder="Password" onChange={(e) => setUser({ ...user, password: e.target.value })} />
      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;
