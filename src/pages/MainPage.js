import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import CameraControls from '../components/CameraControls';
import { useRouter } from 'next/navigation';
import { db } from '../firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import * as THREE from 'three';
import { useSession } from 'next-auth/react';





const MainPage = () => {
  const router = useRouter();

  const [dashboardClicked, setDashboardClicked] = useState(false);
  const [cameraZoom, setCameraZoom] = useState(150);
  const [cameraPosition, setCameraPosition] = useState([2.56529, 2.20877, -2.05944]);

  const handleDashboardClick = () => {
    console.log('Dashboard clicked');
    setDashboardClicked(true);

    
  };

  const { data: session } = useSession();

  React.useEffect(() => {
    if (!session) {
      //router.push('/auth/signin');
    }
  }, [session?.user?.id, router]);

  const handleCameraUpdate = (camera) => {
    /*if (dashboardClicked) {
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
          //router.push('/DashboardPage');
        }
      };
  
      step(0);
    }
    camera.zoom=2000; */
    
    
    // Manipulate the camera as desired
    //camera.rotation.x += 0.01;
    
    // camera.rotation.z += 0.01;
  };

  const [diaries, setDiaries] = useState([]);
  const getDiaries = async () => {
    if (!session || !session.user || !session.user.id) {
      // Handle the case when session or session.user or session.user.id is undefined
      return;
    }
  
    const diaryCollection = collection(db, 'users', session.user.id, 'diaries');
    const q = query(diaryCollection, orderBy('date'));
    const result = await getDocs(q);
  
    const fetchedDiaries = result.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    setDiaries(fetchedDiaries);
  };
  
  useEffect(() => {
    if (session) {
      getDiaries();
    }
  }, [session]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      
      <Canvas orthographic camera={{ zoom: cameraZoom, position: cameraPosition }} style={{ background: '#6096B4' }}>
        <CameraControls diaries={diaries}  onCameraUpdate={handleCameraUpdate} handleDashboardClick={handleDashboardClick}>
        </CameraControls>
      </Canvas>
    </div>
  );
};

export default MainPage;
