import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import CameraControls from '../components/CameraControls';
import { useRouter } from 'next/navigation';
import { db } from '../firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import * as THREE from 'three';
import { useSession } from 'next-auth/react';
import Layout from '../components/Layout';
import { useAudio } from '../contexts/AudioContext';

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

    const getLastDiary = () => {
      if (diaries.length === 0) {
        return null;
      }
      return diaries[diaries.length - 1];
    };

    const lastDiary = getLastDiary();

    const seconds = lastDiary.date.seconds;
    const nanoseconds = lastDiary.date.nanoseconds;

    const timestampInMilliseconds = (seconds * 1000) + (nanoseconds / 1000000);

    const lastDiaryTime = new Date(timestampInMilliseconds);
    const now = new Date();

    console.log("lastDiaryTime: " + lastDiaryTime);
    console.log("now: " + now);

    const nowMonth = now.getMonth();
    const nowDate = now.getDate();

    const lastDiaryMonth = lastDiaryTime.getMonth();
    const lastDiaryDate = lastDiaryTime.getDate();

    if (nowMonth == lastDiaryMonth && nowDate == lastDiaryDate) { // 오늘 일기 이미 작성함
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
  const { BGMRef, BGSRef, toggleBGM, toggleBGS, playBGM, playBGS, isBGMPlaying, isBGSPlaying, changeBGM, changeBGS } = useAudio();


  useEffect(() => {
    setTimeout(() => {
      BGMRef.current.muted = false;
      BGSRef.current.muted = false;
      playBGM();
      playBGS();
    }, 1000); // 1000 밀리초 (1초) 후에 muted를 false로 설정합니다.
  }, []);


  return (
    <Layout delay={0.8}>
      <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
        {/* BGM 재생/정지 버튼 */}
        <button
          onClick={toggleBGM}
          style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1000 }}
        >
          {isBGMPlaying ? 'BGM정지' : 'BGM재생'}
        </button>

        {/* BGM 노래 변경 버튼 */}
        {[0, 1, 2, 3].map((index) => (
          <button
            onClick={() => changeBGM(index)}
            style={{ position: 'absolute', top: '10px', left: `${100 + index * 60}px`, zIndex: 1000 }}
            key={index}
          >
            BGM {index + 1}
          </button>
        ))}

        {/* BGS 재생/정지 버튼 */}
        <button
          onClick={toggleBGS}
          style={{ position: 'absolute', top: '50px', left: '10px', zIndex: 1000 }}
        >
          {isBGSPlaying ? 'BGS정지' : 'BGS재생'}
        </button>

        {/* BGS 노래 변경 버튼 */}
        {[0, 1, 2, 3].map((index) => (
          <button
            onClick={() => changeBGS(index)}
            style={{ position: 'absolute', top: '50px', left: `${100 + index * 60}px`, zIndex: 1000 }}
            key={index}
          >
            BGS {index + 1}
          </button>
        ))}

        <Canvas orthographic camera={{ zoom: cameraZoom, position: cameraPosition }} style={{ background: '#6096B4' }}>
          <CameraControls diaries={diaries} handleDiaryClick={handleDiaryClick} handleDashboardClick={handleDashboardClick} />
        </Canvas>
      </div>
    </Layout>
  );

};

export default MainPage;
