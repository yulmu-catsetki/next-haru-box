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
import { useAudio } from '../contexts/AudioContext';

export default function StartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
    } else {
      setIsLoading(false);
    }
  }, [session, router]);

  const { initPlayer } = useAudio();

  const handleMoveToMainPage = () => {
    initPlayer();
    router.push('/MainPage'); 
  };
  const handleMoveToSignInPage = () => {
    router.push('/auth/signin'); 
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#BDCDD6',
        fontFamily: '나눔손글씨 부장님 눈치체',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '60%',
          height: '80%',
          padding: '20px',
          backgroundColor: '#EEE9DA',
          border: '40px solid #6096B4',
          borderRadius: 0,
          boxSizing: 'border-box',
        }}
      >
        <h1
          style={{
            position: 'absolute',
            top: '42.5%',
            left: '100px',
            fontFamily: '나눔손글씨 부장님 눈치체',
            fontSize: '35px',
            color: '#6096B4',
          }}
        >
          {session ? (
            <>
              {session.user.name}님, 안녕하세요! <br /> 오늘 하루는 어떠셨나요?
            </>
          ) : (
            'No session found.'
          )}
        </h1>
        {isLoading ? (
          <p style={{ fontFamily: '나눔손글씨 부장님 눈치체' }}>Loading...</p>
        ) : session ? (
          <>
            <div style={{ position: 'absolute', top: '35%', right: '120px', display: 'flex', flexDirection: 'column' }}>
              <button
                onClick={handleMoveToMainPage}
                style={{
                  backgroundColor: '#93BFCF',
                  color: '#000000',
                  border: '2px solid #6096B4',
                  padding: '15px 40px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontFamily: '나눔손글씨 부장님 눈치체',
                  fontSize: '25px',
                  marginBottom: '15px',
                }}
              >
                내 방으로 가기
              </button>
              <button
                onClick={handleMoveToSignInPage}
                style={{
                  backgroundColor: '#93BFCF',
                  color: '#000000',
                  border: '2px solid #6096B4',
                  padding: '15px 40px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontFamily: '나눔손글씨 부장님 눈치체',
                  fontSize: '25px',
                  marginTop: '15px',
                }}
              >
                다음에 보자!
              </button>
            </div>
          </>
        ) : (
          <p style={{ fontFamily: '나눔손글씨 부장님 눈치체' }}>No session found.</p>
        )}
      </div>
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <img src="/harubox.png" alt="Harubox Image" style={{ width: '200px' }} />
      </div>
    </div>
  );
}