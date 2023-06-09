import React, { useState, useEffect } from 'react';
import { OrbitControls, ScrollControls } from "@react-three/drei";
import { Room } from "./room.js";
import { DiaryObjects } from './DiaryObjects.js';
import { Outside } from './outside.js';
import { Diary } from './Diary.js';
import { Text,  } from '@react-three/drei';


export function Experience({ diaries, handleDiaryClick, handleDashboardClick }) {
  const [currentDateTime, setCurrentDateTime] = useState('');
  
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDateTime = now.toLocaleString('en-US');
      setCurrentDateTime(formattedDateTime);
    };

    const interval = setInterval(updateDateTime, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <group scale={[1, 1, 1]}>
      <group position={[0, 1.5, -1.2]} rotation={[0, 0, 0]}>
        <Text

          fontSize={0.2}
          color="white"
        >
          {currentDateTime}
        </Text>
      </group>
    <group>
    <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 7]}
        intensity={1}
        castShadow // Enable shadow casting
        shadow-mapSize-width={1024} // Adjust shadow map size as needed
        shadow-mapSize-height={1024}
        shadow-camera-far={50} // Adjust shadow camera far distance as needed
        shadow-camera-left={-10} // Adjust shadow camera bounds as needed
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.001} // Adjust shadow bias as needed
        shadow-radius={1.3} // Adjust shadow radius as needed
      />
      <OrbitControls enabled={true} maxAzimuthAngle={[-Math.PI,Math.PI]} enableDamping={true} enableZoom={true} minZoom={100} maxZoom={1000} />
      
        <Outside diaries={diaries} castShadow receiveShadow />
        <Diary handleDiaryClick ={handleDiaryClick} diaries={diaries} />

        <DiaryObjects diaries={diaries} castShadow receiveShadow />
        <Room handleDashboardClick={handleDashboardClick} receiveShadow />

    </group>
      
    </group>
  );
}
