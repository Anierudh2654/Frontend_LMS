import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../context/UserContext';

export default function AdminNotes() {
  const { userData } = useContext(UserContext);
  const { batchName } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', meetlink: '', quizlink: '' });
  const [pdfFile, setPdfFile] = useState(null);

  const backendBase = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5003';

  const addNote = async () => {
    if (!form.title || !pdfFile) {
      return alert('Please provide a title and upload a PDF.');
    }

    try {
      const formData = new FormData();
      formData.append('file', pdfFile);

      const uploadRes = await axios.post(
        `${backendBase}/upload-assignment?batch=${batchName}&module=${userData.domain}&title=${encodeURIComponent(form.title)}`,
        formData
      );

      const assignmentlink = uploadRes.data.s3Url;

      await axios.post(`${backendBase}/notes`, {
        ...form,
        batch: batchName,
        module: userData.domain,
        admin_username: userData.username,
        assignmentlink
      });

      navigate(`/admin/batch/${batchName}`);
    } catch (err) {
      console.error('Error creating note:', err.response || err);
      alert(err.response?.data?.error || 'Failed to create note');
    }
  };

  return (
    <div>
      <h3>
        Create Note for Batch {batchName} — Module {userData.domain}
      </h3>
      <input
        placeholder="Title"
        onChange={e => setForm({ ...form, title: e.target.value })}
      />
      <br />
      <input
        placeholder="Meet Link"
        onChange={e => setForm({ ...form, meetlink: e.target.value })}
      />
      <br />
      <input
        placeholder="Quiz Link"
        onChange={e => setForm({ ...form, quizlink: e.target.value })}
      />
      <br />
      <input
        type="file"
        accept="application/pdf"
        onChange={e => setPdfFile(e.target.files[0])}
      />
      <br />
      <button onClick={addNote}>Add Note</button>
    </div>
  );
}
