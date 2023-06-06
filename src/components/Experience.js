import React from 'react';
import { OrbitControls, ScrollControls } from "@react-three/drei";
import { Room } from "./room.js";
import { DiaryObjects } from './DiaryObjects.js';
import { Outside } from './outside.js';

export function Experience({ diaries, handleDiaryClick, handleDashboardClick }) {

  return (
    <group scale={[1, 1, 1] }>
      <ambientLight intensity={1.6} />
      <OrbitControls enableZoom={true} />
      <ScrollControls  damping={0.5}>
      <Outside/>
      <DiaryObjects diaries={diaries} />
      <Room handleDashboardClick={handleDashboardClick} />
      </ScrollControls>
      
    </group>
  );
}
