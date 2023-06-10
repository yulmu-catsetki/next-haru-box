import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import CameraControls from '../components/CameraControls';
import { useRouter } from 'next/navigation';
import { db } from '../firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import * as THREE from 'three';
import { useSession } from 'next-auth/react';
import Layout from '../components/Layout';

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

  // BGM 관련

  const [isPlaying, setIsPlaying] = useState(true);

  const audioRef = useRef(null);
  const [audioFiles, setAudioFiles] = useState([]);

  // 현재 재생 중인 트랙의 인덱스
  const [currentTrackIndex, setCurrentTrackIndex] = useState(Math.floor(Math.random() * audioFiles.length));

  // 트랙이 끝나면 다음 랜덤 트랙 재생
  const handleTrackEnd = () => {
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    setCurrentTrackIndex(randomIndex);
  };

  useEffect(() => {
    // 트랙이 끝났을 때 이벤트 리스너 설정
    const audioElement = audioRef.current;
    
    if (audioElement) {
      audioElement.addEventListener("ended", handleTrackEnd);

      return () => {
        // 컴포넌트 unmount시 이벤트 리스너 제거
        audioElement.removeEventListener("ended", handleTrackEnd);
      };
    }
}, [audioFiles]); // 의존성 배열에 audioFiles 추가


  useEffect(() => {
    // Fetch audio files from the API
    fetch('/api/audioFiles')
      .then(response => response.json())
      .then(files => {
        // Prepend the directory path to each file
        const filePaths = files.map(file => `/audio/bgm/${file}`);
        setAudioFiles(filePaths);
      })
      .catch(error => console.error('Error fetching audio files:', error));
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Layout delay={0.8}>
      <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
        <Canvas orthographic camera={{ zoom: cameraZoom, position: cameraPosition }} style={{ background: '#6096B4' }}>
          <CameraControls diaries={diaries} handleDiaryClick={handleDiaryClick} handleDashboardClick={handleDashboardClick} />
        </Canvas>
      </div>
    </Layout>
  );
};

export default MainPage;
