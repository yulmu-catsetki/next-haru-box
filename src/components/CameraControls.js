import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';

import { Experience } from "../components/Experience.js";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import * as THREE from 'three'; // Import THREE object


function CameraControls({ diaries, handleDiaryClick,handleDashboardClick }) {
  const { camera } = useThree();
  const cameraRef = useRef(camera);

  useFrame(() => {
   
  });

  return (
    <OrthographicCamera
      ref={camera}
      rotation={[0, 1.5450420922457775, 0]}
      near={0.1}
      far={1000}
    >
      <Experience diaries={diaries} handleDiaryClick={handleDiaryClick} handleDashboardClick={handleDashboardClick} />
    </OrthographicCamera>
  );
};

export default CameraControls;
