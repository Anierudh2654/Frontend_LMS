import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../context/UserContext';

function StudentModule() {
  const { name } = useParams();
  const { userData } = useContext(UserContext);
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
  const [answerFiles, setAnswerFiles] = useState({});

  useEffect(() => {
    if (!userData) return;

    axios.get(`http://localhost:5003/notes/${userData.batch}/${name}`)
      .then(res => setNotes(res.data))
      .catch(err => console.error('Error fetching notes:', err));
  }, [name, userData]);

  const uploadAnswer = async (note) => {
    const file = answerFiles[note._id];
    if (!file) return alert('Please choose a PDF file');

    const formData = new FormData();
    formData.append('file', file);
    await axios.post(`http://localhost:5003/notes/upload/${userData.batch}/${name}/${note.title}/${userData.name}`, formData);
    alert('Answer uploaded');
  };

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
            <p>
              Assignment: <a href={note.assignmentlink} target="_blank" rel="noreferrer">View</a><br />
              <input
                type="file"
                accept="application/pdf"
                onChange={e => setAnswerFiles({ ...answerFiles, [note._id]: e.target.files[0] })}
              />
              <button onClick={() => uploadAnswer(note)}>Upload Answer</button>
            </p>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(`/student/chat/group/${name}`)}>Group Chat</button>
      <button onClick={() => navigate(`/student/chat/admin/${name}`)}>Chat with Admin</button>
    </div>
  );
}

export default StudentModule;
