import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StudentHome() {
  const { userData, setUserData } = useContext(UserContext);
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await axios.get(`http://localhost:5002/student/modules/${userData.course_type}`);
        setModules(res.data.modules);
      } catch {
        alert('Failed to load modules');
      }
    };
    fetchModules();
  }, [userData]);

  const logout = () => {
    localStorage.clear();
    setUserData(null);
    navigate('/');
  };

  return (
    <div>
      <h2>Welcome Student {userData?.name}</h2>
      {modules.map((mod, i) => (
        <button key={i} onClick={() => navigate(`/student/module/${mod}`)}>
          {mod}
        </button>
      ))}
      <br />
      <button onClick={() => navigate('/student/profile')}>Profile</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default StudentHome;
