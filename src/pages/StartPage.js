import React from 'react';
import { useNavigate } from 'react-router-dom';

const StartPage = () => {
const navigate = useNavigate();

  const handleLogin = () => {
    
    navigate('/main'); //일단 임시로 이렇게 둠 
  };

  return (
    <div>
      <h1>Start Page</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default StartPage;
