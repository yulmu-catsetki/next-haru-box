import React from 'react';
import { OrbitControls, ScrollControls } from "@react-three/drei";
import { Room } from "./room.js";



export function Experience({ handleDiaryClick, handleDashboardClick }) {

  return (
    <group scale={[1, 1, 1] }>
      <ambientLight intensity={1.6} />
      <OrbitControls enableZoom={true} key={true}/>
      <ScrollControls  damping={0.5}>
        
        <Room
          handleDiaryClick={handleDiaryClick}
          handleDashboardClick={handleDashboardClick}
        />
      </ScrollControls>
      
    </group>
  );
}
