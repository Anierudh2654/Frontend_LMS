import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../context/UserContext';

function AdminNotes() {
  const { userData } = useContext(UserContext);
  const { batchName } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    meetlink: '',
    quizlink: '',
    assignmentlink: ''
  });

  const addNote = async () => {
    await axios.post('http://localhost:5003/notes', {
      ...form,
      batch: batchName,
      module: userData.domain,
      admin_username: userData.username
    });
    navigate(`/admin/batch/${batchName}`);
  };

  return (
    <div>
      <h3>Create Note for Batch {batchName} - Module {userData.domain}</h3>
      <input placeholder="Title" onChange={e => setForm({ ...form, title: e.target.value })} />
      <input placeholder="Meet Link" onChange={e => setForm({ ...form, meetlink: e.target.value })} />
      <input placeholder="Quiz Link" onChange={e => setForm({ ...form, quizlink: e.target.value })} />
      <input placeholder="Assignment Link" onChange={e => setForm({ ...form, assignmentlink: e.target.value })} />
      <button onClick={addNote}>Add Note</button>
    </div>
  );
}

export default AdminNotes;
