import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../context/UserContext';

export default function StudentModule() {
  const { name } = useParams();
  const { userData } = useContext(UserContext);
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) return;
    axios.get(`http://localhost:5003/notes/${userData.batch}/${name}`)
      .then(res => {
        const arr = Array.isArray(res.data) ? res.data : res.data.notes || [];
        setNotes(arr);
      })
      .catch(err => console.error('Fetch notes failed', err));
  }, [userData, name]);

  if (!userData) return <p>Loading...</p>;

  return (
    <div>
      <h2>Notes for {name} - Batch: {userData.batch}</h2>
      <ul>
        {notes.map(note => (
          <li key={note._id}>
            <h4>{note.title}</h4>
            <p>Meet: <a href={note.meetlink}>{note.meetlink}</a></p>
            <p>Quiz: <a href={note.quizlink}>{note.quizlink}</a></p>
            <p>
              Assignment:&nbsp;
              <a href={note.assignmentlink} target="_blank" rel="noreferrer">View</a><br/>
              <input type="file" accept="application/pdf" onChange={e => note.file = e.target.files[0]} />
              <button onClick={() => {
                if (!note.file) return alert('Choose a PDF');
                const fd = new FormData();
                fd.append('file', note.file);
                axios.post(
                  `http://localhost:5003/notes/upload/${userData.batch}/${name}/${encodeURIComponent(note.title)}/${encodeURIComponent(userData.name)}`,
                  fd
                ).then(() => alert('Answer uploaded')).catch(err => console.error(err));
              }}>
                Upload Answer
              </button>
            </p>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(`/student/chat/group/${name}`)}>Group Chat</button>
      <button onClick={() => navigate(`/student/chat/admin/${name}`)}>Chat with Admin</button>
    </div>
  );
}
