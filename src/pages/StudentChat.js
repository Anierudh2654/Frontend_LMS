import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import UserContext from '../context/UserContext';

const socket = io('http://localhost:5004');

export default function StudentChat() {
  const { module, type } = useParams(); // type: group or admin
  const { userData: user } = useContext(UserContext);
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState('');

  const room = user
    ? type === 'group'
      ? `${user.batch}/${module}/group`
      : `${user.batch}/${module}/${user.name}`
    : null;

  useEffect(() => {
    if (!user || !room) return;

    socket.emit('joinRoom', { name: user.name, room });

    socket.on('chatHistory', h => setChat(h));
    socket.on('message', m => setChat(prev => [...prev, m]));

    return () => {
      socket.emit('leaveRoom', { room });
      socket.off('chatHistory');
      socket.off('message');
    };
  }, [room, user]);

  const send = () => {
    if (msg && room && user) {
      socket.emit('message', { name: user.name, room, message: msg });
      setMsg('');
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h3>{type === 'group' ? 'Group Chat' : 'Admin Chat'} - {module}</h3>
      <div style={{ maxHeight: 300, overflowY: 'auto' }}>
        {chat.map((m, i) => <div key={i}>{m}</div>)}
      </div>
      <input value={msg} onChange={e => setMsg(e.target.value)} />
      <button onClick={send}>Send</button>
    </div>
  );
}
