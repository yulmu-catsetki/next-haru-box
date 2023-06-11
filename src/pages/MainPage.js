import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import CameraControls from '../components/CameraControls';
import { useRouter } from 'next/navigation';
import { db } from '../firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import * as THREE from 'three';
import { useSession, signOut } from 'next-auth/react';
import { IconLogout, IconLogin } from "@tabler/icons-react";
import Layout from '../components/Layout';
import { useAudio } from '../contexts/AudioContext';
import '/public/font.css';


const confirmSignOut = () => {
  if (confirm("로그아웃 하시겠습니까?")) {
    signOut();
  }
}

const MainPage = () => {
  const router = useRouter();

  const [dashboardClicked, setDashboardClicked] = useState(false);
  const [cameraZoom, setCameraZoom] = useState(150);
  const [cameraPosition, setCameraPosition] = useState([2.56529, 2.20877, -2.05944]);

  const handleDashboardClick = () => {
    console.log('Dashboard clicked');
    setDashboardClicked(true);
    router.push("/DashboardPage");

  };
  const handleDiaryClick = () => {

    if (isLastDiaryToday()) { // 오늘 일기 이미 작성함
      alert("오늘 일기를 이미 작성하였습니다.");
    } else {
      router.push('/DiaryPage'); // Replace '/DiaryPage' with the actual path of your DiaryPage component
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
  };

  const getLastDiary = () => {
    if (diaries.length === 0) {
      return null;
    }
    return diaries[diaries.length - 1];
  };

  // 마지막 일기가 오늘 일기인지 확인
  const isLastDiaryToday = () => {
    const lastDiary = getLastDiary();
    if (!lastDiary) {
      return null;
    }
    const seconds = lastDiary.date.seconds;
    const nanoseconds = lastDiary.date.nanoseconds;

    const timestampInMilliseconds = (seconds * 1000) + (nanoseconds / 1000000);

    const lastDiaryTime = new Date(timestampInMilliseconds);
    const now = new Date();
    
    const nowMonth = now.getMonth();
    const nowDate = now.getDate();

    const lastDiaryMonth = lastDiaryTime.getMonth();
    const lastDiaryDate = lastDiaryTime.getDate();

    return (nowMonth == lastDiaryMonth && nowDate == lastDiaryDate)
  }

  const { data: session } = useSession();

  React.useEffect(() => {
    if (!session) {
      //router.push('/auth/signin');
    }
  }, [session?.user?.id, router]);

  const [diaries, setDiaries] = useState([]);
  const getDiaries = async () => {
    if (!session || !session.user || !session.user.id) {
      // Handle the case when session or session.user or session.user.id is undefined
      return;
    }
    
    const diaryCollection = collection(db, 'users', session.user.id, 'diaries');
    const q = query(diaryCollection, orderBy('date'));
    const result = await getDocs(q);

    const fetchedDiaries = result.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    setDiaries(fetchedDiaries);
  };



  useEffect(() => {
    if (session) {
      getDiaries();
    }
  }, [session]);

  // BGS/BGM 관련
  const { BGMRef, BGSRef, playBGM, playBGS, changeEmotion } = useAudio();

  useEffect(() => {
    SetBGM();
    setTimeout(() => {
      BGMRef.current.muted = false;
      BGSRef.current.muted = false;
      playBGM();
      playBGS();
    }, 1000); // 1000 밀리초 (1초) 후에 muted를 false로 설정합니다.

  }, [diaries]);

  const SetBGM = () => {
    // BGM 설정
    if(isLastDiaryToday() === null){
      return;
    }

    if (isLastDiaryToday()) {
      const lastDiary = getLastDiary();
      const emotion = lastDiary?.emotion ? lastDiary.emotion : 0;
      changeEmotion(emotion);
    } else {
      changeEmotion(0);
    }
  };

  return (
    <Layout delay={0.8}>
      <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
        {session ? (
        <div className="grid grid-cols-[1fr_auto_1fr] items-center p-2 bg-[#6096B4]">  
          <p className="col-start-2 mr-auto mb-4 font-['CustomFont'] text-[48px] font-bold text-gray-100">
            {session?.user?.name}님의 하루 상자
          </p>
          <button className="justify-self-end mr-6" onClick={() => confirmSignOut()}>
            <IconLogout className="w-10 h-10 px-2 py-2 bg-[#BDCDD6] rounded-full hover:bg-[#C7D7E0] focus:outline-none focus:shadow-outline" />
          </button>
        </div>
        ) : (
        <div className="flex justify-end items-center p-2 bg-[#6096B4]">          
          <p className=" text-lg font-bold text-gray-800 mr-6">
            Not logged in
          </p>
          <button className="mr-6 my-6" onClick={() => router.push('/auth/signin')}>
            <IconLogin className="w-10 h-10 px-2 py-2 font-bold bg-[#BDCDD6] rounded-full hover:bg-[#C7D7E0] focus:outline-none focus:shadow-outline" />
          </button>
        </div>
        )}
        <Canvas orthographic camera={{ zoom: cameraZoom, position: cameraPosition }} style={{ background: '#6096B4' }}>
          <CameraControls diaries={diaries} handleDiaryClick={handleDiaryClick} handleDashboardClick={handleDashboardClick} />
        </Canvas>
      </div>
    </Layout>
  );

};

export default MainPage;
