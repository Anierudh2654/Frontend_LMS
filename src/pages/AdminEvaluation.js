import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../context/UserContext';

export default function AdminEvaluation() {
  const { batchName, title } = useParams();
  const { userData } = useContext(UserContext);
  const [submissions, setSubs] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5003/evaluate/${batchName}/${userData.domain}/${encodeURIComponent(title)}`)
      .then(res => setSubs(res.data))
      .catch(console.error);
  }, [batchName, userData, title]);

  const markStudent = (student, value) => {
    axios.post('http://localhost:5003/mark', {
      batch: batchName,
      module: userData.domain,
      notetitle: title,
      student,
      mark: Number(value),
      type: 'assignment'
    }).then(() => {
      setSubs(prev => prev.filter(s => s.student !== student));
    }).catch(console.error);
  };

  return (
    <div>
      <h2>Evaluation – {title}</h2>
      {submissions.length === 0
        ? <p>No submissions pending.</p>
        : (
          <table border="1">
            <thead>
              <tr>
                <th>Student</th>
                <th>View Answer</th>
                <th>Enter Mark</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(sub => (
                <tr key={sub.student}>
                  <td>{sub.student}</td>
                  <td><a href={sub.answerLink} target="_blank">View PDF</a></td>
                  <td>
                    <input
                      type="number"
                      max={50}
                      min={0}
                      onBlur={e => markStudent(sub.student, e.target.value.trim())}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </div>
  );
}
