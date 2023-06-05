import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Experience } from "../components/Experience.js";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";


const CameraControls = ({ onCameraUpdate, handleDashboardClick }) => {
  const camera = useRef();
  const handleDiaryClick = () => {
    router.push("/DiaryPage");
    console.log("Diary object clicked");
    // Perform any other desired actions
  };

  /*
  const handleDashboardClick = () => {
    //router.push("/DashboardPage");
    camera.current.position.set(0.04834, 0.30533, -0.73559);
    //camera.current.position = [0.04834, 0.30533, -0.73559];
    console.log("Dashboard object clicked");
    // Perform any other desired actions
  };*/
  useFrame(() => {
    if (camera.current) {
    onCameraUpdate(camera.current);
      
    }
  });
  const zoomLevel = handleDashboardClick ? 10 : 200; // Set the desired zoom level
  const position = handleDashboardClick ? [0.04834, 0.30533, -0.73559] : [2.56529, 2.20877, -2.05944];
  return (
    
    <OrthographicCamera
        ref={camera}
        zoom={zoomLevel}
        position={position}
        rotation = {[0,1.5450420922457775,0]}
        near={0.1}
        far={1000}
        
    >
        
    <Experience handleDiaryClick={handleDiaryClick} handleDashboardClick={handleDashboardClick} />
    </OrthographicCamera>
    );
};

export default CameraControls;
