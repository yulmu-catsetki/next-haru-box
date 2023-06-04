import React, { useState } from 'react';
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import StartPage from './StartPage';
import MainPage from './MainPage';
import DiaryPage from './DiaryPage';
import DashboardPage from './DashboardPage';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <div className="App">
      <h1>3D Website</h1>
      {router.pathname === '/' && <StartPage setIsLoggedIn={setIsLoggedIn} />}
      {isLoggedIn && router.pathname.startsWith('/MainPage') && <MainPage />}
      {router.pathname === '/DiaryPage' && <DiaryPage />}
      {router.pathname === '/DashboardPage' && <DashboardPage />}
    </div>
  );
}



