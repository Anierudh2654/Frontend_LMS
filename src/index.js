import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserContext from './context/UserContext';

const Root = () => {
  const [userData, setUserData] = useState(null);
  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      <App />
    </UserContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);
