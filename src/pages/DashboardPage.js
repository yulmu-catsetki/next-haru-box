import React from 'react';
import { useEffect } from 'react';
import { db } from "../firebase";
import { Experience } from "../components/Experience.js";
import { Canvas,useFrame } from "@react-three/fiber";
import CameraControls from '../components/CameraControls';
import styles from "../components/Room.module.css";
import {
  collection,
  query,
  doc,
  getDocs,
  orderBy
} from "firebase/firestore";

const DashboardPage = () => {
  // Fetch user's diary entries from a server or local storage
  // Generate postcard images based on diary entries using AIImageService
  // Render postcards with the generated images and relevant information

  const diaries = [];
  const handleCameraUpdate = (camera) => {
    // Manipulate the camera as desired
    //camera.rotation.x += 0.01;
    //camera.rotation.y += 0.01;
    //camera.rotation.z += 0.01;
  };
  const getDiaries = async () => {  
    const diaryCollection = collection(db, "users", "dummy-id", "diaries");
    const q = query(
      diaryCollection,
      orderBy('date')
    );
    const result = await getDocs(q);
    result.docs.forEach((doc) => {
      diaries.push({ id: doc.id, ...doc.data() });
    });
  }

  useEffect(() => {
    getDiaries();
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
    
        <Canvas orthographic camera={{ zoom: 100, position: [0.04834, 0.30533, -0.73559] }}>
          <CameraControls onCameraUpdate={handleCameraUpdate} />
        </Canvas>
      
    </div>
  );
};

export default DashboardPage;
