import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../context/UserContext';

function AdminBatches() {
  const { userData } = useContext(UserContext);
  const { batchName } = useParams();
  const [notes, setNotes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedNote, setEditedNote] = useState({});
  const [uploadFile, setUploadFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5003/notes/${batchName}/${userData.domain}`)
      .then(res => setNotes(res.data));
  }, [batchName, userData.domain]);

  const handleEdit = (note) => {
    setEditId(note._id);
    setEditedNote(note);
  };

  const handleSave = async () => {
    await axios.put(`http://localhost:5003/notes/${editId}`, editedNote);
    setEditId(null);
    const res = await axios.get(`http://localhost:5003/notes/${batchName}/${userData.domain}`);
    setNotes(res.data);
  };

  const handleAssignmentUpload = async () => {
    if (!uploadFile || !editedNote.title) {
      alert("Select a file and ensure title is filled");
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      const res = await axios.post(
        `http://localhost:5003/upload-assignment?batch=${batchName}&module=${userData.domain}&title=${encodeURIComponent(editedNote.title)}`,
        formData
      );

      const assignmentlink = res.data.s3Url;

      setEditedNote(prev => ({ ...prev, assignmentlink }));

      alert("✅ Uploaded to S3");
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
    }
  };

  const handleChat = () => {
    navigate(`/admin/batch/${batchName}/chat`);
  };

  return (
    <div>
      <h2>Notes for Batch: {batchName} (Module: {userData.domain})</h2>
      <button onClick={() => navigate(`/admin/batch/${batchName}/notes/new`)}>New Note</button>
      <button onClick={handleChat}>Chat</button>
      <ul>
        {notes.map(note => (
          <li key={note._id} style={{ marginBottom: '20px' }}>
            {editId === note._id ? (
              <div>
                <input
                  value={editedNote.title}
                  placeholder="Title"
                  onChange={e => setEditedNote({ ...editedNote, title: e.target.value })}
                />
                <input
                  value={editedNote.meetlink}
                  placeholder="Meet Link"
                  onChange={e => setEditedNote({ ...editedNote, meetlink: e.target.value })}
                />
                <input
                  value={editedNote.quizlink}
                  placeholder="Quiz Link"
                  onChange={e => setEditedNote({ ...editedNote, quizlink: e.target.value })}
                />
                <input
                  value={editedNote.assignmentlink}
                  placeholder="Assignment Link"
                  readOnly
                />
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={e => setUploadFile(e.target.files[0])}
                />
                <button onClick={handleAssignmentUpload}>Upload Assignment PDF</button>
                <br />
                <button onClick={handleSave}>Save</button>
              </div>
            ) : (
              <div>
                <h4>{note.title}</h4>
                <p>Meet: <a href={note.meetlink}>{note.meetlink}</a></p>
                <p>Quiz: <a href={note.quizlink}>{note.quizlink}</a></p>
                <p>Assignment: <a href={note.assignmentlink} target="_blank" rel="noreferrer">View</a></p>
                <button onClick={() => handleEdit(note)}>Edit</button>
                <button onClick={() => navigate(`/admin/batch/${batchName}/evaluate/${note.title}`)}>Evaluate</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminBatches;
