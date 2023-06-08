import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Experience } from "../components/Experience.js";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import * as THREE from 'three'; // Import THREE object

const CameraControls = ({ diaries, onCameraUpdate, handleDashboardClick }) => {
  const camera = useRef();

  const handleDiaryClick = () => {
    router.push("/DiaryPage");
    console.log("Diary object clicked");
    // Perform any other desired actions
  };

  useFrame(() => {
    if (camera.current) {
      onCameraUpdate(camera.current);
    }
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
