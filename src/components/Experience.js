import React from 'react';
import { OrbitControls, ScrollControls } from "@react-three/drei";
import { Room } from "./room.js";
import { DiaryObjects } from './DiaryObjects.js';
import { Outside } from './outside.js';
import {Diary } from './Diary.js';
import * as THREE from 'three';
import { useShadow } from '@react-three/drei';



export function Experience({ diaries, handleDiaryClick, handleDashboardClick }) {
  
  return (
    <group scale={[1, 1, 1]}>
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
      <OrbitControls enableZoom={true} />
      <ScrollControls damping={1} style={{ overflow: 'hidden' }}>
        <Outside diaries={diaries} castShadow receiveShadow />
        <Diary/>
        <DiaryObjects diaries={diaries} castShadow receiveShadow />
        <Room handleDashboardClick={handleDashboardClick} receiveShadow />
      </ScrollControls>
    </group>
  );
}

