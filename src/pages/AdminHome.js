import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

function AdminHome() {
  const { userData, setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    setUserData(null);
    navigate('/');
  };

  return (
    <div>
      <h2>Welcome Admin {userData?.name}</h2>
      {userData.batches.map((batch, i) => (
        <button key={i} onClick={() => navigate(`/admin/batch/${batch}`)}>
          Batch {batch}
        </button>
      ))}
      <br />
      <button onClick={() => navigate('/admin/profile')}>Profile</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default AdminHome;
