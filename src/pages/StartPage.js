import React from 'react';
import Link from 'next/link';
import {
  usePathname,
  useRouter,
  useSearchParams,
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
  redirect,  
  notFound,
} from 'next/navigation';


export default function StartPage() {

  const router = useRouter();
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

