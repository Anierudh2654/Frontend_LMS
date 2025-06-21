import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import axios from 'axios';

function StudentModule() {
  const { name } = useParams();
  const { userData } = useContext(UserContext);
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) return;

    axios.get(`http://localhost:5003/notes/${userData.batch}/${name}`)
      .then(res => setNotes(res.data))
      .catch(err => console.error('Error fetching notes:', err));
  }, [name, userData]);

  if (!userData) return <p>Loading...</p>;

  return (
    <div>
      <h2>Notes for {name} (Batch: {userData.batch})</h2>
      <ul>
        {notes.map(note => (
          <li key={note._id}>
            <h4>{note.title}</h4>
            <p>Meet: <a href={note.meetlink}>{note.meetlink}</a></p>
            <p>Quiz: <a href={note.quizlink}>{note.quizlink}</a></p>
            <p>Assignment: <a href={note.assignmentlink}>{note.assignmentlink}</a></p>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(`/student/chat/group/${name}`)}>Group Chat</button>
      <button onClick={() => navigate(`/student/chat/admin/${name}`)}>Chat with Admin</button>
    </div>
  );
}

export default StudentModule;
