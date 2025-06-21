import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import StudentHome from './pages/StudentHome';
import AdminHome from './pages/AdminHome';
import StudentProfile from './pages/StudentProfile';
import AdminProfile from './pages/AdminProfile';
import StudentModule from './pages/StudentModule';
import AdminBatches from './pages/AdminBatches';
import AdminNotes from './pages/AdminNotes';
import AdminChat from './pages/AdminChat';
import StudentChat from './pages/StudentChat';
import AdminEvaluation from './pages/AdminEvaluation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student" element={<StudentHome />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/student/module/:name" element={<StudentModule />} />
        <Route path="/admin/batch/:batchName" element={<AdminBatches />} />
        <Route path="/admin/batch/:batchName/notes/new" element={<AdminNotes />} />
        <Route path="/admin/batch/:batchId/chat" element={<AdminChat />} />
        <Route path="/student/chat/:type/:module" element={<StudentChat />} />
        <Route path="/admin/batch/:batchName/evaluate/:title" element={<AdminEvaluation />} />
      </Routes>
    </Router>
  );
}

export default App;
