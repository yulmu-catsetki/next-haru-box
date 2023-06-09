import React, { useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { Html } from '@react-three/drei';
import { useRouter } from 'next/navigation';
export function Diary({diaries}) {
  const { nodes } = useGLTF('/models/diary.glb');
  const [hovered, setHovered] = useState(false);
  const ref = useRef();
  const router = useRouter();
  const handlePointerOver = () => {
    setHovered(true);
  };

  const handlePointerOut = () => {
    setHovered(false);
  };


  const textPosition = [0.084956, 0.00046,0.24007]; // Adjust the position of the text

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
    <group ref={ref} onClick={handleDiaryClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
      {Object.entries(nodes).map(([name, node], index) => (
        <mesh
          key={index}
          geometry={node.geometry}
          material={node.material}
          position={node.position}
          rotation={node.rotation}
          scale={node.scale}/>
      ))}
      {hovered && (
        <Html position={textPosition}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '150px',
              height: '25px',
              background: 'white',
              color: '#6096B4',
              font: 'Roboto',
            }}
          >
            Go to Diary Page
          </div>
        </Html>
      )}
    </group>
  );
}

useGLTF.preload('/models/diary.glb');
