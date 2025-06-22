import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../context/UserContext';

/**
 * AdminNotes — create a new note + assignment
 *
 * Fix: the assignment PDF link stored in MongoDB is now **absolute** so it
 * always points to the Express server that serves /uploads, regardless of
 * which origin (localhost:3000 in dev, CDN in prod) the React bundle is
 * running from.
 */
export default function AdminNotes() {
  const { userData } = useContext(UserContext);
  const { batchName } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', meetlink: '', quizlink: '' });
  const [pdfFile, setPdfFile] = useState(null);

  /**
   * Helper that builds the absolute URL pointing at the backend
   * (Express serves /uploads statically).  We fall back to localhost:5003
   * when the REACT_APP_BACKEND_URL env‑var is not set.
   */
  const backendBase =
    process.env.REACT_APP_BACKEND_URL || 'http://localhost:5003';

  const addNote = async () => {
    if (!form.title || !pdfFile) {
      return alert('Please provide a title and upload a PDF.');
    }

    try {
      // 1️⃣ Upload the assignment PDF to local disk + S3
      const formData = new FormData();
      formData.append('file', pdfFile);

      await axios.post(
        `${backendBase}/upload-assignment?` +
          `batch=${encodeURIComponent(batchName)}&` +
          `module=${encodeURIComponent(userData.domain)}&` +
          `title=${encodeURIComponent(form.title)}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // 2️⃣ Build the ABSOLUTE URL that consumers will click on
      const assignmentlink =
        `${backendBase}/uploads/` +
        `${encodeURIComponent(batchName)}/` +
        `${encodeURIComponent(userData.domain)}/` +
        `${encodeURIComponent(form.title)}/assignment/question.pdf`;

      // 3️⃣ Create the Note document in MongoDB
      await axios.post(`${backendBase}/notes`, {
        ...form,
        batch: batchName,
        module: userData.domain,
        admin_username: userData.username,
        assignmentlink // <- absolute, always reachable
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
