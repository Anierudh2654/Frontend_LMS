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
  const [pdfFile, setPdfFile] = useState(null);

  const addNote = async () => {
    if (!pdfFile || !form.title) return alert('Please provide a title and upload a PDF.');

    // Upload PDF first
    const formData = new FormData();
    formData.append('file', pdfFile);

    await axios.post(
      `http://localhost:5003/upload-assignment?batch=${batchName}&module=${userData.domain}&title=${form.title}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    // Then create the note
    await axios.post('http://localhost:5003/notes', {
      ...form,
      batch: batchName,
      module: userData.domain,
      admin_username: userData.username,
      assignmentlink: `http://localhost:5003/uploads/${batchName}/${userData.domain}/${form.title}/assignment/question.pdf`
    });

    navigate(`/admin/batch/${batchName}`);
  };

  return (
    <div>
      <h3>Create Note for Batch {batchName} - Module {userData.domain}</h3>
      <input placeholder="Title" onChange={e => setForm({ ...form, title: e.target.value })} />
      <input placeholder="Meet Link" onChange={e => setForm({ ...form, meetlink: e.target.value })} />
      <input placeholder="Quiz Link" onChange={e => setForm({ ...form, quizlink: e.target.value })} />
      <input type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files[0])} />
      <button onClick={addNote}>Add Note</button>
    </div>
  );
}

export default AdminNotes;
