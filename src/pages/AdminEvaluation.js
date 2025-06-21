import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../context/UserContext';

function AdminEvaluation() {
  const { batchName, title } = useParams();
  const { userData } = useContext(UserContext);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5003/evaluate/${batchName}/${userData.domain}/${encodeURIComponent(title)}`)
      .then(res => setAnswers(res.data))
      .catch(err => console.error('GET /evaluate failed:', err));
  }, [batchName, userData.domain, title]);

  const handleMark = async (student, mark) => {
    try {
      await axios.post('http://localhost:5003/mark', {
        batch: batchName,
        module: userData.domain,
        notetitle: title,
        student,
        mark: Number(mark),
        type: 'assignment',
      });

      setAnswers(prev => prev.filter(a => a.student !== student));
    } catch (err) {
      console.error('POST /mark failed:', err);
    }
  };

  return (
    <div>
      <h2>Evaluation for: {title}</h2>
      {answers.length === 0 ? (
        <p>No submissions to evaluate.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Student</th>
              <th>Answer PDF</th>
              <th>Mark (out of 50)</th>
            </tr>
          </thead>
          <tbody>
            {answers.map(({ student, answerLink }) => (
              <tr key={student}>
                <td>{student}</td>
                <td>
                  <a href={answerLink} target="_blank" rel="noopener noreferrer">View</a>
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    onBlur={e => handleMark(student, e.target.value)}
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

export default AdminEvaluation;
