import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';

import { Experience } from "../components/Experience.js";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import * as THREE from 'three'; // Import THREE object


function CameraControls({ diaries, handleDiaryClick,handleDashboardClick }) {
  const { camera } = useThree();
  const cameraRef = useRef(camera);

  const zoomToDiary = (targetPosition, targetZoom, duration) => {
    const startZoom = cameraRef.current.zoom;
    const startTime = performance.now();

    const animateZoom = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentZoom = gsap.utils.interpolate(startZoom, targetZoom, progress);
      cameraRef.current.zoom = currentZoom;
      cameraRef.current.updateProjectionMatrix();

      if (progress < 1) {
        requestAnimationFrame(animateZoom);
      }
    };

    animateZoom(performance.now());

    gsap.to(cameraRef.current.position, {
      x: targetPosition[0],
      y: targetPosition[1],
      z: targetPosition[2],
      duration: duration,
    });
  };

  const handleClick = () => {
    const targetPosition = [0, 0, 0]; // Replace with the actual diary position
    const targetZoom = 0.5;
    const duration = 2;

    zoomToDiary(targetPosition, targetZoom, duration);

    // Perform any other desired actions
    handleDiaryClick();
  };

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
