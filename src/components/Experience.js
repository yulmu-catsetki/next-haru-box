import React from 'react';
import { OrbitControls, ScrollControls } from "@react-three/drei";
import { Room } from "./room.js";

import { Outside } from './outside.js';

export function Experience({ handleDiaryClick, handleDashboardClick }) {

  return (
    <group scale={[1, 1, 1] }>
      <ambientLight intensity={1.6} />
      <OrbitControls enableZoom={true} />
      <ScrollControls  damping={0.5}>
      <Outside/>

      <Room handleDashboardClick={handleDashboardClick} />
      </ScrollControls>
      
    </group>
  );
}
