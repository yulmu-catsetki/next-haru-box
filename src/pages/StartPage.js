import React from 'react';
import { signIn } from 'next-auth/react';
import { useNavigate } from 'react-router-dom';

export default function StartPage() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signIn('kakao', {
        callbackUrl: 'http://localhost:3000/api/auth/callback/kakao',
      });

      if (result.error) {
        console.log('Login failed:', result.error);
      } else {
        navigate('/main');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div>
      <h1>Start Page</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
