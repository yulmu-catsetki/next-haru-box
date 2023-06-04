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


const StartPage = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/MainPage'); // Navigate to the '/main' page
  };

  return (
    <div>
      <h1>Start Page</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default StartPage;

