import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import UserContext from '../context/UserContext';

const socket = io('http://localhost:5004');

export default function AdminChat() {
  const { batchId } = useParams(); // use `/admin/batch/:batchId/chat`
  const { userData: user } = useContext(UserContext); // ✅ Fixed
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!user?.domain) return;
    fetch(`http://localhost:5004/chatrooms/${batchId}/${user.domain}`)
      .then(res => res.json())
      .then(data => {
        const roomList = data.map(name => ({
          name,
          room: `${batchId}/${user.domain}/${name}`
        }));
        setRooms(roomList);
      });
  }, [batchId, user]);

  useEffect(() => {
    socket.on('chatHistory', h => setMessages(h));
    socket.on('message', m => setMessages(prev => [...prev, m]));
    return () => {
      socket.off('chatHistory');
      socket.off('message');
    };
  }, []);

  const open = (room) => {
    if (selectedRoom) socket.emit('leaveRoom', { room: selectedRoom }); // ✅ leave previous room
    setSelectedRoom(room);
    setMessages([]);
    socket.emit('joinRoom', { name: 'Admin', room });
  };

  const send = () => {
    if (!selectedRoom || !text) return;
    socket.emit('message', { name: 'Admin', room: selectedRoom, message: text });
    setText('');
  };

  return (
    <div>
      <h2>Admin Chat – Batch {batchId}, Module {user?.domain}</h2>
      {rooms.map(r => (
        <button key={r.room} onClick={() => open(r.room)}>
          {r.name}
        </button>
      ))}
      {selectedRoom && (
        <>
          <h4>Room: {selectedRoom}</h4>
          <div style={{ maxHeight: 250, overflowY: 'auto', border: '1px solid #ccc' }}>
            {messages.map((m, i) => <div key={i}>{m}</div>)}
          </div>
          <input value={text} onChange={e => setText(e.target.value)} />
          <button onClick={send}>Send</button>
        </>
      )}
    </div>
  );
}
