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
import { useSession } from "next-auth/react";

export default function StartPage() {
  const router = useRouter();
  const { data: session } = useSession();

  React.useEffect(() => {
    if (!session) {
      //router.push('/auth/signin');
    }
  }, [session, router]);

  const handleMoveToMainPage = () => {
    router.push('/MainPage'); 
  };
  return (
    <div>
      <h1>Start Page</h1>
      {session ? (
        <>
        <p>Welcome, {session.user.name}!</p>
        <button onClick={handleMoveToMainPage}>Go to MainPage</button>
        </>
      
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

