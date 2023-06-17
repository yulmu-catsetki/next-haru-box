import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useAudio } from '../contexts/AudioContext';
import '/public/font.css';

export default function StartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        backgroundColor: '#6096B4',
        fontFamily: 'customfont',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '80%',
          height: '80%',
          padding: '20px',
        }}
      >
        <div style={{ flex: 1, marginLeft: '10px' }}>
          <img src="/harubox.png" alt="Harubox Image" style={{ width: '80%', marginLeft: '20px' }} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ fontSize: '35px', color: 'white', marginBottom: '8px' }}>
            {session ? (
              <>
                {session.user.name}님, 안녕하세요!<br />
                오늘 하루는 어떠셨나요?
              </>
            ) : (
              'No session found.'
            )}
          </h1>
          {isLoading ? (
            <p style={{ fontFamily: 'customfont' }}>Loading...</p>
          ) : session ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button
                onClick={handleMoveToMainPage}
                style={{
                  backgroundColor: '#93BFCF',
                  color: 'white',
                  padding: '5px 40px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontFamily: 'customfont',
                  fontSize: '25px',
                  marginBottom: '5px',
                  border: 'none',
                }}
              >
                내 방으로 가기
              </button>
              <button
                onClick={handleMoveToSignInPage}
                style={{
                  backgroundColor: '#93BFCF',
                  color: 'white',
                  padding: '5px 40px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontFamily: 'customfont',
                  fontSize: '25px',
                  marginTop: '5px',
                  border: 'none',
                }}
              >
                다음에 보자!
              </button>
            </div>
          ) : (
            <p style={{ fontFamily: 'customfont' }}>No session found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
