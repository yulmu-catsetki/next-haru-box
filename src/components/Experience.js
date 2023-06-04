import React from 'react';
import { OrbitControls, ScrollControls } from "@react-three/drei";
import { Room } from "./Room.js";

import { Canvas, Group } from "@react-three/fiber";

export function Experience({ handleDiaryClick, handleDashboardClick }) {
  return (
    <group scale={[1, 1, 1]}>
      <ambientLight intensity={1.6} />
      <OrbitControls enableZoom={true} />
      <ScrollControls  damping={0.2}>
        
        <Room
          handleDiaryClick={handleDiaryClick}
          handleDashboardClick={handleDashboardClick}
        />
      </ScrollControls>
    </group>
  );
}
