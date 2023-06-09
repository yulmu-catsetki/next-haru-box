import React, { useLayoutEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { usePathname, useRouter } from 'next/navigation';
import { useGLTF } from '@react-three/drei';
import styles from './Room.module.css';

export function Diary({ diaries }) {
  const { nodes, materials, animations } = useGLTF('/models/diary.glb');
  const router = useRouter();
  const ref = useRef(null);

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



  return (
    <group dispose={null} ref={ref} onClick={handleDiaryClick} >
      {Object.entries(nodes).map(([name, node], index) => (
        <mesh
          key={index}
          geometry={node.geometry}
          material={node.material}
          position={node.position}
          rotation={node.rotation}
          scale={node.scale}

        />
      ))}
    </group>
  );
}

useGLTF.preload('/models/Diary.glb');
