import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import CameraControls from '../components/CameraControls';
import { useRouter } from 'next/navigation';
import { db } from '../firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import * as THREE from 'three';

const MainPage = () => {
  const router = useRouter();

  const [dashboardClicked, setDashboardClicked] = useState(false);
  const [cameraZoom, setCameraZoom] = useState(150);
  const [cameraPosition, setCameraPosition] = useState([2.56529, 2.20877, -2.05944]);

  const handleDashboardClick = () => {
    console.log('Dashboard clicked');
    setDashboardClicked(true);

    
  };

  const handleCameraUpdate = (camera) => {
    if (dashboardClicked) {
      const targetPosition = new THREE.Vector3(0.04834, 0.30533, -0.73559);
      const startPosition = camera.position.clone();
  
      const targetRotation = new THREE.Vector3(0, 2.25, 0);
      const startRotation = camera.rotation.clone();
  
      const zoomDuration = 1; // Duration of zoom animation in seconds
      const zoomFrames = 30 * zoomDuration; // Total frames for the animation
  
      const step = (currentFrame) => {
        const t = currentFrame / zoomFrames;
        const newPosition = new THREE.Vector3().lerpVectors(startPosition, targetPosition, t);
        camera.position.set(newPosition.x, newPosition.y, newPosition.z);
  
        const newRotation = startRotation.y+(targetRotation.y-startRotation.y)*t;
        camera.rotation.y=newRotation;
  
        if (currentFrame < zoomFrames) {
          requestAnimationFrame(() => step(currentFrame + 1));
        } else {
          // Animation complete, update camera position and rotation
          setCameraPosition([0.04834, 0.30533, -0.73559]);
          camera.rotation.y = 2.25;
          router.push('/DashboardPage');
        }
      };
  
      step(0);
    }
    camera.zoom=2000;
    
    // Manipulate the camera as desired
    //camera.rotation.x += 0.01;
    
    // camera.rotation.z += 0.01;
  };

  const getEmotion = async () => {
    const diaryCollection = collection(db, 'users', 'dummy-id', 'diaries');
    const q = query(diaryCollection, orderBy('date', 'desc'));
    const result = await getDocs(q);
    const emotion = result.docs[0].data().emotion;
  };

  useEffect(() => {
    getEmotion();
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <h1>Main Page</h1>
      <Canvas orthographic camera={{ zoom: cameraZoom, position: cameraPosition }}>
        <CameraControls onCameraUpdate={handleCameraUpdate} handleDashboardClick={handleDashboardClick} />
      </Canvas>
    </div>
  );
};

export default MainPage;
