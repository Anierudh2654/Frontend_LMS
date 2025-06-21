import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import axios from 'axios';

function StudentProfile() {
  const { userData, setUserData } = useContext(UserContext);
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    setUserData(null);
    navigate('/');
  };

  const changePassword = async () => {
    try {
      await axios.post('http://localhost:5000/auth/change-password', {
        username: userData.username,
        newPassword,
      });
      alert('Password changed successfully');
    } catch {
      alert('Failed to change password');
    }
  };

  return (
    <div>
      <h2>Student Profile</h2>
      <pre>{JSON.stringify(userData, null, 2)}</pre>

      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={changePassword}>Change Password</button>
      <br />
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default StudentProfile;
